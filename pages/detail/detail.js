const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getDynamicReviews } = require('../../utils/reviewCache')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { createBackSwipeHandlers } = require('../../utils/swipeNavigation')

function buildDynamicHistoryMatch(review) {
  if (!review || !review.matchId) return null
  const remoteDatabase = getRemoteDatabaseSync()
  const remoteMatches = remoteDatabase
    ? []
      .concat(remoteDatabase.matches || [])
      .concat(remoteDatabase.historyMatches || [])
      .concat(remoteDatabase.upcomingMatches || [])
      .concat(remoteDatabase.recentFinishedHomeMatches || [])
    : []
  const sourceMatch = remoteMatches.find((item) => item.id === review.matchId)
  if (sourceMatch) {
    return Object.assign({}, sourceMatch, {
      dateText: review.dateText || sourceMatch.dateText,
      kickoff: review.kickoff || sourceMatch.kickoff,
      group: review.group || sourceMatch.group,
      venue: review.venue || sourceMatch.venue,
      isFinished: true,
      matchStatus: 'finished',
      statusText: '\u5b8c\u8d5b',
      liveScore: review.score,
      review: Object.assign({}, sourceMatch.review || {}, review)
    })
  }
  const analysis = {
    conclusion: '\u8be5\u573a\u6bd4\u8d5b\u6765\u81ea\u5b9e\u65f6\u5b8c\u8d5b\u590d\u76d8\u7f13\u5b58\uff0c\u6570\u636e\u5e93\u6b63\u5f0f\u590d\u76d8\u66f4\u65b0\u540e\u4f1a\u663e\u793a\u5b8c\u6574\u5206\u6790\u3002',
    market: { oneXtwo: '', handicap: '', total: '' },
    form: { home: '', away: '' },
    news: { home: '', away: '' },
    tactics: '',
    h2h: '',
    order: '',
    risk: ''
  }
  return {
    id: review.matchId,
    dateText: review.dateText || '',
    kickoff: review.kickoff || '',
    group: review.group || '',
    venue: review.venue || '',
    weatherIcon: '',
    weather: '',
    altitude: '',
    altitudeLevel: 'unknown',
    isFinished: true,
    matchStatus: 'finished',
    statusText: '\u5b8c\u8d5b',
    liveScore: review.score,
    home: { cn: review.home || '', en: '', flag: '' },
    away: { cn: review.away || '', en: '', flag: '' },
    pick: {
      result: review.resultMain || '',
      resultBackup: review.resultBackup || '',
      score: review.scoreMain || '',
      backup: review.scoreBackup || '',
      total: review.totalPick || ''
    },
    analysis,
    review
  }
}

function getScorePanel(match) {
  const isFinished = Boolean(match.review || match.isFinished || match.matchStatus === 'finished')
  const isLive = match.matchStatus === 'live'
  const predictedScore = match.pick && match.pick.score ? match.pick.score : '--'

  if (isFinished) {
    return {
      mode: 'finished',
      eyebrow: '\u5b8c\u8d5b\u6bd4\u5206',
      score: (match.review && match.review.score) || match.liveScore || '--',
      subLabel: '\u9884\u6d4b\u6bd4\u5206',
      subScore: predictedScore
    }
  }

  if (isLive) {
    return {
      mode: 'live',
      eyebrow: match.matchClock || match.phaseText || '\u8fdb\u884c\u4e2d',
      score: match.liveScore || '--',
      subLabel: '\u9884\u6d4b\u6bd4\u5206',
      subScore: predictedScore
    }
  }

  return {
    mode: 'pending',
    eyebrow: '\u9884\u6d4b\u6bd4\u5206',
    score: predictedScore,
    subLabel: '\u5907\u7528\u6bd4\u5206',
    subScore: (match.pick && match.pick.backup) || '--'
  }
}

Page(Object.assign({}, createBackSwipeHandlers(), {
  data: {
    match: null,
    scorePanel: null
  },

  onLoad(options) {
    this.loadOptions = options || {}
    refreshRemoteDatabase(null, () => this.loadMatch(this.loadOptions, true), () => {
      wx.showToast({ title: '云端详情读取失败', icon: 'none' })
    })
    this.scoreTimer = setInterval(() => {
      this.refreshScore()
    }, 10000)
  },

  onUnload() {
    if (this.scoreTimer) {
      clearInterval(this.scoreTimer)
      this.scoreTimer = null
    }
  },

  loadMatch(options, remoteReady) {
    const remoteDatabase = getRemoteDatabaseSync()
    const remoteMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) ? remoteDatabase.matches : []
    const remoteHistoryMatches = remoteDatabase && Array.isArray(remoteDatabase.historyMatches) ? remoteDatabase.historyMatches : []
    const primaryMatches = options.source === 'history'
      ? remoteHistoryMatches
      : remoteMatches
    const alternateRemoteMatches = options.source === 'history'
      ? remoteMatches
      : remoteHistoryMatches
    const dynamicReview = getDynamicReviews().find((item) => item.matchId === options.id || item.id === options.id)
    const baseMatch = primaryMatches.find((item) => item.id === options.id) ||
      alternateRemoteMatches.find((item) => item.id === options.id)
    const dynamicMatch = dynamicReview ? buildDynamicHistoryMatch(dynamicReview) : null
    const match = options.source === 'history' && dynamicMatch ? dynamicMatch : (baseMatch || dynamicMatch)
    if (!match) {
      if (remoteReady) wx.showToast({ title: '\u672a\u627e\u5230\u6bd4\u8d5b', icon: 'none' })
      return
    }
    wx.setNavigationBarTitle({
      title: `${match.home.cn} vs ${match.away.cn}`
    })
    this.setMatch(match)
    refreshTeamStats([match], (updatedMatches) => {
      this.setMatch(updatedMatches[0])
    })
    this.refreshScore()
  },

  setMatch(match) {
    this.setData({
      match,
      scorePanel: getScorePanel(match)
    })
  },

  refreshScore() {
    if (!this.data.match || this.data.match.review) return
    refreshLiveScores([this.data.match], (updatedMatches) => {
      this.setMatch(updatedMatches[0])
    })
  }
}))
