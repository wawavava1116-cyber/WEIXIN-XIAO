const http = require('http')
const https = require('https')

let cachedProxyList = []
let cachedAt = 0

function normalizeProxy(value) {
  const raw = String(value || '').trim()
  if (!raw || raw.startsWith('#')) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^[\w.-]+:\d{2,5}$/.test(raw)) return `http://${raw}`
  return ''
}

function parseProxyText(text) {
  const matches = String(text || '').match(/(?:https?:\/\/)?(?:[\w.-]+):\d{2,5}/gi) || []
  return matches.map(normalizeProxy).filter(Boolean)
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function fetchText(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const client = parsed.protocol === 'http:' ? http : https
    const req = client.request({
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'http:' ? 80 : 443),
      path: `${parsed.pathname}${parsed.search}`,
      method: 'GET',
      timeout: timeoutMs,
      headers: {
        'User-Agent': 'worldcup-betfair-proxy-fetch/1.0'
      }
    }, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        data += chunk
        if (data.length > 1024 * 1024) req.destroy(new Error('Proxy source too large'))
      })
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`Proxy source HTTP ${res.statusCode}`))
          return
        }
        resolve(data)
      })
    })
    req.on('timeout', () => req.destroy(new Error('Proxy source timeout')))
    req.on('error', reject)
    req.end()
  })
}

async function loadBetfairProxyList() {
  if (process.env.BETFAIR_PROXY_ENABLED !== '1') return []

  const ttlMs = Number(process.env.BETFAIR_PROXY_CACHE_MS || 10 * 60 * 1000)
  if (cachedProxyList.length && Date.now() - cachedAt <= ttlMs) return cachedProxyList

  const inline = String(process.env.BETFAIR_PROXY_URLS || '')
    .split(/[\s,]+/)
    .map(normalizeProxy)
    .filter(Boolean)

  const timeoutMs = Number(process.env.BETFAIR_PROXY_SOURCE_TIMEOUT_MS || 10000)
  const sourceUrls = String(process.env.BETFAIR_PROXY_SOURCES || '')
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  const fromSources = []
  for (const sourceUrl of sourceUrls) {
    try {
      const text = await fetchText(sourceUrl, timeoutMs)
      fromSources.push(...parseProxyText(text))
    } catch (error) {
      console.warn(`[betfair-proxy] source skipped: ${sourceUrl} (${error.message})`)
    }
  }

  const maxCandidates = Number(process.env.BETFAIR_PROXY_MAX_CANDIDATES || 200)
  cachedProxyList = unique(inline.concat(fromSources)).slice(0, maxCandidates)
  cachedAt = Date.now()
  return cachedProxyList
}

function pickRandomProxy(proxies, tried = new Set()) {
  const candidates = proxies.filter((proxy) => !tried.has(proxy))
  if (!candidates.length) return ''
  return candidates[Math.floor(Math.random() * candidates.length)]
}

module.exports = {
  loadBetfairProxyList,
  pickRandomProxy
}
