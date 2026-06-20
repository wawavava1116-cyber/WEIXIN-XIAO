const CACHE_KEY = 'worldcup_live_score_cache'
const CACHE_TTL = 10 * 1000

function normalizeScores(rawScores) {
  const matches = rawScores && rawScores.matches ? rawScores.matches : rawScores
  if (!matches || typeof matches !== 'object') return null
  return matches
}

function applyScoresToMatches(matches, scores) {
  if (!scores) return matches
  matches.forEach((match) => {
    const latest = scores[match.id]
    if (!latest) return
    match.matchStatus = latest.matchStatus || match.matchStatus
    match.statusText = latest.statusText || match.statusText
    match.dateText = latest.dateText || match.dateText
    match.kickoff = latest.kickoff || match.kickoff
    match.scheduleAt = latest.scheduleAt || match.scheduleAt
    match.sortTime = latest.sortTime || match.sortTime
    if (match.matchStatus === 'not_started') {
      match.liveScore = ''
      match.matchClock = ''
      match.liveMinute = ''
      match.phaseText = ''
    } else {
      match.liveScore = latest.liveScore || match.liveScore
      match.matchClock = latest.matchClock || match.matchClock
      match.liveMinute = latest.liveMinute || match.liveMinute
      match.phaseText = latest.phaseText || match.phaseText
    }
    match.scoreUpdatedAt = latest.updatedAt || match.scoreUpdatedAt
    match.scoreSource = latest.source || match.scoreSource
  })
  return matches
}

function getCachedScores() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache || !cache.savedAt || !cache.scores) return null
    if (Date.now() - cache.savedAt > CACHE_TTL) return null
    return cache.scores
  } catch (error) {
    return null
  }
}

function setCachedScores(scores) {
  try {
    wx.setStorageSync(CACHE_KEY, { savedAt: Date.now(), scores })
  } catch (error) {
    // Cache failure should not block page rendering.
  }
}

function refreshLiveScores(matches, onReady, onComplete) {
  let completed = false
  const complete = () => {
    if (completed) return
    completed = true
    onComplete && onComplete()
  }
  const cachedScores = getCachedScores()
  if (cachedScores) {
    applyScoresToMatches(matches, cachedScores)
    onReady && onReady(matches)
  }
  if (!wx.cloud || !wx.cloud.callFunction) {
    complete()
    return
  }
  wx.cloud.callFunction({
    name: 'liveScores',
    data: { matchIds: matches.map((match) => match.id) },
    success(response) {
      const scores = normalizeScores(response.result)
      if (!scores) {
        complete()
        return
      }
      setCachedScores(scores)
      applyScoresToMatches(matches, scores)
      onReady && onReady(matches)
      complete()
    },
    fail: complete
  })
}

module.exports = { refreshLiveScores }
