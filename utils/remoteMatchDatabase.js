const { getDatabaseBadge } = require('./buildInfo')
const { requestServerApi } = require('./remoteApi')

const CACHE_KEY = 'worldcup_remote_match_database'
const FINISHED_KEEP_MS = 60 * 60 * 1000
const STALE_NOT_STARTED_MS = 3 * 60 * 60 * 1000

function normalizeDatabase(raw) {
  if (!raw || typeof raw !== 'object') return null
  const database = raw.ok ? raw : raw.database || raw
  if (!Array.isArray(database.matches) || !Array.isArray(database.upcomingMatches)) return null
  return sanitizeDatabaseForDisplay(database)
}

function getMatchTimeValue(match) {
  if (typeof match.sortTime === 'number' && match.sortTime > 0) return match.sortTime
  const parsed = Date.parse(match.scheduleAt || '')
  return Number.isNaN(parsed) ? 0 : parsed
}

function getFinishDetectedAt(match) {
  if (match.finishDetectedAt) return match.finishDetectedAt
  if (match.review && match.review.endedAtMs) return match.review.endedAtMs
  const matchTime = getMatchTimeValue(match)
  if (match.matchStatus === 'finished' && matchTime) return matchTime + 2 * 60 * 60 * 1000
  return Date.now()
}

function isStaleNotStartedMatch(match) {
  const matchTime = getMatchTimeValue(match)
  if (!matchTime) return false
  if (match.matchStatus === 'live' || match.matchStatus === 'finished') return false
  if (match.liveScore) return false
  return Date.now() - matchTime > STALE_NOT_STARTED_MS
}

function shouldKeepUpcomingMatch(match) {
  if (!match) return false
  if (match.matchStatus === 'finished') return false
  return !isStaleNotStartedMatch(match)
}

function shouldKeepRecentFinishedMatch(match) {
  if (!match || match.matchStatus !== 'finished') return false
  return Date.now() - getFinishDetectedAt(match) <= FINISHED_KEEP_MS
}

function sanitizeDatabaseForDisplay(database) {
  const upcomingMatches = Array.isArray(database.upcomingMatches)
    ? database.upcomingMatches.filter(shouldKeepUpcomingMatch)
    : []
  const recentFinishedHomeMatches = Array.isArray(database.recentFinishedHomeMatches)
    ? database.recentFinishedHomeMatches.filter(shouldKeepRecentFinishedMatch)
    : []
  return Object.assign({}, database, {
    upcomingMatches,
    recentFinishedHomeMatches
  })
}

function getRemoteDatabaseSync() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache || !cache.savedAt || !cache.database) return null
    return sanitizeDatabaseForDisplay(cache.database)
  } catch (error) {
    return null
  }
}

function setRemoteDatabase(database) {
  try {
    wx.setStorageSync(CACHE_KEY, {
      savedAt: Date.now(),
      database: sanitizeDatabaseForDisplay(database)
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
