const { apiBaseUrl } = require('./serverConfig')

const CACHE_KEY = 'worldcup_remote_match_database'
const CACHE_TTL = 10 * 60 * 1000

function normalizeDatabase(raw) {
  if (!raw || typeof raw !== 'object') return null
  const database = raw.ok ? raw : raw.database || raw
  if (!Array.isArray(database.matches) || !Array.isArray(database.upcomingMatches)) return null
  return database
}

function getRemoteDatabaseSync() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache || !cache.savedAt || !cache.database) return null
    if (Date.now() - cache.savedAt > CACHE_TTL) return null
    return cache.database
  } catch (error) {
    return null
  }
}

function setRemoteDatabase(database) {
  try {
    wx.setStorageSync(CACHE_KEY, {
      savedAt: Date.now(),
      database
    })
  } catch (error) {
    // Remote database cache failure should not block page rendering.
  }
}

function refreshRemoteDatabase(onReady, onComplete) {
  let finished = false
  let fallbackTimer = null
  const complete = () => {
    if (finished) return
    finished = true
    if (fallbackTimer) clearTimeout(fallbackTimer)
    onComplete && onComplete()
  }
  if (!apiBaseUrl) {
    complete()
    return
  }
  fallbackTimer = setTimeout(complete, 4000)
  wx.request({
    url: `${apiBaseUrl.replace(/\/$/, '')}/api/database/latest`,
    method: 'GET',
    timeout: 3500,
    success(response) {
      const database = normalizeDatabase(response.data)
      if (database) {
        setRemoteDatabase(database)
        onReady && onReady(database)
      }
      complete()
    },
    fail: complete
  })
}

module.exports = {
  getRemoteDatabaseSync,
  refreshRemoteDatabase
}
