const { upcomingMatches, recentFinishedHomeMatches, finishedMatches } = require('../../utils/matches')
const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getFavoriteIds, toggleFavorite, decorateMatches, sortFavoritesFirst } = require('../../utils/favorites')
const { getDynamicReviews, saveDynamicReviews, mergeReviewLists } = require('../../utils/reviewCache')
const { getRemoteDatabaseSync, getRemoteDatabaseBadge, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const {
  getStoredUser,
  ensureWechatSession,
  loginAsGuest,
  saveFunctionalWechatProfile,
  saveUserProfile,
  shouldAskProfileChoice,
  markProfileChoiceDone
} = require('../../utils/userAuth')

const FINISHED_KEEP_MS = 60 * 60 * 1000
const FINISH_CACHE_KEY = 'worldcup_finished_detected_at'
const LIVE_SCORE_CACHE_KEY = 'worldcup_live_score_cache'
const ANNOUNCEMENT_CLOSED_KEY = 'worldcup_announcement_closed_at'
const ANNOUNCEMENT_HIDE_MS = 24 * 60 * 60 * 1000
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
  return Object.assign({}, match, {
    home: Object.assign({}, match.home),
    away: Object.assign({}, match.away),
    pick: Object.assign({}, match.pick),
    analysis: match.analysis ? Object.assign({}, match.analysis) : match.analysis
  })
}

function getRefreshBaseMatches() {
  const remoteDatabase = getRemoteDatabaseSync()
  const remoteUpcoming = remoteDatabase && Array.isArray(remoteDatabase.upcomingMatches)
    ? remoteDatabase.upcomingMatches.concat(remoteDatabase.recentFinishedHomeMatches || [])
    : null
  const sourceMatches = remoteUpcoming && remoteUpcoming.length ? sortMatchesByTime(remoteUpcoming) : sortedUpcomingMatches
  return sourceMatches.map(cloneMatch)
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
    return Object.assign({}, match, {
      finishDetectedAt: detectedAt
    })
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

function getStaticMatch(sourceMatch) {
  if (!sourceMatch) return null
  const matchId = typeof sourceMatch === 'string' ? sourceMatch : sourceMatch.id
  const byId = sortedUpcomingMatches.find((match) => match.id === matchId)
  if (byId) return byId
  const homeName = sourceMatch.home && sourceMatch.home.cn
  const awayName = sourceMatch.away && sourceMatch.away.cn
  return sortedUpcomingMatches.find((match) => (
    match.home && match.away &&
    match.home.cn === homeName &&
    match.away.cn === awayName
  )) || null
}

function inferResultBackupFromAnalysis(match) {
  const text = String((match.analysis && (match.analysis.conclusion || match.analysis.order || match.analysis.market && match.analysis.market.oneXtwo)) || '')
  if (!text) return ''
  const homeName = match.home && match.home.cn
  const awayName = match.away && match.away.cn
  if (homeName && text.includes(`${homeName}不败`)) return `${homeName}不败`
  if (awayName && text.includes(`${awayName}不败`)) return `${awayName}不败`
  if (text.includes('主队不败') && homeName) return `${homeName}不败`
  if (text.includes('客队不败') && awayName) return `${awayName}不败`
  return ''
}

function getPredictionWeight(mainCorrect, backupCorrect) {
  if (mainCorrect) return 100
  if (backupCorrect) return 50
  return 0
}

function getScoreTotal(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return parts[0] + parts[1]
}

function parseTotalRange(totalText) {
  const text = String(totalText || '')
  const rangeMatch = text.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) }
  }
  const singleMatch = text.match(/(\d+)/)
  if (singleMatch) {
    const value = Number(singleMatch[1])
    return { min: value, max: value }
  }
  return null
}

function isTotalCorrect(score, totalText) {
  const actualTotal = getScoreTotal(score)
  const range = parseTotalRange(totalText)
  if (actualTotal === null || !range) return false
  return actualTotal >= range.min && actualTotal <= range.max
}

function inferTotalPickFromScores(scoreMain, scoreBackup) {
  const totals = [getScoreTotal(scoreMain), getScoreTotal(scoreBackup)].filter((value) => value !== null)
  if (!totals.length) return ''
  const min = Math.min.apply(Math, totals)
  const max = Math.max.apply(Math, totals)
  return min === max ? `${min}球` : `${min}-${max}球`
}

function formatPercentValue(value) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`
}

function getShortResult(result, homeName, awayName) {
  const text = String(result || '')
  if (!text) return ''
  if (text.includes('平')) return '平'
  if (homeName && text.includes(homeName) && text.includes('不败')) return '胜'
  if (awayName && text.includes(awayName) && text.includes('不败')) return '负'
  if (homeName && text.includes(homeName)) return '胜'
  if (awayName && text.includes(awayName)) return '负'
  if (text.includes('主胜')) return '胜'
  if (text.includes('客胜')) return '负'
  if (text.includes('胜')) return '胜'
  return text
}

function getReviewResultDisplay(review) {
  if (review.resultDisplay) return review.resultDisplay
  const mainText = review.resultMainShort || getShortResult(review.resultMain, review.home, review.away)
  const backupText = review.resultBackupShort || getShortResult(review.resultBackup, review.home, review.away)
  return `${mainText || review.resultMain || ''}${backupText ? `（${backupText}）` : ''}`
}

function getReviewScoreDisplay(review) {
  if (review.scoreDisplay) return review.scoreDisplay
  return `${review.scoreMain || ''}${review.scoreBackup ? `（${review.scoreBackup}）` : ''}`
}

function decorateReviewItem(review) {
  const totalPick = review.totalPick || inferTotalPickFromScores(review.scoreMain, review.scoreBackup)
  const resultWeight = getPredictionWeight(review.resultMainCorrect, review.resultBackupCorrect)
  const scoreWeight = getPredictionWeight(review.scoreMainCorrect, review.scoreBackupCorrect)
  const totalCorrect = typeof review.totalCorrect === 'boolean' ? review.totalCorrect : isTotalCorrect(review.score, totalPick)
  const totalWeight = totalCorrect ? 100 : 0
  const percentValue = resultWeight * 0.5 + scoreWeight * 0.3 + totalWeight * 0.2
  return Object.assign({}, review, {
    totalPick,
    resultMainShort: getShortResult(review.resultMain, review.home, review.away),
    resultBackupShort: getShortResult(review.resultBackup, review.home, review.away),
    resultDisplay: getReviewResultDisplay(review),
    scoreDisplay: getReviewScoreDisplay(review),
    resultMainClass: review.resultMainCorrect ? 'review-ok' : 'review-bad',
    resultBackupClass: review.resultBackupCorrect ? 'review-ok' : 'review-bad',
    scoreMainClass: review.scoreMainCorrect ? 'review-ok' : 'review-bad',
    scoreBackupClass: review.scoreBackupCorrect ? 'review-ok' : 'review-bad',
    totalCorrect,
    totalClass: totalCorrect ? 'review-ok' : 'review-bad',
    percentValue,
    percent: formatPercentValue(percentValue),
    percentLevel: getPercentLevel(percentValue)
  })
}

function buildReviewFromFinishedMatch(match) {
  const staticMatch = getStaticMatch(match)
  const basePick = (staticMatch && staticMatch.pick) || match.pick || {}
  const resultBackup = basePick.resultBackup || (staticMatch ? inferResultBackupFromAnalysis(staticMatch) : inferResultBackupFromAnalysis(match))
  const scoreMain = basePick.score || (match.pick && match.pick.score) || ''
  const scoreBackup = basePick.backup || (match.pick && match.pick.backup) || ''
  const totalPick = basePick.total || (match.pick && match.pick.total) || inferTotalPickFromScores(scoreMain, scoreBackup)
  const actualWinner = getWinnerFromScore(match.liveScore)
  const pickWinner = getPickWinner(Object.assign({}, match, { pick: basePick }))
  const resultMainCorrect = actualWinner && pickWinner && actualWinner === pickWinner
  const resultBackupCorrect = actualWinner && resultBackup && getShortResult(resultBackup, match.home.cn, match.away.cn) === getShortResult(actualWinner === 'home' ? match.home.cn : actualWinner === 'away' ? match.away.cn : '平局', match.home.cn, match.away.cn)
  const scoreMainCorrect = match.liveScore === scoreMain
  const scoreBackupCorrect = match.liveScore === scoreBackup
  return decorateReviewItem({
    id: `${match.id}-review-live`,
    matchId: match.id,
    home: match.home.cn,
    away: match.away.cn,
    score: match.liveScore,
    resultMain: basePick.result || '',
    resultBackup,
    scoreMain,
    scoreBackup,
    totalPick,
    resultMainCorrect,
    resultBackupCorrect,
    scoreMainCorrect,
    scoreBackupCorrect,
    endedAtSort: match.finishDetectedAt || Date.now()
  })
}

function mergeReviewMatches(staticReviews, matches) {
  const remoteDatabase = getRemoteDatabaseSync()
  const baseReviews = remoteDatabase && Array.isArray(remoteDatabase.finishedMatches) && remoteDatabase.finishedMatches.length
    ? remoteDatabase.finishedMatches
    : staticReviews
  const dynamicReviews = matches
    .filter((match) => match.matchStatus === 'finished' && match.liveScore)
    .map(buildReviewFromFinishedMatch)
  if (dynamicReviews.length) {
    saveDynamicReviews(dynamicReviews)
  }
  return mergeReviewLists(baseReviews, getDynamicReviews())
    .map(decorateReviewItem)
}

function getReviewRate(reviews) {
  if (!reviews.length) return '0.0%'
  const rate = reviews.reduce((sum, item) => {
    const value = item.percentValue !== undefined && item.percentValue !== null ? item.percentValue : parseFloat(item.percent)
    return sum + Number(value || 0)
  }, 0) / reviews.length
  return `${rate.toFixed(1)}%`
}

function buildReviewChart(reviews) {
  const ordered = reviews.slice().sort((a, b) => (a.endedAtSort || 0) - (b.endedAtSort || 0)).slice(-10)
  if (!ordered.length) return { points: [], segments: [], values: [] }
  let total = 0
  const leftStart = 16
  const leftEnd = 78
  const step = ordered.length > 1 ? (leftEnd - leftStart) / (ordered.length - 1) : 0
  const points = ordered.map((review, index) => {
    const reviewValue = review.percentValue !== undefined && review.percentValue !== null ? review.percentValue : parseFloat(review.percent)
    total += Number(reviewValue || 0)
    const value = Math.max(0, Math.min(100, total / (index + 1)))
    return {
      left: ordered.length > 1 ? leftStart + index * step : (leftStart + leftEnd) / 2,
      bottom: value,
      value: value.toFixed(1),
      level: getPercentLevel(value)
    }
  })
  const values = points.map((point) => Number(point.value))
  const segments = []
  const yScale = 0.22
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1]
    const current = points[index]
    const dx = current.left - prev.left
    const dy = (current.bottom - prev.bottom) * yScale
    segments.push({
      left: prev.left,
      bottom: prev.bottom,
      width: Math.sqrt(dx * dx + dy * dy),
      angle: Math.atan2(-dy, dx) * 180 / Math.PI
    })
  }
  const finalPoint = points[points.length - 1] || null
  return {
    points,
    segments,
    values,
    finalPoint,
    finalLabel: finalPoint ? `${Number(finalPoint.value).toFixed(1)}%` : ''
  }
}

function prepareDisplayMatches(matches) {
  return sortFavoritesFirst(decorateMatches(sortMatchesByTime(matches), getFavoriteIds()))
}

function prepareReviews(reviews) {
  return reviews.map(decorateReviewItem)
}

function clearStartupCaches() {
  try {
    wx.removeStorageSync(LIVE_SCORE_CACHE_KEY)
    wx.removeStorageSync(FINISH_CACHE_KEY)
  } catch (error) {
    // Cache cleanup should not block opening the page.
  }
}

function shouldShowAnnouncement() {
  try {
    const closedAt = Number(wx.getStorageSync(ANNOUNCEMENT_CLOSED_KEY) || 0)
    return !closedAt || Date.now() - closedAt >= ANNOUNCEMENT_HIDE_MS
  } catch (error) {
    return true
  }
}

function saveAnnouncementClosedAt() {
  try {
    wx.setStorageSync(ANNOUNCEMENT_CLOSED_KEY, Date.now())
  } catch (error) {
    // Announcement state should not block normal page use.
  }
}

Page({
  data: {
    matches: prepareDisplayMatches(sortedUpcomingMatches),
    favoriteCount: getFavoriteIds().length,
    featured: selectFeaturedMatch(sortedUpcomingMatches),
    reviewOpen: false,
    reviewSummary: `${finishedMatches.slice(0, 10).length} 场历史复盘`,
    reviewSuccessRate: getReviewRate(prepareReviews(finishedMatches.slice(0, 10))),
    finishedMatches: prepareReviews(finishedMatches.slice(0, 10)),
    reviewChart: buildReviewChart(prepareReviews(finishedMatches.slice(0, 10))),
    databaseBadge: getRemoteDatabaseBadge(),
    startupLoading: true,
    startupProgress: 0,
    showAnnouncement: false,
    showUserProfilePrompt: false,
    showUserProfileForm: false,
    wechatProfileArgs: { withCredentials: true, lang: 'zh_CN', timeout: 15000 },
    userInfo: getStoredUser() || { mode: 'guest', nickname: '游客用户', avatarUrl: '' },
    profileNickname: '',
    profileAvatarTempPath: '',
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

  onReady() {
    // The history mini chart is rendered with lightweight WXML/CSS to keep the upload package small.
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
    if (this.startupRemoteFallback) clearTimeout(this.startupRemoteFallback)
    if (this.startupHardFallback) clearTimeout(this.startupHardFallback)
    if (this.startupProgressTimer) clearInterval(this.startupProgressTimer)
  },

  onPullDownRefresh() {
    this.refreshAll({ manual: true })
  },

  runStartupRefresh() {
    clearStartupCaches()
    this.startStartupProgress()
    this.checkForAppUpdate()
    let started = false
    const startHomeRefresh = () => {
      if (started) return
      started = true
      if (this.startupRemoteFallback) {
        clearTimeout(this.startupRemoteFallback)
        this.startupRemoteFallback = null
      }
      this.refreshAll({
        startup: true,
        afterFinish: () => this.finishStartupProgress()
      })
    }
    this.startupRemoteFallback = setTimeout(startHomeRefresh, 4500)
    this.startupHardFallback = setTimeout(() => {
      this.refreshing = false
      this.finishStartupProgress()
    }, 10000)
    refreshRemoteDatabase(null, startHomeRefresh)
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
    if (this.startupHardFallback) {
      clearTimeout(this.startupHardFallback)
      this.startupHardFallback = null
    }
    if (this.startupProgressTimer) {
      clearInterval(this.startupProgressTimer)
      this.startupProgressTimer = null
    }
    this.setData({ startupProgress: 100 })
    setTimeout(() => {
      this.startupDone = true
      this.setData({
        startupLoading: false
      })
      this.showEntryPrompts()
    }, 220)
  },

  showEntryPrompts() {
    if (shouldAskProfileChoice()) {
      this.setData({
        showUserProfilePrompt: true,
        showAnnouncement: false
      })
      return
    }
    this.setData({ showAnnouncement: shouldShowAnnouncement() })
  },

  closeAnnouncement() {
    saveAnnouncementClosedAt()
    this.setData({ showAnnouncement: false })
  },

  onWechatProfileSuccess(event) {
    wx.showLoading({ title: '正在保存' })
    saveFunctionalWechatProfile(event.detail || {})
      .then((session) => {
        markProfileChoiceDone()
        wx.hideLoading()
        this.setData({
          userInfo: session.user || this.data.userInfo,
          showUserProfilePrompt: false,
          showUserProfileForm: false,
          showAnnouncement: false
        })
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch((error) => {
        wx.hideLoading()
        const message = error && error.message ? error.message : ''
        if (message && message !== 'WECHAT_PROFILE_SELECTION_REQUIRED' && !message.includes('getUserProfile:fail')) {
          wx.showToast({ title: message.slice(0, 28), icon: 'none' })
        }
        this.showManualProfileForm()
      })
  },

  onWechatProfileFail(event) {
    const message = event && event.detail && event.detail.errMsg ? event.detail.errMsg : ''
    if (message && !message.includes('cancel')) {
      wx.showToast({ title: message.slice(0, 28), icon: 'none' })
    }
    this.showManualProfileForm()
  },

  onWechatProfileCancel() {
    this.showManualProfileForm()
  },

  showManualProfileForm() {
    const user = getStoredUser() || {}
    this.setData({
      showUserProfilePrompt: false,
      showUserProfileForm: true,
      userInfo: user.mode ? user : this.data.userInfo,
      profileNickname: user.nickname && user.nickname !== '游客用户' ? user.nickname : '',
      profileAvatarTempPath: ''
    })
  },

  continueAsGuest() {
    markProfileChoiceDone()
    this.setData({
      showUserProfilePrompt: false,
      showUserProfileForm: false
    })
    loginAsGuest()
      .then((session) => {
        this.setData({
          userInfo: session.user || { mode: 'guest', nickname: '游客用户', avatarUrl: '' },
          showAnnouncement: false
        })
      })
      .catch(() => {
        this.setData({ showAnnouncement: false })
      })
  },

  onChooseAvatar(event) {
    this.setData({
      profileAvatarTempPath: event.detail.avatarUrl || ''
    })
  },

  onProfileNicknameInput(event) {
    this.setData({
      profileNickname: event.detail.value || ''
    })
  },

  saveWechatProfile() {
    const nickname = String(this.data.profileNickname || '').trim()
    const avatarTempPath = this.data.profileAvatarTempPath
    if (!nickname || !avatarTempPath) {
      wx.showToast({ title: '请先选择头像并填写微信名', icon: 'none' })
      return
    }
    wx.showLoading({ title: '正在保存' })
    ensureWechatSession()
      .then(() => saveUserProfile({ nickname, avatarTempPath }))
      .then((session) => {
        markProfileChoiceDone()
        wx.hideLoading()
        this.setData({
          userInfo: session.user || this.data.userInfo,
          showUserProfileForm: false,
          showAnnouncement: false
        })
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch((error) => {
        wx.hideLoading()
        const message = error && error.message ? error.message : '保存失败'
        wx.showToast({ title: message.slice(0, 28), icon: 'none' })
      })
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
        favoriteCount: getFavoriteIds().length,
        featured: selectFeaturedMatch(timeSortedMatches),
        finishedMatches: nextReviews,
        reviewSummary: `${nextReviews.length} 场历史复盘`,
        reviewSuccessRate: getReviewRate(nextReviews),
        reviewChart: buildReviewChart(nextReviews),
        databaseBadge: getRemoteDatabaseBadge()
      })
    }

    const refreshBaseMatches = getRefreshBaseMatches()
    refreshTeamStats(refreshBaseMatches, updateMatches, taskDone)
    refreshLiveScores(refreshBaseMatches, updateMatches, taskDone)
    this.refreshFallback = setTimeout(finish, options.startup ? 6000 : 5000)
  },

  toggleReview() {
    this.setData({ reviewOpen: !this.data.reviewOpen })
  },

  applyFavoriteState() {
    const favoriteIds = getFavoriteIds()
    const matches = sortFavoritesFirst(decorateMatches(this.data.matches, favoriteIds))
    this.setData({
      matches,
      favoriteCount: favoriteIds.length,
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
      favoriteCount: favoriteIds.length,
      featured: selectFeaturedMatch(matches)
    })
    wx.showToast({
      title: favoriteIds.indexOf(matchId) !== -1 ? '已关注' : '已取消',
      icon: 'none'
    })
  }
})
