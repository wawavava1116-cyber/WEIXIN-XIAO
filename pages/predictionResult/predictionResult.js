const { decodePrediction, encodePrediction, getPrediction } = require('../../utils/userPredictions')
const { createBackSwipeHandlers } = require('../../utils/swipeNavigation')

function buildShareTitle(prediction) {
  if (!prediction) return '我的世界杯预测'
  return `我的预测：${prediction.home.abbr} vs ${prediction.away.abbr}`
}

function normalizePrediction(prediction) {
  if (!prediction) return null
  const picks = prediction.picks || {}
  return Object.assign({}, prediction, {
    backupText: picks.backup || '未选择备选',
    scoreText: Array.isArray(picks.scores) ? picks.scores.join(' / ') : '',
    goalsText: picks.goals || ''
  })
}

Page(Object.assign({}, createBackSwipeHandlers(), {
  data: {
    prediction: null,
    sharePayload: ''
  },

  onLoad(options) {
    const fromPayload = decodePrediction(options && options.data)
    const fromStorage = options && options.id ? getPrediction(options.id) : null
    const prediction = normalizePrediction(fromPayload || fromStorage)
    this.setData({
      prediction,
      sharePayload: prediction ? encodePrediction(prediction) : ''
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage() {
    const prediction = this.data.prediction
    return {
      title: buildShareTitle(prediction),
      path: `/pages/predictionResult/predictionResult?data=${this.data.sharePayload}`
    }
  },

  onShareTimeline() {
    const prediction = this.data.prediction
    return {
      title: buildShareTitle(prediction),
      query: `data=${this.data.sharePayload}`
    }
  }
}))
