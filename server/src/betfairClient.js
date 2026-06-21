const fs = require('fs')
const https = require('https')
const net = require('net')
const querystring = require('querystring')
const tls = require('tls')
const { loadBetfairProxyList, pickRandomProxy } = require('./proxyPool')

const BETTING_API_URL = 'https://api.betfair.com/exchange/betting/json-rpc/v1'
const KEEP_ALIVE_URL = 'https://identitysso.betfair.com/api/keepAlive'
const CERT_LOGIN_URL = 'https://identitysso-cert.betfair.com/api/certlogin'

function readRequiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env: ${name}`)
  return value
}

function createHttpProxyTunnel(parsed, proxyUrl, timeoutMs, certOptions) {
  return new Promise((resolve, reject) => {
    const proxy = new URL(proxyUrl)
    if (proxy.protocol !== 'http:') {
      reject(new Error(`Unsupported proxy protocol: ${proxy.protocol}`))
      return
    }

    const socket = net.connect({
      host: proxy.hostname,
      port: Number(proxy.port || 80),
      timeout: timeoutMs
    })
    let settled = false
    let response = ''

    function fail(error) {
      if (settled) return
      settled = true
      socket.destroy()
      reject(error)
    }

    socket.on('connect', () => {
      const auth = proxy.username
        ? `Proxy-Authorization: Basic ${Buffer.from(`${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`).toString('base64')}\r\n`
        : ''
      socket.write([
        `CONNECT ${parsed.hostname}:443 HTTP/1.1`,
        `Host: ${parsed.hostname}:443`,
        auth.trim(),
        '',
        ''
      ].filter((line) => line !== '').join('\r\n') + '\r\n')
    })
    socket.on('timeout', () => fail(new Error('Proxy tunnel timeout')))
    socket.on('error', fail)
    socket.on('data', (chunk) => {
      response += chunk.toString('latin1')
      if (!response.includes('\r\n\r\n')) return
      const statusLine = response.split('\r\n')[0] || ''
      if (!/^HTTP\/\d(?:\.\d)? 2\d\d\b/.test(statusLine)) {
        fail(new Error(`Proxy tunnel failed: ${statusLine || 'no status'}`))
        return
      }
      socket.removeAllListeners('data')
      socket.removeAllListeners('timeout')
      socket.removeAllListeners('error')
      const tlsSocket = tls.connect({
        socket,
        servername: parsed.hostname,
        cert: certOptions && certOptions.cert,
        key: certOptions && certOptions.key
      }, () => {
        if (settled) return
        settled = true
        resolve(tlsSocket)
      })
      tlsSocket.on('error', fail)
    })
  })
}

function wrapTlsSocket(socket, parsed, certOptions, resolve, reject, markSettled) {
  const tlsSocket = tls.connect({
    socket,
    servername: parsed.hostname,
    cert: certOptions && certOptions.cert,
    key: certOptions && certOptions.key
  }, () => {
    if (markSettled()) resolve(tlsSocket)
  })
  tlsSocket.on('error', reject)
}

function createSocks5ProxyTunnel(parsed, proxyUrl, timeoutMs, certOptions) {
  return new Promise((resolve, reject) => {
    const proxy = new URL(proxyUrl)
    const username = proxy.username ? decodeURIComponent(proxy.username) : ''
    const password = proxy.password ? decodeURIComponent(proxy.password) : ''
    const socket = net.connect({
      host: proxy.hostname,
      port: Number(proxy.port || 1080),
      timeout: timeoutMs
    })
    let settled = false
    let buffer = Buffer.alloc(0)
    let stage = 'greeting'

    function markSettled() {
      if (settled) return false
      settled = true
      return true
    }

    function fail(error) {
      if (!markSettled()) return
      socket.destroy()
      reject(error)
    }

    function sendConnectRequest() {
      const host = Buffer.from(parsed.hostname)
      if (host.length > 255) {
        fail(new Error('SOCKS5 target hostname too long'))
        return
      }
      const port = Buffer.alloc(2)
      port.writeUInt16BE(443, 0)
      socket.write(Buffer.concat([
        Buffer.from([0x05, 0x01, 0x00, 0x03, host.length]),
        host,
        port
      ]))
      stage = 'connect'
    }

    function consumeConnectReply() {
      if (buffer.length < 5) return false
      if (buffer[0] !== 0x05) {
        fail(new Error('SOCKS5 invalid connect response'))
        return true
      }
      const atyp = buffer[3]
      let replyLength = 0
      if (atyp === 0x01) replyLength = 10
      if (atyp === 0x03 && buffer.length >= 5) replyLength = 5 + buffer[4] + 2
      if (atyp === 0x04) replyLength = 22
      if (!replyLength) {
        fail(new Error(`SOCKS5 unsupported address type: ${atyp}`))
        return true
      }
      if (buffer.length < replyLength) return false
      if (buffer[1] !== 0x00) {
        fail(new Error(`SOCKS5 connect failed: ${buffer[1]}`))
        return true
      }
      socket.removeAllListeners('data')
      socket.removeAllListeners('timeout')
      socket.removeAllListeners('error')
      buffer = buffer.slice(replyLength)
      if (buffer.length) socket.unshift(buffer)
      wrapTlsSocket(socket, parsed, certOptions, resolve, fail, markSettled)
      return true
    }

    socket.on('connect', () => {
      const methods = username ? [0x00, 0x02] : [0x00]
      socket.write(Buffer.from([0x05, methods.length, ...methods]))
    })
    socket.on('timeout', () => fail(new Error('SOCKS5 tunnel timeout')))
    socket.on('error', fail)
    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
      if (stage === 'greeting') {
        if (buffer.length < 2) return
        const version = buffer[0]
        const method = buffer[1]
        buffer = buffer.slice(2)
        if (version !== 0x05 || method === 0xff) {
          fail(new Error('SOCKS5 no acceptable auth method'))
          return
        }
        if (method === 0x02) {
          const user = Buffer.from(username)
          const pass = Buffer.from(password)
          if (user.length > 255 || pass.length > 255) {
            fail(new Error('SOCKS5 auth is too long'))
            return
          }
          socket.write(Buffer.concat([
            Buffer.from([0x01, user.length]),
            user,
            Buffer.from([pass.length]),
            pass
          ]))
          stage = 'auth'
          return
        }
        sendConnectRequest()
      }
      if (stage === 'auth') {
        if (buffer.length < 2) return
        const status = buffer[1]
        buffer = buffer.slice(2)
        if (status !== 0x00) {
          fail(new Error('SOCKS5 auth failed'))
          return
        }
        sendConnectRequest()
      }
      if (stage === 'connect') consumeConnectReply()
    })
  })
}

function createProxyTunnel(parsed, proxyUrl, timeoutMs, certOptions) {
  const proxy = new URL(proxyUrl)
  if (proxy.protocol === 'socks5:') {
    return createSocks5ProxyTunnel(parsed, proxyUrl, timeoutMs, certOptions)
  }
  return createHttpProxyTunnel(parsed, proxyUrl, timeoutMs, certOptions)
}

function requestJsonCore(url, { method = 'GET', headers = {}, body, certOptions, proxyUrl } = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const timeout = Number(process.env.BETFAIR_REQUEST_TIMEOUT_MS || 20000)
    const requestOptions = {
      hostname: parsed.hostname,
      path: `${parsed.pathname}${parsed.search}`,
      method,
      headers,
      cert: certOptions && certOptions.cert,
      key: certOptions && certOptions.key,
      timeout
    }

    async function startRequest() {
      if (proxyUrl) {
        const tunnel = await createProxyTunnel(parsed, proxyUrl, timeout, certOptions)
        requestOptions.agent = false
        requestOptions.createConnection = () => tunnel
      }

      const req = https.request(requestOptions, (res) => {
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
    }

    startRequest().catch(reject)
  })
}

async function requestJson(url, options = {}) {
  const proxies = await loadBetfairProxyList()
  if (!proxies.length) return requestJsonCore(url, options)

  const attempts = Math.max(1, Number(process.env.BETFAIR_PROXY_ATTEMPTS || 5))
  const tried = new Set()
  let lastError = null
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const proxyUrl = pickRandomProxy(proxies, tried)
    if (!proxyUrl) break
    tried.add(proxyUrl)
    try {
      return await requestJsonCore(url, { ...options, proxyUrl })
    } catch (error) {
      lastError = error
      console.warn(`[betfair-proxy] failed via ${proxyUrl}: ${error.message}`)
    }
  }
  throw lastError || new Error('No Betfair proxy available')
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
