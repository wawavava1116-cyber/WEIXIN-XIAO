const { getDatabaseBadge } = require('./buildInfo')
const { requestServerApi } = require('./remoteApi')

const CACHE_KEY = 'worldcup_remote_match_database'

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
  if (!database) return '正在读取云端数据库'
  return getDatabaseBadge(
    database.databaseUpdatedAt,
    database.version
  )
}

function getRemoteMatchesSync(fieldName) {
  const database = getRemoteDatabaseSync()
  const value = database && Array.isArray(database[fieldName]) ? database[fieldName] : null
  return value && value.length ? value : []
}

function refreshRemoteDatabase(onReady, onComplete, onError) {
  return requestServerApi({
    path: '/api/database/latest',
    method: 'GET',
    timeout: 10000
  })
    .then((data) => {
      const database = normalizeDatabase(data)
      if (!database) {
        throw new Error('REMOTE_DATABASE_INVALID')
      }
      setRemoteDatabase(database)
      onReady && onReady(database)
      onComplete && onComplete(database)
      return database
    })
    .catch((error) => {
      if (onError) {
        onError(error)
        return null
      }
      throw error
    })
}

module.exports = {
  getRemoteDatabaseSync,
  getRemoteDatabaseBadge,
  getRemoteMatchesSync,
  refreshRemoteDatabase
}
