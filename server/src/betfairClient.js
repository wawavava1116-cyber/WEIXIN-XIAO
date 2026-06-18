const fs = require('fs')
const https = require('https')
const querystring = require('querystring')

const BETTING_API_URL = 'https://api.betfair.com/exchange/betting/json-rpc/v1'
const KEEP_ALIVE_URL = 'https://identitysso.betfair.com/api/keepAlive'
const CERT_LOGIN_URL = 'https://identitysso-cert.betfair.com/api/certlogin'

function readRequiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env: ${name}`)
  return value
}

function requestJson(url, { method = 'GET', headers = {}, body, certOptions } = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request({
      hostname: parsed.hostname,
      path: `${parsed.pathname}${parsed.search}`,
      method,
      headers,
      cert: certOptions && certOptions.cert,
      key: certOptions && certOptions.key,
      timeout: 20000
    }, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        let json = null
        try {
          json = data ? JSON.parse(data) : null
        } catch (error) {
          reject(new Error(`Invalid JSON from Betfair: ${data.slice(0, 200)}`))
          return
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const detail = json ? JSON.stringify(json) : data
          reject(new Error(`Betfair HTTP ${res.statusCode}: ${detail}`))
          return
        }
        resolve(json)
      })
    })
    req.on('timeout', () => {
      req.destroy(new Error('Betfair request timeout'))
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

function getAuthHeaders(sessionToken = process.env.BETFAIR_SESSION_TOKEN) {
  return {
    'X-Application': readRequiredEnv('BETFAIR_APP_KEY'),
    'X-Authentication': sessionToken,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}

async function callBettingApi(method, params = {}, sessionToken) {
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    method: `SportsAPING/v1.0/${method}`,
    params,
    id: Date.now()
  })
  const response = await requestJson(BETTING_API_URL, {
    method: 'POST',
    headers: getAuthHeaders(sessionToken),
    body: payload
  })
  if (response.error) {
    const errorCode = response.error.data &&
      response.error.data.APINGException &&
      response.error.data.APINGException.errorCode
    throw new Error(`Betfair ${method} failed: ${errorCode || response.error.message}`)
  }
  return response.result
}

async function keepAlive(sessionToken = process.env.BETFAIR_SESSION_TOKEN) {
  const response = await requestJson(KEEP_ALIVE_URL, {
    method: 'POST',
    headers: {
      'X-Application': readRequiredEnv('BETFAIR_APP_KEY'),
      'X-Authentication': sessionToken,
      Accept: 'application/json'
    }
  })
  if (response.status !== 'SUCCESS') {
    throw new Error(`Betfair keepAlive failed: ${response.error || 'UNKNOWN'}`)
  }
  return response
}

function readCertOptions() {
  const certPath = process.env.BETFAIR_CERT_PATH
  const keyPath = process.env.BETFAIR_KEY_PATH
  if (!certPath || !keyPath) return null
  return {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath)
  }
}

async function certLogin() {
  const certOptions = readCertOptions()
  if (!certOptions) throw new Error('Missing Betfair certificate paths')
  const body = querystring.stringify({
    username: readRequiredEnv('BETFAIR_USERNAME'),
    password: readRequiredEnv('BETFAIR_PASSWORD')
  })
  const response = await requestJson(CERT_LOGIN_URL, {
    method: 'POST',
    headers: {
      'X-Application': readRequiredEnv('BETFAIR_APP_KEY'),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body,
    certOptions
  })
  if (response.loginStatus !== 'SUCCESS') {
    throw new Error(`Betfair certlogin failed: ${response.loginStatus || 'UNKNOWN'}`)
  }
  process.env.BETFAIR_SESSION_TOKEN = response.sessionToken
  return response
}

module.exports = {
  callBettingApi,
  keepAlive,
  certLogin
}
