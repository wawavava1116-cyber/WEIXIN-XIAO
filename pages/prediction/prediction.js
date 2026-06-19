const { upcomingMatches } = require('../../utils/matches')
const { getRemoteDatabaseBadge, getRemoteMatchesSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { createPredictionGroup, fetchPredictionDashboard, getPrediction, hasPredictionProfile } = require('../../utils/userPredictions')
const { getTeamAbbr } = require('../../utils/teamAbbr')

const DAY = 24 * 60 * 60 * 1000
const BEIJING_OFFSET = 8 * 60 * 60 * 1000

function getMatchTimeValue(match) {
  if (typeof match.sortTime === 'number' && match.sortTime > 0) return match.sortTime
  return 0
}

function getBeijingDayKey(time) {
  const date = new Date(time + BEIJING_OFFSET)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getPredictionWindowKeys(now) {
  return [getBeijingDayKey(now), getBeijingDayKey(now + DAY)]
}

function isPendingMatch(match, now, windowKeys) {
  const sortTime = getMatchTimeValue(match)
  if (!sortTime || sortTime < now) return false
  if (match.isFinished || match.matchStatus === 'finished' || match.matchStatus === 'live') return false
  return windowKeys.indexOf(getBeijingDayKey(sortTime)) !== -1
}

function buildPredictionMatches() {
  const now = Date.now()
  const windowKeys = getPredictionWindowKeys(now)
  return getRemoteMatchesSync('upcomingMatches', upcomingMatches).slice()
    .filter((match) => isPendingMatch(match, now, windowKeys))
    .sort((a, b) => getMatchTimeValue(a) - getMatchTimeValue(b))
    .map((match) => {
      const saved = getPrediction(`prediction-${match.id}`)
      return {
        id: match.id,
        dateText: match.dateText,
        kickoff: match.kickoff,
        home: Object.assign({}, match.home, { abbr: getTeamAbbr(match.home) }),
        away: Object.assign({}, match.away, { abbr: getTeamAbbr(match.away) }),
        savedText: saved ? '已预测' : '',
        resultPath: saved ? `/pages/predictionResult/predictionResult?id=${saved.id}` : '',
        formPath: `/pages/predictionForm/predictionForm?id=${match.id}`
      }
    })
}

function buildSubmittedPrediction(item) {
  const picks = item.picks || {}
  const scores = Array.isArray(picks.scores) ? picks.scores : []
  return Object.assign({}, item, {
    resultText: `${picks.result || '--'}${picks.backup ? ` / ${picks.backup}` : ''}`,
    scoreText: `${scores[0] || '--'} / ${scores[1] || '--'}`,
    goalsText: picks.goals || '--'
  })
}

function buildGroupSubmittedPrediction(group) {
  const firstMatch = group.matches && group.matches[0] || {}
  const matchCount = group.matches && group.matches.length || 0
  const stateText = group.allSettled ? '已结算' : group.allPredicted ? '等待赛果' : '等待成员预测'
  return {
    id: group.id,
    size: group.size,
    dateText: firstMatch.dateText || '',
    kickoff: firstMatch.kickoff || '',
    matchText: matchCount ? `${matchCount} 场比赛` : '小组比赛',
    titleText: `${group.size}人预测小组（小组预测）`,
    progressText: group.progressText || `0/${group.size}`,
    stateText,
    path: `/pages/predictionGroup/predictionGroup?id=${group.id}`
  }
}

function buildGroupMatchOptions(matches, selectedIds) {
  return matches.map((match) => Object.assign({}, match, {
    selected: selectedIds.indexOf(match.id) !== -1
  }))
}

Page({
  data: {
    databaseBadge: getRemoteDatabaseBadge(),
    canPredict: hasPredictionProfile(),
    authMessage: '',
    matches: buildPredictionMatches(),
    submittedPredictions: [],
    groupSubmittedPredictions: [],
    groupSizeOptions: [
      { value: 2, selected: true },
      { value: 5, selected: false },
      { value: 10, selected: false }
    ],
    selectedGroupSize: 2,
    selectedGroupMatchIds: [],
    groupMatchOptions: [],
    groups: [],
    predictionStats: {
      accuracy: '0.0%',
      settledCount: 0,
      rank: null,
      totalUsers: 0
    }
  },

  onShow() {
    refreshRemoteDatabase(null, () => this.refreshPredictions())
    this.refreshPredictions()
    this.refreshDashboard()
  },

  refreshPredictions() {
    const matches = buildPredictionMatches()
    this.setData({
      databaseBadge: getRemoteDatabaseBadge(),
      canPredict: hasPredictionProfile(),
      matches,
      groupMatchOptions: buildGroupMatchOptions(matches, this.data.selectedGroupMatchIds)
    })
  },

  refreshDashboard() {
    if (!hasPredictionProfile()) {
      this.setData({
        canPredict: false,
        authMessage: '同意使用微信头像和微信名后才能提交预测，游客无法预测。',
        submittedPredictions: [],
        groupSubmittedPredictions: [],
        predictionStats: {
          accuracy: '0.0%',
          settledCount: 0,
          rank: null,
          totalUsers: 0
        }
      })
      return
    }
    fetchPredictionDashboard().then((result) => {
      const groups = (result.groups || []).slice(0, 10)
      this.setData({
        canPredict: true,
        authMessage: '',
        submittedPredictions: (result.predictions || []).slice(0, 10).map(buildSubmittedPrediction),
        groupSubmittedPredictions: groups.filter((group) => group.currentUserDone).map(buildGroupSubmittedPrediction),
        groups,
        medals: result.medals || {},
        predictionStats: result.stats || {}
      })
    }).catch((error) => {
      this.setData({
        authMessage: error && error.message === 'PROFILE_REQUIRED'
          ? '同意使用微信头像和微信名后才能提交预测，游客无法预测。'
          : '暂时无法读取云端预测档案'
      })
    })
  },

  selectGroupSize(event) {
    const value = Number(event.currentTarget.dataset.value)
    this.setData({
      selectedGroupSize: value,
      groupSizeOptions: this.data.groupSizeOptions.map((item) => ({
        value: item.value,
        selected: item.value === value
      }))
    })
  },

  toggleGroupMatch(event) {
    const id = event.currentTarget.dataset.id
    const selected = this.data.selectedGroupMatchIds.slice()
    const index = selected.indexOf(id)
    if (index !== -1) {
      selected.splice(index, 1)
    } else {
      selected.push(id)
    }
    this.setData({
      selectedGroupMatchIds: selected,
      groupMatchOptions: buildGroupMatchOptions(this.data.matches, selected)
    })
  },

  createGroup() {
    if (!hasPredictionProfile()) {
      wx.showToast({ title: '请先同意使用微信头像和微信名', icon: 'none' })
      return
    }
    if (!this.data.selectedGroupMatchIds.length) {
      wx.showToast({ title: '请选择预测比赛', icon: 'none' })
      return
    }
    const matches = this.data.matches
      .filter((match) => this.data.selectedGroupMatchIds.indexOf(match.id) !== -1)
      .map((match) => ({
        matchId: match.id,
        dateText: match.dateText,
        kickoff: match.kickoff,
        home: match.home,
        away: match.away
      }))
    createPredictionGroup({
      size: this.data.selectedGroupSize,
      matches
    }).then((result) => {
      const group = result.group || {}
      wx.navigateTo({ url: `/pages/predictionGroup/predictionGroup?id=${group.id}` })
    }).catch((error) => {
      const title = error && error.message === 'PROFILE_REQUIRED' ? '请先同意微信资料' : '发起失败'
      wx.showToast({ title, icon: 'none' })
    })
  }
})
