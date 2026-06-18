const http = require('http')
const { readStore, readDatabaseSnapshot } = require('./store')
const { syncBetfairMarkets } = require('./syncOnce')
const { keepAlive, certLogin } = require('./betfairClient')
const { buildDatabaseSnapshot } = require('./buildDatabaseSnapshot')
const { refreshLiveScoreSnapshot } = require('./liveScoreRefresh')

const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '0.0.0.0'
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*'
const SYNC_INTERVAL_MS = Number(process.env.BETFAIR_SYNC_INTERVAL_MS || 300000)
const LIVE_SCORE_INTERVAL_MS = Number(process.env.LIVE_SCORE_SYNC_INTERVAL_MS || 60000)
const BETFAIR_SYNC_ENABLED = process.env.BETFAIR_SYNC_ENABLED === '1'

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
    sendJson(res, 500, { ok: false, error: error.message })
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
