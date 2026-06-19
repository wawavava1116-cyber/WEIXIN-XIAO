const { matches, upcomingMatches } = require('../../utils/matches')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { hasPredictionProfile, submitPrediction } = require('../../utils/userPredictions')
const { getTeamAbbr } = require('../../utils/teamAbbr')

const RESULT_OPTIONS = ['主胜', '平局', '客胜']
const GOAL_OPTIONS = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
const SCORE_GROUPS = [
  {
    key: 'home',
    title: '主胜比分',
    options: ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '胜其它']
  },
  {
    key: 'draw',
    title: '平局比分',
    options: ['0:0', '1:1', '2:2', '3:3', '平其它']
  },
  {
    key: 'away',
    title: '客胜比分',
    options: ['0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:5', '1:5', '2:5', '负其它']
  }
]

function getAllMatches() {
  const remoteDatabase = getRemoteDatabaseSync()
  const remoteMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) ? remoteDatabase.matches : []
  const remoteUpcoming = remoteDatabase && Array.isArray(remoteDatabase.upcomingMatches) ? remoteDatabase.upcomingMatches : []
  return remoteMatches.concat(remoteUpcoming, matches, upcomingMatches)
}

function findMatch(id) {
  return getAllMatches().find((match) => match.id === id) || null
}

function formatMatch(match) {
  if (!match) return null
  return Object.assign({}, match, {
    home: Object.assign({}, match.home, { abbr: getTeamAbbr(match.home) }),
    away: Object.assign({}, match.away, { abbr: getTeamAbbr(match.away) })
  })
}

function buildScoreGroups(selectedScores) {
  return SCORE_GROUPS.map((group) => Object.assign({}, group, {
    options: group.options.map((score) => ({
      value: score,
      selected: selectedScores.indexOf(score) !== -1
    }))
  }))
}

Page({
  data: {
    match: null,
    resultOptions: RESULT_OPTIONS.map((value) => ({ value, selected: false })),
    backupOptions: RESULT_OPTIONS.map((value) => ({ value, selected: false })),
    goalOptions: GOAL_OPTIONS.map((value) => ({ value, selected: false })),
    scoreGroups: buildScoreGroups([]),
    selectedResult: '',
    selectedBackup: '',
    selectedScores: [],
    selectedGoals: ''
  },

  onLoad(options) {
    this.matchId = options && options.id
    if (!hasPredictionProfile()) {
      wx.showModal({
        title: '需要微信资料',
        content: '只有同意使用微信头像和微信名的用户才能提交预测，游客无法预测。',
        showCancel: false,
        success: () => wx.navigateBack()
      })
      return
    }
    this.loadMatch()
    refreshRemoteDatabase(null, () => this.loadMatch())
  },

  loadMatch() {
    const match = formatMatch(findMatch(this.matchId))
    this.setData({ match })
    if (!match) {
      wx.showToast({ title: '未找到比赛', icon: 'none' })
    }
  },

  selectResult(event) {
    const value = event.currentTarget.dataset.value
    this.setData({
      selectedResult: value,
      resultOptions: RESULT_OPTIONS.map((item) => ({ value: item, selected: item === value }))
    })
  },

  selectBackup(event) {
    const value = event.currentTarget.dataset.value
    const selectedBackup = this.data.selectedBackup === value ? '' : value
    this.setData({
      selectedBackup,
      backupOptions: RESULT_OPTIONS.map((item) => ({ value: item, selected: item === selectedBackup }))
    })
  },

  selectScore(event) {
    const value = event.currentTarget.dataset.value
    let selectedScores = this.data.selectedScores.slice()
    const index = selectedScores.indexOf(value)
    if (index !== -1) {
      selectedScores.splice(index, 1)
    } else if (selectedScores.length < 2) {
      selectedScores.push(value)
    } else {
      wx.showToast({ title: '比分最多选 2 个', icon: 'none' })
      return
    }
    this.setData({
      selectedScores,
      scoreGroups: buildScoreGroups(selectedScores)
    })
  },

  selectGoals(event) {
    const value = event.currentTarget.dataset.value
    this.setData({
      selectedGoals: value,
      goalOptions: GOAL_OPTIONS.map((item) => ({ value: item, selected: item === value }))
    })
  },

  submitPrediction() {
    const match = this.data.match
    if (!match) return
    if (!this.data.selectedResult) {
      wx.showToast({ title: '请选择胜平负', icon: 'none' })
      return
    }
    if (this.data.selectedScores.length !== 2) {
      wx.showToast({ title: '请选择 2 个比分', icon: 'none' })
      return
    }
    if (!this.data.selectedGoals) {
      wx.showToast({ title: '请选择进球数', icon: 'none' })
      return
    }

    submitPrediction({
      matchId: match.id,
      dateText: match.dateText,
      kickoff: match.kickoff,
      home: {
        cn: match.home.cn,
        en: match.home.en,
        abbr: match.home.abbr,
        flag: match.home.flag
      },
      away: {
        cn: match.away.cn,
        en: match.away.en,
        abbr: match.away.abbr,
        flag: match.away.flag
      },
      picks: {
        result: this.data.selectedResult,
        backup: this.data.selectedBackup,
        scores: this.data.selectedScores,
        goals: this.data.selectedGoals
      }
    }).then((result) => {
      wx.navigateTo({
        url: `/pages/predictionResult/predictionResult?id=${result.prediction.id}`
      })
    }).catch((error) => {
      const message = error && error.message === 'PROFILE_REQUIRED'
        ? '请先同意使用微信头像和微信名'
        : '提交失败，请稍后再试'
      wx.showToast({ title: message, icon: 'none' })
    })
  }
})
