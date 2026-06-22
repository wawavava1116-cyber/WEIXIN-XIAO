const fs = require('fs')
const path = require('path')

const DOTENV_OVERRIDE_KEYS = new Set([
  'BETFAIR_SYNC_ENABLED',
  'BETFAIR_SYNC_INTERVAL_MS'
])

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
    if (!key || (process.env[key] && !DOTENV_OVERRIDE_KEYS.has(key))) return
    value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
    process.env[key] = value
  })
}

module.exports = { loadDotenvFile }
