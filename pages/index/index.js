const { upcomingMatches, recentFinishedHomeMatches, finishedMatches } = require('../../utils/matches')
const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getFavoriteIds, toggleFavorite, decorateMatches, sortFavoritesFirst } = require('../../utils/favorites')
const { getDatabaseBadge } = require('../../utils/buildInfo')

const FINISHED_KEEP_MS = 60 * 60 * 1000
const FINISH_CACHE_KEY = 'worldcup_finished_detected_at'
const LIVE_SCORE_CACHE_KEY = 'worldcup_live_score_cache'
const sortedUpcomingMatches = sortMatchesByTime(upcomingMatches.concat(recentFinishedHomeMatches || []))
const FEATURED_PRIORITY = {
  'brazil-morocco-20260613': 100,
  'australia-turkey-20260613': 72,
  'haiti-scotland-20260613': 68,
  'qatar-switzerland-20260613': 58,
  'netherlands-japan-20260614': 96,
  'germany-curacao-20260614': 86,
  'ivorycoast-ecuador-20260614': 70,
  'sweden-tunisia-20260614': 62,
  'spain-caboverde-20260615': 96,
  'saudi-uruguay-20260615': 86,
  'belgium-egypt-20260615': 82,
  'iran-newzealand-20260615': 66,
  'france-senegal-20260616': 98,
  'argentina-algeria-20260616': 96,
  'iraq-norway-20260616': 78,
  'austria-jordan-20260616': 66,
  'england-croatia-20260617': 100,
  'portugal-congodr-20260617': 94,
  'uzbekistan-colombia-20260617': 72,
  'ghana-panama-20260617': 64,
  'mexico-korea-20260618': 96,
  'switzerland-bosnia-20260618': 76,
  'canada-qatar-20260618': 74,
  'czechia-southafrica-20260618': 62,
  'usa-australia-20260619': 96,
  'brazil-haiti-20260619': 92,
  'turkey-paraguay-20260619': 76,
  'scotland-morocco-20260619': 70
}

function getMatchTimeValue(match) {
  if (typeof match.sortTime === 'number' && match.sortTime > 0) {
    return match.sortTime
  }
  const dateMatch = String(match.dateText || '').match(/(\d+)月(\d+)日/)
  const timeMatch = String(match.kickoff || '').match(/(\d{1,2}):(\d{2})/)
  const month = dateMatch ? Number(dateMatch[1]) : 12
  const day = dateMatch ? Number(dateMatch[2]) : 31
  const hour = timeMatch ? Number(timeMatch[1]) : 23
  const minute = timeMatch ? Number(timeMatch[2]) : 59
  return new Date(2026, month - 1, day, hour, minute).getTime()
}

function sortMatchesByTime(matches) {
  return matches.slice().sort((a, b) => getMatchTimeValue(a) - getMatchTimeValue(b))
}

function cloneMatch(match) {
  return {
    ...match,
    home: { ...match.home },
    away: { ...match.away },
    pick: { ...match.pick },
    analysis: match.analysis ? { ...match.analysis } : match.analysis
  }
}

function getRefreshBaseMatches() {
  return sortedUpcomingMatches.map(cloneMatch)
}

function getMatchDayValue(match) {
  const timeValue = getMatchTimeValue(match)
  const date = new Date(timeValue)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getFeaturedPriority(match) {
  return FEATURED_PRIORITY[match.id] || 0
}

function getFinishDetectedAt(match) {
  if (match.finishDetectedAt) return match.finishDetectedAt
  if (match.review && match.review.endedAtMs) return match.review.endedAtMs
  if (match.matchStatus === 'finished' && match.sortTime) {
    return match.sortTime + 2 * 60 * 60 * 1000
  }
  return Date.now()
}

function selectFeaturedMatch(matches) {
  const activeMatches = sortMatchesByTime(matches).filter((match) => match.matchStatus !== 'finished')
  const now = Date.now()
  const futureOrLiveMatches = activeMatches.filter((match) => match.matchStatus === 'live' || !match.sortTime || match.sortTime >= now)
  const focusPool = futureOrLiveMatches.length ? futureOrLiveMatches : activeMatches
  if (!focusPool.length) return matches[0] || null

  const focusDay = getMatchDayValue(focusPool[0])
  const sameDayMatches = focusPool.filter((match) => getMatchDayValue(match) === focusDay)
  return sameDayMatches.slice().sort((a, b) => {
    const priorityDiff = getFeaturedPriority(b) - getFeaturedPriority(a)
    if (priorityDiff) return priorityDiff
    return getMatchTimeValue(a) - getMatchTimeValue(b)
  })[0]
}

function getFinishCache() {
  try {
    return wx.getStorageSync(FINISH_CACHE_KEY) || {}
  } catch (error) {
    return {}
  }
}

function setFinishCache(cache) {
  try {
    wx.setStorageSync(FINISH_CACHE_KEY, cache)
  } catch (error) {
    // Cache failure should not block rendering.
  }
}

function applyFinishDetection(matches) {
  const cache = getFinishCache()
  let changed = false
  const nextMatches = matches.map((match) => {
    if (match.matchStatus !== 'finished') {
      return match
    }
    const detectedAt = cache[match.id] || getFinishDetectedAt(match)
    if (!cache[match.id]) {
      cache[match.id] = detectedAt
      changed = true
    }
    return {
      ...match,
      finishDetectedAt: detectedAt
    }
  })

  if (changed) {
    setFinishCache(cache)
  }
  return nextMatches
}

function keepVisibleMatch(match) {
  if (match.matchStatus !== 'finished') {
    return true
  }
  const detectedAt = getFinishDetectedAt(match)
  return Date.now() - detectedAt <= FINISHED_KEEP_MS
}

function getPercentLevel(percent) {
  if (percent >= 100) return 'p100'
  if (percent >= 75) return 'p75'
  if (percent >= 50) return 'p50'
  if (percent >= 25) return 'p25'
  return 'p0'
}

function getWinnerFromScore(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return ''
  if (parts[0] > parts[1]) return 'home'
  if (parts[0] < parts[1]) return 'away'
  return 'draw'
}

function getPickWinner(match) {
  const result = match.pick && match.pick.result ? match.pick.result : ''
  if (result.includes('平局')) return 'draw'
  if (result.includes(match.home.cn) || result.includes('主胜')) return 'home'
  if (result.includes(match.away.cn) || result.includes('客胜')) return 'away'
  return ''
}

function buildReviewFromFinishedMatch(match) {
  const actualWinner = getWinnerFromScore(match.liveScore)
  const pickWinner = getPickWinner(match)
  const resultMainCorrect = actualWinner && pickWinner && actualWinner === pickWinner
  const scoreMainCorrect = match.liveScore === match.pick.score
  const scoreBackupCorrect = match.liveScore === match.pick.backup
  const percentValue = ((resultMainCorrect ? 100 : 0) + (scoreMainCorrect ? 100 : scoreBackupCorrect ? 50 : 0)) / 2

  return {
    id: `${match.id}-review-live`,
    matchId: match.id,
    home: match.home.cn,
    away: match.away.cn,
    score: match.liveScore,
    resultMain: match.pick.result,
    resultBackup: match.pick.resultBackup || '',
    scoreMain: match.pick.score,
    scoreBackup: match.pick.backup,
    resultMainClass: resultMainCorrect ? 'review-ok' : 'review-bad',
    resultBackupClass: 'review-bad',
    scoreMainClass: scoreMainCorrect ? 'review-ok' : 'review-bad',
    scoreBackupClass: scoreBackupCorrect ? 'review-ok' : 'review-bad',
    percent: `${percentValue}%`,
    percentLevel: getPercentLevel(percentValue),
    endedAtSort: match.finishDetectedAt || Date.now()
  }
}

function mergeReviewMatches(staticReviews, matches) {
  const dynamicReviews = matches
    .filter((match) => match.matchStatus === 'finished' && match.liveScore)
    .map(buildReviewFromFinishedMatch)
  const reviewMap = {}
  dynamicReviews.concat(staticReviews).forEach((review) => {
    reviewMap[review.matchId] = review
  })
  return Object.keys(reviewMap)
    .map((key) => reviewMap[key])
    .sort((a, b) => (b.endedAtSort || 0) - (a.endedAtSort || 0))
    .slice(0, 10)
}

function getReviewRate(reviews) {
  if (!reviews.length) return '0.0%'
  const rate = reviews.reduce((sum, item) => sum + parseFloat(item.percent), 0) / reviews.length
  return `${rate.toFixed(1)}%`
}

function prepareDisplayMatches(matches) {
  return sortFavoritesFirst(decorateMatches(sortMatchesByTime(matches), getFavoriteIds()))
}

function clearStartupCaches() {
  try {
    wx.removeStorageSync(LIVE_SCORE_CACHE_KEY)
    wx.removeStorageSync(FINISH_CACHE_KEY)
  } catch (error) {
    // Cache cleanup should not block opening the page.
  }
}

Page({
  data: {
    matches: prepareDisplayMatches(sortedUpcomingMatches),
    featured: selectFeaturedMatch(sortedUpcomingMatches),
    reviewOpen: false,
    reviewSummary: `${finishedMatches.slice(0, 10).length} 场已复盘`,
    reviewSuccessRate: getReviewRate(finishedMatches.slice(0, 10)),
    finishedMatches: finishedMatches.slice(0, 10),
    databaseBadge: getDatabaseBadge(),
    startupLoading: true,
    startupProgress: 0,
    isRefreshing: false,
    syncText: '下拉同步实时比分'
  },

  onLoad() {
    this.startupDone = false
    this.runStartupRefresh()
    this.scoreTimer = setInterval(() => {
      this.refreshAll({ silent: true })
    }, 10000)
  },

  onShow() {
    if (!this.startupDone) {
      this.applyFavoriteState()
      return
    }
    this.refreshAll()
    this.applyFavoriteState()
  },

  onUnload() {
    if (this.scoreTimer) clearInterval(this.scoreTimer)
    if (this.refreshFallback) clearTimeout(this.refreshFallback)
    if (this.startupProgressTimer) clearInterval(this.startupProgressTimer)
  },

  onPullDownRefresh() {
    this.refreshAll({ manual: true })
  },

  runStartupRefresh() {
    clearStartupCaches()
    this.startStartupProgress()
    this.checkForAppUpdate()
    this.refreshAll({
      startup: true,
      afterFinish: () => this.finishStartupProgress()
    })
  },

  startStartupProgress() {
    if (this.startupProgressTimer) clearInterval(this.startupProgressTimer)
    this.setData({ startupProgress: 0, startupLoading: true })
    this.startupProgressTimer = setInterval(() => {
      const current = Number(this.data.startupProgress || 0)
      if (current >= 92) return
      const step = current < 45 ? 6 : current < 75 ? 4 : 2
      this.setData({ startupProgress: Math.min(92, current + step) })
    }, 120)
  },

  finishStartupProgress() {
    if (this.startupProgressTimer) {
      clearInterval(this.startupProgressTimer)
      this.startupProgressTimer = null
    }
    this.setData({ startupProgress: 100 })
    setTimeout(() => {
      this.startupDone = true
      this.setData({ startupLoading: false })
    }, 220)
  },

  checkForAppUpdate() {
    if (!wx.getUpdateManager) return
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(() => {})
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '新版本已准备好',
        content: '重启小程序后显示最新赛程',
        confirmText: '立即重启',
        success(res) {
          if (res.confirm) updateManager.applyUpdate()
        }
      })
    })
    updateManager.onUpdateFailed(() => {})
  },

  refreshAll(options = {}) {
    if (this.refreshing) {
      if (options.manual) wx.stopPullDownRefresh()
      return
    }
    this.refreshing = true
    const showStatus = (!options.silent || options.manual) && !options.startup
    if (showStatus) {
      this.setData({
        isRefreshing: true,
        syncText: options.manual ? '正在手动同步' : '正在同步最新数据'
      })
      wx.showNavigationBarLoading()
    }

    let pending = 2
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      this.refreshing = false
      clearTimeout(this.refreshFallback)
      if (showStatus) {
        this.setData({ syncText: '同步完成' })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        setTimeout(() => {
          this.setData({ isRefreshing: false, syncText: '下拉同步实时比分' })
        }, 800)
      }
      if (options.afterFinish) options.afterFinish()
    }
    const taskDone = () => {
      pending -= 1
      if (pending <= 0) finish()
    }
    const updateMatches = (matches) => {
      const nextMatches = applyFinishDetection(matches)
      const visibleMatches = nextMatches.filter(keepVisibleMatch)
      const timeSortedMatches = sortMatchesByTime(visibleMatches)
      const sortedMatches = sortFavoritesFirst(decorateMatches(timeSortedMatches, getFavoriteIds()))
      const nextReviews = mergeReviewMatches(finishedMatches, nextMatches)
      this.setData({
        matches: sortedMatches,
        featured: selectFeaturedMatch(timeSortedMatches),
        finishedMatches: nextReviews,
        reviewSummary: `${nextReviews.length} 场已复盘`,
        reviewSuccessRate: getReviewRate(nextReviews)
      })
    }

    const refreshBaseMatches = getRefreshBaseMatches()
    refreshTeamStats(refreshBaseMatches, updateMatches, taskDone)
    refreshLiveScores(refreshBaseMatches, updateMatches, taskDone)
    this.refreshFallback = setTimeout(finish, 5000)
  },

  toggleReview() {
    this.setData({ reviewOpen: !this.data.reviewOpen })
  },

  applyFavoriteState() {
    const matches = prepareDisplayMatches(this.data.matches)
    this.setData({
      matches,
      featured: selectFeaturedMatch(matches)
    })
  },

  toggleFavorite(event) {
    const matchId = event.currentTarget.dataset.id
    if (!matchId) return
    const favoriteIds = toggleFavorite(matchId)
    const matches = sortFavoritesFirst(decorateMatches(this.data.matches, favoriteIds))
    this.setData({
      matches,
      featured: selectFeaturedMatch(matches)
    })
    wx.showToast({
      title: favoriteIds.indexOf(matchId) !== -1 ? '已关注' : '已取消',
      icon: 'none'
    })
  }
})
