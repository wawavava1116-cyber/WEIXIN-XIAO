const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'betfair-markets.json')
const DATABASE_FILE = path.join(DATA_DIR, 'match-database.json')
const LIVE_SCORES_FILE = path.join(DATA_DIR, 'live-scores.json')

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    return {
      updatedAt: '',
      markets: {}
    }
  }
}

function writeStore(data) {
  ensureDataDir()
  const payload = {
    updatedAt: new Date().toISOString(),
    markets: data.markets || {}
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2))
  return payload
}

function upsertMarkets(marketList) {
  const current = readStore()
  const markets = { ...(current.markets || {}) }
  marketList.forEach((market) => {
    if (!market || !market.matchId) return
    markets[market.matchId] = {
      ...(markets[market.matchId] || {}),
      ...market,
      updatedAt: new Date().toISOString()
    }
  })
  return writeStore({ markets })
}

module.exports = {
  readStore,
  writeStore,
  upsertMarkets,
  readDatabaseSnapshot() {
    try {
      return JSON.parse(fs.readFileSync(DATABASE_FILE, 'utf8'))
    } catch (error) {
      return null
    }
  },
  writeDatabaseSnapshot(snapshot) {
    ensureDataDir()
    const payload = {
      ...snapshot,
      generatedAt: new Date().toISOString()
    }
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(payload, null, 2))
    return payload
  },
  readLiveScores() {
    try {
      return JSON.parse(fs.readFileSync(LIVE_SCORES_FILE, 'utf8'))
    } catch (error) {
      return {
        updatedAt: '',
        scores: {}
      }
    }
  },
  writeLiveScores(scores) {
    ensureDataDir()
    const payload = {
      updatedAt: new Date().toISOString(),
      scores: scores || {}
    }
    fs.writeFileSync(LIVE_SCORES_FILE, JSON.stringify(payload, null, 2))
    return payload
  }
}
