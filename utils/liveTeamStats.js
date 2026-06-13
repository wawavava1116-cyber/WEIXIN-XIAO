const TEAM_STATS_API_URL = ''
const CACHE_KEY = 'worldcup_team_stats_cache'
const CACHE_TTL = 6 * 60 * 60 * 1000

function normalizeValue(value) {
  if (typeof value === 'number') return `€ ${value}M`
  return value
}

function normalizeStats(rawStats) {
  const teams = rawStats && rawStats.teams ? rawStats.teams : rawStats
  if (!teams || typeof teams !== 'object') return null
  return Object.keys(teams).reduce((result, key) => {
    const item = teams[key]
    if (!item || typeof item !== 'object') return result
    result[key] = { rank: item.rank, value: normalizeValue(item.value), updatedAt: item.updatedAt || rawStats.updatedAt || '' }
    return result
  }, {})
}

function applyStatsToMatches(matches, stats) {
  if (!stats) return matches
  matches.forEach((match) => {
    ;[match.home, match.away].forEach((team) => {
      const latest = stats[team.key]
      if (!latest) return
      if (latest.rank) team.rank = latest.rank
      if (latest.value) team.value = latest.value
      if (latest.updatedAt) team.statsUpdatedAt = latest.updatedAt
    })
  })
  return matches
}

function getCachedStats() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache || !cache.savedAt || !cache.stats) return null
    if (Date.now() - cache.savedAt > CACHE_TTL) return null
    return cache.stats
  } catch (error) {
    return null
  }
}

function setCachedStats(stats) {
  try {
    wx.setStorageSync(CACHE_KEY, { savedAt: Date.now(), stats })
  } catch (error) {
    // Cache failure should not block page rendering.
  }
}

function refreshTeamStats(matches, onReady, onComplete) {
  let completed = false
  const complete = () => {
    if (completed) return
    completed = true
    onComplete && onComplete()
  }
  const cachedStats = getCachedStats()
  if (cachedStats) {
    applyStatsToMatches(matches, cachedStats)
    onReady && onReady(matches)
  }
  if (!TEAM_STATS_API_URL) {
    complete()
    return
  }
  wx.request({
    url: TEAM_STATS_API_URL,
    method: 'GET',
    success(response) {
      const stats = normalizeStats(response.data)
      if (!stats) {
        complete()
        return
      }
      setCachedStats(stats)
      applyStatsToMatches(matches, stats)
      onReady && onReady(matches)
      complete()
    },
    fail: complete
  })
}

module.exports = { refreshTeamStats }
