const { requestServerApi } = require('./remoteApi')

const CACHE_KEY = 'worldcup_betfair_market_cache'
const CACHE_TTL = 60 * 1000

function normalizeMarkets(raw) {
  if (!raw || typeof raw !== 'object') return null
  return raw.markets || raw
}

function applyBetfairMarkets(matches, markets) {
  if (!markets) return matches
  matches.forEach((match) => {
    const market = markets[match.id]
    if (!market) return
    match.remoteBetfair = market
  })
  return matches
}

function getCachedMarkets() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache || !cache.savedAt || !cache.markets) return null
    if (Date.now() - cache.savedAt > CACHE_TTL) return null
    return cache.markets
  } catch (error) {
    return null
  }
}

function setCachedMarkets(markets) {
  try {
    wx.setStorageSync(CACHE_KEY, { savedAt: Date.now(), markets })
  } catch (error) {
    // Cache failure should not block page rendering.
  }
}

function refreshBetfairMarkets(matches, onReady, onComplete) {
  const complete = () => {
    onComplete && onComplete()
  }
  const cached = getCachedMarkets()
  if (cached) {
    applyBetfairMarkets(matches, cached)
    onReady && onReady(matches)
  }
  const matchIds = matches.map((match) => match.id).join(',')
  requestServerApi({
    path: `/api/betfair/markets?matchIds=${encodeURIComponent(matchIds)}`,
    method: 'GET'
  })
    .then((data) => {
      const markets = normalizeMarkets(data)
      if (!markets) {
        complete()
        return
      }
      setCachedMarkets(markets)
      applyBetfairMarkets(matches, markets)
      onReady && onReady(matches)
      complete()
    })
    .catch(complete)
}

function refreshBetfairHistory(matchId, onReady, onComplete) {
  const complete = () => {
    onComplete && onComplete()
  }
  if (!matchId) {
    complete()
    return
  }
  requestServerApi({
    path: `/api/betfair/history?matchIds=${encodeURIComponent(matchId)}&limit=2`,
    method: 'GET'
  })
    .then((data) => {
      const markets = data && data.markets ? data.markets : {}
      const samples = Array.isArray(markets[matchId]) ? markets[matchId] : []
      onReady && onReady(samples)
      complete()
    })
    .catch(complete)
}

module.exports = { refreshBetfairMarkets, refreshBetfairHistory, applyBetfairMarkets }
