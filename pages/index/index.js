const { upcomingMatches, recentFinishedHomeMatches, finishedMatches } = require('../../utils/matches')
const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getFavoriteIds, toggleFavorite, decorateMatches, sortFavoritesFirst } = require('../../utils/favorites')

const FINISHED_KEEP_MS = 12 * 60 * 60 * 1000
const FINISH_CACHE_KEY = 'worldcup_finished_detected_at'
const sortedUpcomingMatches = sortMatchesByTime(upcomingMatches.concat(recentFinishedHomeMatches || []))

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
    const detectedAt = cache[match.id] || match.finishDetectedAt || Date.now()
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
  const detectedAt = match.finishDetectedAt || Date.now()
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

Page({
  data: {
    matches: prepareDisplayMatches(sortedUpcomingMatches),
    featured: prepareDisplayMatches(sortedUpcomingMatches)[0],
    reviewOpen: false,
    reviewSummary: `${finishedMatches.slice(0, 10).length} 场已复盘`,
    reviewSuccessRate: getReviewRate(finishedMatches.slice(0, 10)),
    finishedMatches: finishedMatches.slice(0, 10),
    isRefreshing: false,
    syncText: '下拉同步实时比分'
  },

  onLoad() {
    this.scoreTimer = setInterval(() => {
      this.refreshAll({ silent: true })
    }, 10000)
  },

  onShow() {
    this.refreshAll()
    this.applyFavoriteState()
  },

  onUnload() {
    if (this.scoreTimer) clearInterval(this.scoreTimer)
    if (this.refreshFallback) clearTimeout(this.refreshFallback)
  },

  onPullDownRefresh() {
    this.refreshAll({ manual: true })
  },

  refreshAll(options = {}) {
    if (this.refreshing) {
      if (options.manual) wx.stopPullDownRefresh()
      return
    }
    this.refreshing = true
    const showStatus = !options.silent || options.manual
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
    }
    const taskDone = () => {
      pending -= 1
      if (pending <= 0) finish()
    }
    const updateMatches = (matches) => {
      const nextMatches = applyFinishDetection(matches)
      const visibleMatches = nextMatches.filter(keepVisibleMatch)
      const sortedMatches = prepareDisplayMatches(visibleMatches)
      const nextReviews = mergeReviewMatches(finishedMatches, nextMatches)
      this.setData({
        matches: sortedMatches,
        featured: sortedMatches[0],
        finishedMatches: nextReviews,
        reviewSummary: `${nextReviews.length} 场已复盘`,
        reviewSuccessRate: getReviewRate(nextReviews)
      })
    }

    refreshTeamStats(this.data.matches, updateMatches, taskDone)
    refreshLiveScores(this.data.matches, updateMatches, taskDone)
    this.refreshFallback = setTimeout(finish, 5000)
  },

  toggleReview() {
    this.setData({ reviewOpen: !this.data.reviewOpen })
  },

  applyFavoriteState() {
    const matches = prepareDisplayMatches(this.data.matches)
    this.setData({
      matches,
      featured: matches[0]
    })
  },

  toggleFavorite(event) {
    const matchId = event.currentTarget.dataset.id
    if (!matchId) return
    const favoriteIds = toggleFavorite(matchId)
    const matches = sortFavoritesFirst(decorateMatches(this.data.matches, favoriteIds))
    this.setData({
      matches,
      featured: matches[0]
    })
    wx.showToast({
      title: favoriteIds.indexOf(matchId) !== -1 ? '已关注' : '已取消',
      icon: 'none'
    })
  }
})
