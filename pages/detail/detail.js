const { matches, historyMatches } = require('../../utils/matches')
const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')

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
    subLabel: '备选比分',
    subScore: (match.pick && match.pick.backup) || '--'
  }
}

Page({
  data: {
    match: null,
    scorePanel: null
  },

  onLoad(options) {
    const detailMatches = historyMatches.concat(matches)
    const match = detailMatches.find((item) => item.id === options.id) || detailMatches[0]
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
  },

  showReward() {
    wx.showModal({
      title: '感谢支持',
      content: '这里可以接入微信赞赏码或客服二维码。当前版本先保留不强制支付的打赏入口。',
      confirmText: '继续加油',
      showCancel: false
    })
  }
})
