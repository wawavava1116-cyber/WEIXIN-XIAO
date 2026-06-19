const { getDatabaseBadge } = require('./buildInfo')
const { requestServerApi } = require('./remoteApi')

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

function getRemoteDatabaseBadge() {
  const database = getRemoteDatabaseSync()
  return getDatabaseBadge(
    database && database.databaseUpdatedAt,
    database && database.version
  )
}

function getRemoteMatchesSync(fieldName, fallback) {
  const database = getRemoteDatabaseSync()
  const value = database && Array.isArray(database[fieldName]) ? database[fieldName] : null
  return value && value.length ? value : fallback
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
  fallbackTimer = setTimeout(complete, 4000)
  requestServerApi({
    path: '/api/database/latest',
    method: 'GET',
    timeout: 3500
  })
    .then((data) => {
      const database = normalizeDatabase(data)
      if (database) {
        setRemoteDatabase(database)
        onReady && onReady(database)
      }
      complete()
    })
    .catch(complete)
}

module.exports = {
  getRemoteDatabaseSync,
  getRemoteDatabaseBadge,
  getRemoteMatchesSync,
  refreshRemoteDatabase
}
