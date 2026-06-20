const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SERVER_HOST = '82.156.36.10'
const REQUEST_TIMEOUT_MS = 12000

const ALLOWED_ROUTES = [
  { method: 'GET', pattern: /^\/health$/ },
  { method: 'GET', pattern: /^\/api\/database\/latest$/ },
  { method: 'GET', pattern: /^\/api\/betfair\/markets(\?.*)?$/ },
  { method: 'POST', pattern: /^\/api\/users\/guest$/ },
  { method: 'POST', pattern: /^\/api\/auth\/wechat-login$/ },
  { method: 'POST', pattern: /^\/api\/users\/me\/profile$/ },
  { method: 'GET', pattern: /^\/api\/users\/me\/predictions$/ },
  { method: 'POST', pattern: /^\/api\/users\/me\/predictions$/ },
  { method: 'POST', pattern: /^\/api\/prediction-groups$/ },
  { method: 'GET', pattern: /^\/api\/prediction-groups\/[^/?]+$/ },
  { method: 'POST', pattern: /^\/api\/prediction-groups\/[^/?]+\/delete$/ },
  { method: 'POST', pattern: /^\/api\/prediction-groups\/[^/?]+\/join$/ },
  { method: 'POST', pattern: /^\/api\/prediction-groups\/[^/?]+\/predictions$/ }
]

function normalizePath(path) {
  const value = String(path || '').trim()
  if (!value || value[0] !== '/' || value.indexOf('://') >= 0) return ''
  return value
}

function isAllowed(path, method) {
  return ALLOWED_ROUTES.some((route) => route.method === method && route.pattern.test(path))
}

function requestServer(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const body = method === 'GET' ? '' : JSON.stringify(data || {})
    const headers = {
      'content-type': 'application/json'
    }
    if (body) headers['content-length'] = Buffer.byteLength(body)
    if (token) headers.Authorization = `Bearer ${token}`

    const request = https.request({
      hostname: SERVER_HOST,
      port: 443,
      path,
      method,
      headers,
      rejectUnauthorized: false,
      timeout: REQUEST_TIMEOUT_MS
    }, (response) => {
      let raw = ''
      response.on('data', (chunk) => { raw += chunk })
      response.on('end', () => {
        let parsed = {}
        try {
          parsed = raw ? JSON.parse(raw) : {}
        } catch (error) {
          parsed = { ok: false, error: 'PROXY_PARSE_FAILED', raw: raw.slice(0, 200) }
        }
        resolve({ statusCode: response.statusCode, body: parsed })
      })
    })

    request.on('timeout', () => {
      request.destroy(new Error('PROXY_TIMEOUT'))
    })
    request.on('error', reject)
    if (body) request.write(body)
    request.end()
  })
}

exports.main = async (event = {}) => {
  const method = String(event.method || 'GET').toUpperCase()
  const path = normalizePath(event.path)
  if (!path || !isAllowed(path, method)) {
    return { statusCode: 403, body: { ok: false, error: 'PROXY_ROUTE_FORBIDDEN' } }
  }

  try {
    return await requestServer(path, method, event.data || {}, event.token || '')
  } catch (error) {
    return {
      statusCode: 502,
      body: {
        ok: false,
        error: error && error.message ? error.message : 'PROXY_REQUEST_FAILED'
      }
    }
  }
}
