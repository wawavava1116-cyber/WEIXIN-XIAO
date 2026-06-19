const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { readStore, readDatabaseSnapshot } = require('./store')
const { syncBetfairMarkets } = require('./syncOnce')
const { keepAlive, certLogin } = require('./betfairClient')
const { buildDatabaseSnapshot } = require('./buildDatabaseSnapshot')
const { refreshLiveScoreSnapshot } = require('./liveScoreRefresh')
const {
  upsertGuest,
  upsertWechatUser,
  getUserByToken,
  saveAvatar,
  updateUserProfile,
  getAvatarFile
} = require('./userStore')
const {
  createPredictionGroup,
  decorateGroup,
  getGroupById,
  getGroupDashboard,
  getPredictionDashboard,
  getUserMedals,
  joinPredictionGroup,
  saveGroupPredictions,
  saveUserPrediction
} = require('./predictionStore')

function loadDotenvFile() {
  const envPath = path.resolve(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) return
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if (!key || process.env[key]) return
    value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
    process.env[key] = value
  })
}

loadDotenvFile()

const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '0.0.0.0'
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*'
const SYNC_INTERVAL_MS = Number(process.env.BETFAIR_SYNC_INTERVAL_MS || 300000)
const LIVE_SCORE_INTERVAL_MS = Number(process.env.LIVE_SCORE_SYNC_INTERVAL_MS || 60000)
const BETFAIR_SYNC_ENABLED = process.env.BETFAIR_SYNC_ENABLED === '1'
const WECHAT_APP_ID = process.env.WECHAT_APP_ID || process.env.WX_APP_ID || ''
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || process.env.WX_APP_SECRET || ''
const WECHAT_API_TIMEOUT_MS = Number(process.env.WECHAT_API_TIMEOUT_MS || 10000)

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  })
  res.end(JSON.stringify(payload))
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 1024 * 1024) {
        req.destroy(new Error('Request body too large'))
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function getRawRequestBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let length = 0
    req.on('data', (chunk) => {
      length += chunk.length
      if (length > maxBytes) {
        req.destroy(new Error('Request body too large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || ''
  const match = authorization.match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : ''
}

function requireProfileUser(req, res) {
  const token = getBearerToken(req)
  if (!token) {
    sendJson(res, 401, { ok: false, error: 'MISSING_TOKEN' })
    return null
  }
  const user = getUserByToken(token)
  if (!user) {
    sendJson(res, 401, { ok: false, error: 'INVALID_TOKEN' })
    return null
  }
  if (user.mode !== 'wechat' || !user.nickname || !user.avatarUrl) {
    sendJson(res, 403, { ok: false, error: 'PROFILE_REQUIRED' })
    return null
  }
  return user
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: WECHAT_API_TIMEOUT_MS }, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => {
        body += chunk
      })
      response.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (error) {
          reject(error)
        }
      })
    })
    request.on('timeout', () => {
      const error = new Error('WECHAT_API_TIMEOUT')
      error.statusCode = 504
      request.destroy(error)
    })
    request.on('error', reject)
  })
}

async function exchangeWechatCode(code) {
  if (!WECHAT_APP_ID || !WECHAT_APP_SECRET) {
    const error = new Error('WECHAT_CONFIG_MISSING')
    error.statusCode = 503
    throw error
  }
  const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session'
  const params = new URLSearchParams({
    appid: WECHAT_APP_ID,
    secret: WECHAT_APP_SECRET,
    js_code: code,
    grant_type: 'authorization_code'
  })
  let result
  try {
    result = await fetchJson(`${apiUrl}?${params.toString()}`)
  } catch (error) {
    if (!error.statusCode) error.statusCode = 502
    console.error('[wechat-login] request failed', error.message)
    throw error
  }
  if (!result || !result.openid) {
    const error = new Error(result && result.errmsg ? result.errmsg : 'WECHAT_LOGIN_FAILED')
    console.error('[wechat-login]', {
      errcode: result && result.errcode,
      errmsg: result && result.errmsg
    })
    error.statusCode = 502
    throw error
  }
  return result
}

function getPublicBaseUrl(req) {
  const configured = process.env.PUBLIC_BASE_URL || ''
  if (configured) return configured.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host || ''
  return host ? `${proto}://${host}` : ''
}

function parseContentDisposition(value) {
  const result = {}
  String(value || '').split(';').forEach((part) => {
    const item = part.trim()
    const eqIndex = item.indexOf('=')
    if (eqIndex === -1) return
    const key = item.slice(0, eqIndex).trim().toLowerCase()
    const rawValue = item.slice(eqIndex + 1).trim()
    result[key] = rawValue.replace(/^"|"$/g, '')
  })
  return result
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = String(contentType || '').match(/boundary=(?:"([^"]+)"|([^;]+))/i)
  const boundary = boundaryMatch && (boundaryMatch[1] || boundaryMatch[2])
  if (!boundary) return { fields: {}, files: {} }
  const boundaryBuffer = Buffer.from(`--${boundary}`)
  const fields = {}
  const files = {}
  let cursor = buffer.indexOf(boundaryBuffer)
  while (cursor !== -1) {
    let partStart = cursor + boundaryBuffer.length
    if (buffer.slice(partStart, partStart + 2).toString() === '--') break
    if (buffer.slice(partStart, partStart + 2).toString() === '\r\n') partStart += 2
    const nextBoundary = buffer.indexOf(boundaryBuffer, partStart)
    if (nextBoundary === -1) break
    let part = buffer.slice(partStart, nextBoundary)
    if (part.slice(part.length - 2).toString() === '\r\n') {
      part = part.slice(0, part.length - 2)
    }
    const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'))
    if (headerEnd !== -1) {
      const headerText = part.slice(0, headerEnd).toString('utf8')
      const body = part.slice(headerEnd + 4)
      const headers = headerText.split('\r\n').reduce((result, line) => {
        const index = line.indexOf(':')
        if (index !== -1) result[line.slice(0, index).trim().toLowerCase()] = line.slice(index + 1).trim()
        return result
      }, {})
      const disposition = parseContentDisposition(headers['content-disposition'])
      if (disposition.name) {
        if (disposition.filename) {
          files[disposition.name] = {
            filename: disposition.filename,
            contentType: headers['content-type'] || '',
            buffer: body
          }
        } else {
          fields[disposition.name] = body.toString('utf8')
        }
      }
    }
    cursor = nextBoundary
  }
  return { fields, files }
}

function filterMarkets(store, matchIds) {
  if (!matchIds.length) return store.markets || {}
  return matchIds.reduce((result, id) => {
    if (store.markets && store.markets[id]) result[id] = store.markets[id]
    return result
  }, {})
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, updatedAt: readStore().updatedAt || '' })
    return
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/users/avatars/')) {
    const filename = decodeURIComponent(url.pathname.replace('/api/users/avatars/', ''))
    const filePath = getAvatarFile(filename)
    if (!filePath) {
      sendJson(res, 404, { ok: false, error: 'AVATAR_NOT_FOUND' })
      return
    }
    const ext = path.extname(filePath).toLowerCase()
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
      'Cache-Control': 'public, max-age=31536000'
    })
    fs.createReadStream(filePath).pipe(res)
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/betfair/markets') {
    const matchIds = (url.searchParams.get('matchIds') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    const store = readStore()
    sendJson(res, 200, {
      updatedAt: store.updatedAt || '',
      markets: filterMarkets(store, matchIds)
    })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/database/latest') {
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    sendJson(res, 200, {
      ok: true,
      ...snapshot
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/wechat-login') {
    const body = await getRequestBody(req)
    let parsed = {}
    try {
      parsed = body ? JSON.parse(body) : {}
    } catch (error) {
      sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
      return
    }
    if (!parsed.code) {
      sendJson(res, 400, { ok: false, error: 'MISSING_CODE' })
      return
    }
    const sessionData = await exchangeWechatCode(String(parsed.code))
    const result = upsertWechatUser(sessionData)
    sendJson(res, 200, { ok: true, ...result })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/users/guest') {
    const body = await getRequestBody(req)
    let parsed = {}
    try {
      parsed = body ? JSON.parse(body) : {}
    } catch (error) {
      sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
      return
    }
    const result = upsertGuest(parsed.guestId)
    sendJson(res, 200, { ok: true, ...result })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/users/me/profile') {
    const token = getBearerToken(req)
    if (!token) {
      sendJson(res, 401, { ok: false, error: 'MISSING_TOKEN' })
      return
    }
    const contentType = req.headers['content-type'] || ''
    let nickname = ''
    let avatarUrl = ''
    if (contentType.includes('multipart/form-data')) {
      const body = await getRawRequestBody(req, 5 * 1024 * 1024)
      const parsed = parseMultipart(body, contentType)
      nickname = parsed.fields.nickname || ''
      const currentUser = getUserByToken(token)
      if (!currentUser) {
        sendJson(res, 401, { ok: false, error: 'INVALID_TOKEN' })
        return
      }
      if (parsed.files.avatar) {
        avatarUrl = saveAvatar(currentUser.id, parsed.files.avatar)
      } else {
        avatarUrl = parsed.fields.avatarUrl || ''
      }
    } else {
      const body = await getRequestBody(req)
      let parsed = {}
      try {
        parsed = body ? JSON.parse(body) : {}
      } catch (error) {
        sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
        return
      }
      nickname = parsed.nickname || ''
      avatarUrl = parsed.avatarUrl || ''
    }
    const user = updateUserProfile(token, {
      nickname,
      avatarUrl: avatarUrl && avatarUrl.startsWith('/api/') ? `${getPublicBaseUrl(req)}${avatarUrl}` : avatarUrl
    })
    if (!user) {
      sendJson(res, 401, { ok: false, error: 'INVALID_TOKEN' })
      return
    }
    sendJson(res, 200, { ok: true, user })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/users/me/predictions') {
    const user = requireProfileUser(req, res)
    if (!user) return
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    const dashboard = getPredictionDashboard(user, snapshot)
    const groups = getGroupDashboard(user, snapshot)
    const medals = getUserMedals(user, snapshot)
    sendJson(res, 200, {
      ok: true,
      ...dashboard,
      groups: groups.groups,
      medals
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/users/me/predictions') {
    const user = requireProfileUser(req, res)
    if (!user) return
    const body = await getRequestBody(req)
    let parsed = {}
    try {
      parsed = body ? JSON.parse(body) : {}
    } catch (error) {
      sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
      return
    }
    const prediction = saveUserPrediction(user, parsed)
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    const dashboard = getPredictionDashboard(user, snapshot)
    const groups = getGroupDashboard(user, snapshot)
    const medals = getUserMedals(user, snapshot)
    sendJson(res, 200, {
      ok: true,
      prediction,
      ...dashboard,
      groups: groups.groups,
      medals
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/prediction-groups') {
    const user = requireProfileUser(req, res)
    if (!user) return
    const body = await getRequestBody(req)
    let parsed = {}
    try {
      parsed = body ? JSON.parse(body) : {}
    } catch (error) {
      sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
      return
    }
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    const group = createPredictionGroup(user, parsed)
    sendJson(res, 200, { ok: true, group: decorateGroup(group, user.id, snapshot) })
    return
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/prediction-groups/')) {
    const user = getUserByToken(getBearerToken(req)) || { id: '' }
    const groupId = decodeURIComponent(url.pathname.replace('/api/prediction-groups/', '').split('/')[0])
    const group = getGroupById(groupId)
    if (!group) {
      sendJson(res, 404, { ok: false, error: 'GROUP_NOT_FOUND' })
      return
    }
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    sendJson(res, 200, { ok: true, group: decorateGroup(group, user.id, snapshot) })
    return
  }

  if (req.method === 'POST' && url.pathname.match(/^\/api\/prediction-groups\/[^/]+\/join$/)) {
    const user = requireProfileUser(req, res)
    if (!user) return
    const groupId = decodeURIComponent(url.pathname.split('/')[3])
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    const group = joinPredictionGroup(user, groupId)
    sendJson(res, 200, { ok: true, group: decorateGroup(group, user.id, snapshot) })
    return
  }

  if (req.method === 'POST' && url.pathname.match(/^\/api\/prediction-groups\/[^/]+\/predictions$/)) {
    const user = requireProfileUser(req, res)
    if (!user) return
    const groupId = decodeURIComponent(url.pathname.split('/')[3])
    const body = await getRequestBody(req)
    let parsed = {}
    try {
      parsed = body ? JSON.parse(body) : {}
    } catch (error) {
      sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
      return
    }
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    const group = saveGroupPredictions(user, groupId, parsed)
    sendJson(res, 200, { ok: true, group: decorateGroup(group, user.id, snapshot) })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/predictions/rankings') {
    const snapshot = readDatabaseSnapshot() || buildDatabaseSnapshot()
    sendJson(res, 200, {
      ok: true,
      ...getPredictionDashboard({ id: '' }, snapshot)
    })
    return
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/betfair/markets/')) {
    const matchId = decodeURIComponent(url.pathname.replace('/api/betfair/markets/', ''))
    const store = readStore()
    sendJson(res, store.markets && store.markets[matchId] ? 200 : 404, {
      updatedAt: store.updatedAt || '',
      market: store.markets && store.markets[matchId] ? store.markets[matchId] : null
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/betfair/keepalive') {
    if (!BETFAIR_SYNC_ENABLED) {
      sendJson(res, 503, { ok: false, error: 'BETFAIR_SYNC_DISABLED' })
      return
    }
    const result = await keepAlive()
    sendJson(res, 200, { ok: true, result })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/betfair/certlogin') {
    if (!BETFAIR_SYNC_ENABLED) {
      sendJson(res, 503, { ok: false, error: 'BETFAIR_SYNC_DISABLED' })
      return
    }
    const result = await certLogin()
    sendJson(res, 200, { ok: true, loginStatus: result.loginStatus })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/betfair/sync') {
    if (!BETFAIR_SYNC_ENABLED) {
      sendJson(res, 503, { ok: false, error: 'BETFAIR_SYNC_DISABLED' })
      return
    }
    await getRequestBody(req)
    const result = await syncBetfairMarkets()
    sendJson(res, 200, { ok: true, ...result })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/live-scores/sync') {
    const body = await getRequestBody(req)
    let matchIds = []
    if (body) {
      try {
        const parsed = JSON.parse(body)
        matchIds = Array.isArray(parsed.matchIds) ? parsed.matchIds : []
      } catch (error) {
        sendJson(res, 400, { ok: false, error: 'INVALID_JSON' })
        return
      }
    }
    const result = await refreshLiveScoreSnapshot(matchIds.length ? matchIds : undefined)
    sendJson(res, 200, result)
    return
  }

  sendJson(res, 404, { ok: false, error: 'NOT_FOUND' })
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, error.statusCode || 500, { ok: false, error: error.message })
  })
})

server.listen(PORT, HOST, () => {
  console.log(`World Cup data server listening on ${HOST}:${PORT}`)
})

if (BETFAIR_SYNC_ENABLED && SYNC_INTERVAL_MS > 0) {
  setInterval(() => {
    syncBetfairMarkets().catch((error) => {
      console.error(`[betfair-sync] ${error.message}`)
    })
  }, SYNC_INTERVAL_MS)
}

if (LIVE_SCORE_INTERVAL_MS > 0) {
  refreshLiveScoreSnapshot().catch((error) => {
    console.error(`[live-score-sync] ${error.message}`)
  })
  setInterval(() => {
    refreshLiveScoreSnapshot().catch((error) => {
      console.error(`[live-score-sync] ${error.message}`)
    })
  }, LIVE_SCORE_INTERVAL_MS)
}
