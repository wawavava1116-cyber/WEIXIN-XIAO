const { matches, historyMatches } = require('../../utils/matches')
const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getDynamicReviews } = require('../../utils/reviewCache')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')

function buildDynamicHistoryMatch(review) {
  if (!review || !review.matchId) return null
  const sourceMatch = matches.find((item) => item.id === review.matchId) ||
    historyMatches.find((item) => item.id === review.matchId)
  if (sourceMatch) {
    return Object.assign({}, sourceMatch, {
      dateText: review.dateText || sourceMatch.dateText,
      kickoff: review.kickoff || sourceMatch.kickoff,
      group: review.group || sourceMatch.group,
      venue: review.venue || sourceMatch.venue,
      isFinished: true,
      matchStatus: 'finished',
      statusText: '完赛',
      liveScore: review.score,
      review: Object.assign({}, sourceMatch.review || {}, review)
    })
  }
  const analysis = {
    conclusion: '该场比赛来自实时完赛复盘缓存，数据库正式复盘更新后会显示完整分析。',
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
    statusText: '完赛',
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
      eyebrow: '完赛比分',
      score: (match.review && match.review.score) || match.liveScore || '--',
      subLabel: '预测比分',
      subScore: predictedScore
    }
  }

  if (isLive) {
    return {
      mode: 'live',
      eyebrow: match.matchClock || match.phaseText || '进行中',
      score: match.liveScore || '--',
      subLabel: '预测比分',
      subScore: predictedScore
    }
  }

  return {
    mode: 'pending',
    eyebrow: '预测比分',
    score: predictedScore,
    subLabel: '备用比分',
    subScore: (match.pick && match.pick.backup) || '--'
  }
}

Page({
  data: {
    match: null,
    scorePanel: null
  },

  onLoad(options) {
    refreshRemoteDatabase()
    const remoteDatabase = getRemoteDatabaseSync()
    const remoteMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) ? remoteDatabase.matches : []
    const remoteHistoryMatches = remoteDatabase && Array.isArray(remoteDatabase.historyMatches) ? remoteDatabase.historyMatches : []
    const primaryMatches = options.source === 'history'
      ? historyMatches.concat(remoteHistoryMatches)
      : matches.concat(remoteMatches)
    const fallbackMatches = options.source === 'history'
      ? matches.concat(remoteMatches)
      : historyMatches.concat(remoteHistoryMatches)
    const dynamicReview = getDynamicReviews().find((item) => item.matchId === options.id || item.id === options.id)
    const baseMatch = primaryMatches.find((item) => item.id === options.id) ||
      fallbackMatches.find((item) => item.id === options.id)
    const dynamicMatch = dynamicReview ? buildDynamicHistoryMatch(dynamicReview) : null
    const match = options.source === 'history' && dynamicMatch ? dynamicMatch : (baseMatch || dynamicMatch)
    if (!match) {
      wx.showToast({ title: '未找到比赛', icon: 'none' })
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
})
