const http = require('http')
const https = require('https')
const { loadDotenvFile } = require('./env')
const { syncBetfairMarkets } = require('./syncOnce')

loadDotenvFile()

function postJson(urlValue, payload, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlValue)
    const body = JSON.stringify(payload)
    const client = url.protocol === 'https:' ? https : http
    const request = client.request({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      method: 'POST',
      rejectUnauthorized: process.env.BETFAIR_UPLOAD_INSECURE !== '1',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'X-Betfair-Upload-Token': token
      }
    }, (response) => {
      let responseBody = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => {
        responseBody += chunk
      })
      response.on('end', () => {
        let parsed = {}
        try {
          parsed = responseBody ? JSON.parse(responseBody) : {}
        } catch (error) {
          parsed = { raw: responseBody }
        }
        if (response.statusCode >= 400) {
          const error = new Error(parsed.error || `UPLOAD_FAILED_${response.statusCode}`)
          error.response = parsed
          reject(error)
          return
        }
        resolve(parsed)
      })
    })
    request.on('error', reject)
    request.write(body)
    request.end()
  })
}

async function syncAndUploadLocalBetfair() {
  const uploadUrl = process.env.BETFAIR_UPLOAD_URL
  const uploadToken = process.env.BETFAIR_UPLOAD_TOKEN
  if (!uploadUrl) throw new Error('BETFAIR_UPLOAD_URL is required')
  if (!uploadToken) throw new Error('BETFAIR_UPLOAD_TOKEN is required')

  const result = await syncBetfairMarkets()
  const markets = Object.values(result.markets || {})
  if (!markets.length) throw new Error('NO_LOCAL_BETFAIR_MARKETS')

  return postJson(uploadUrl, {
    source: 'local-betfair-sync',
    generatedAt: new Date().toISOString(),
    markets
  }, uploadToken)
}

if (require.main === module) {
  syncAndUploadLocalBetfair()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2))
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}

module.exports = { syncAndUploadLocalBetfair }
