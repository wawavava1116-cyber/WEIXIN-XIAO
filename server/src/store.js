const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'betfair-markets.json')
const HISTORY_FILE = path.join(DATA_DIR, 'betfair-market-history.json')
const DATABASE_FILE = path.join(DATA_DIR, 'match-database.json')
const LIVE_SCORES_FILE = path.join(DATA_DIR, 'live-scores.json')
const MARKET_HISTORY_RETENTION_DAYS = Number(process.env.BETFAIR_HISTORY_RETENTION_DAYS || 14)

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

function toBeijingDateKey(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function readMarketHistory() {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      updatedAt: parsed.updatedAt || '',
      days: parsed.days || {}
    }
  } catch (error) {
    return {
      updatedAt: '',
      days: {}
    }
  }
}

function writeMarketHistory(history) {
  ensureDataDir()
  const payload = {
    updatedAt: new Date().toISOString(),
    days: history.days || {}
  }
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(payload, null, 2))
  return payload
}

function summarizeMarketRunner(runner) {
  return {
    selectionId: runner.selectionId,
    name: runner.name || '',
    lastPriceTraded: runner.lastPriceTraded || null,
    probability: runner.probability || 0,
    totalMatched: runner.totalMatched || 0,
    tradedVolume: runner.tradedVolume || 0,
    back: runner.back || null,
    lay: runner.lay || null
  }
}

function summarizeMarketSample(market, previousSample) {
  const previousRunners = previousSample && Array.isArray(previousSample.runners)
    ? previousSample.runners
    : []
  const previousRunnerMap = previousRunners.reduce((result, runner) => {
    if (runner && runner.selectionId) result[runner.selectionId] = runner
    return result
  }, {})
  const runners = Array.isArray(market.runners)
    ? market.runners.map((runner) => summarizeMarketRunner(runner))
    : []
  const runnerChanges = runners.reduce((result, runner) => {
    const previous = previousRunnerMap[runner.selectionId] || {}
    const priceDelta = runner.lastPriceTraded && previous.lastPriceTraded
      ? Number((runner.lastPriceTraded - previous.lastPriceTraded).toFixed(3))
      : 0
    result[runner.selectionId] = {
      name: runner.name,
      priceDelta,
      priceDirection: priceDelta > 0 ? 'up' : priceDelta < 0 ? 'down' : 'flat',
      probabilityDelta: Number(((runner.probability || 0) - (previous.probability || 0)).toFixed(1)),
      totalMatchedDelta: Number(((runner.totalMatched || 0) - (previous.totalMatched || 0)).toFixed(2)),
      tradedVolumeDelta: Number(((runner.tradedVolume || 0) - (previous.tradedVolume || 0)).toFixed(2))
    }
    return result
  }, {})
  return {
    recordedAt: new Date().toISOString(),
    matchId: market.matchId,
    eventName: market.eventName || '',
    marketId: market.marketId || '',
    marketName: market.marketName || '',
    marketStartTime: market.marketStartTime || '',
    status: market.status || '',
    inplay: Boolean(market.inplay),
    delayed: Boolean(market.delayed),
    totalMatched: market.totalMatched || 0,
    totalAvailable: market.totalAvailable || 0,
    runners,
    changes: {
      totalMatchedDelta: Number(((market.totalMatched || 0) - ((previousSample && previousSample.totalMatched) || 0)).toFixed(2)),
      runners: runnerChanges
    }
  }
}

function appendMarketHistory(marketList, options = {}) {
  const todayKey = options.dateKey || toBeijingDateKey(options.now || new Date())
  const current = readMarketHistory()
  const days = { ...(current.days || {}) }
  const nextMarkets = Array.isArray(marketList) ? marketList : []
  let appended = 0

  nextMarkets.forEach((market) => {
    if (!market || !market.matchId) return
    if (!market.marketId || !market.marketStartTime) return
    const marketDayKey = toBeijingDateKey(market.marketStartTime)
    const historyDateKey = options.dateKey || marketDayKey || todayKey
    const day = { ...(days[historyDateKey] || {}) }
    const samples = Array.isArray(day[market.matchId]) ? day[market.matchId] : []
    const previousSample = samples[samples.length - 1] || null
    const sample = summarizeMarketSample(market, previousSample)
    day[market.matchId] = samples.concat(sample)
    days[historyDateKey] = day
    appended += 1
  })

  if (!appended) {
    return {
      updatedAt: current.updatedAt || '',
      appended: 0,
      dateKey: todayKey,
      days: current.days || {}
    }
  }

  if (MARKET_HISTORY_RETENTION_DAYS > 0) {
    const keepAfter = Date.now() - MARKET_HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000
    Object.keys(days).forEach((dateKey) => {
      const dayTime = new Date(`${dateKey}T00:00:00+08:00`).getTime()
      if (!Number.isNaN(dayTime) && dayTime < keepAfter) delete days[dateKey]
    })
  }
  const payload = writeMarketHistory({ days })
  return {
    updatedAt: payload.updatedAt,
    appended,
    dateKey: todayKey,
    days: payload.days
  }
}

function getMarketHistory({ dateKey, matchIds, limit } = {}) {
  const history = readMarketHistory()
  const selectedDateKey = dateKey || ''
  const day = history.days[selectedDateKey] || {}
  const ids = Array.isArray(matchIds) && matchIds.length
    ? matchIds
    : Object.keys(day)
  const markets = ids.reduce((result, matchId) => {
    const samples = selectedDateKey
      ? (Array.isArray(day[matchId]) ? day[matchId] : [])
      : Object.keys(history.days || {}).reduce((items, key) => {
        const daySamples = history.days[key] && Array.isArray(history.days[key][matchId])
          ? history.days[key][matchId]
          : []
        return items.concat(daySamples)
      }, []).sort((a, b) => new Date(a.recordedAt || 0).getTime() - new Date(b.recordedAt || 0).getTime())
    result[matchId] = limit > 0 ? samples.slice(-limit) : samples
    return result
  }, {})
  return {
    updatedAt: history.updatedAt || '',
    dateKey: selectedDateKey || 'all',
    markets
  }
}

module.exports = {
  readStore,
  writeStore,
  upsertMarkets,
  appendMarketHistory,
  getMarketHistory,
  readMarketHistory,
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
