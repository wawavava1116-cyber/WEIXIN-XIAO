const { getRemoteDatabaseBadge, getRemoteMatchesSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { createPredictionGroup, deletePredictionGroup, fetchPredictionDashboard, getPrediction, hasPredictionProfile } = require('../../utils/userPredictions')
const { getStoredUser } = require('../../utils/userAuth')
const { getTeamAbbr } = require('../../utils/teamAbbr')
const { createMainSwipeHandlers } = require('../../utils/swipeNavigation')

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
  return getRemoteMatchesSync('upcomingMatches').slice()
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

function buildGroupCard(group) {
  const user = getStoredUser() || {}
  return Object.assign({}, group, {
    path: `/pages/predictionGroup/predictionGroup?id=${group.id}`,
    canDelete: group.ownerId === user.id
  })
}

function buildGroupMatchOptions(matches, selectedIds) {
  return matches.map((match) => Object.assign({}, match, {
    selected: selectedIds.indexOf(match.id) !== -1
  }))
}

Page(Object.assign({}, createMainSwipeHandlers('pages/prediction/prediction'), {
  data: {
    databaseBadge: getRemoteDatabaseBadge(),
    canPredict: hasPredictionProfile(),
    authMessage: '',
    matches: buildPredictionMatches(),
    showSubmittedRecords: false,
    submittedPredictions: [],
    groupSubmittedPredictions: [],
    submittedRecordCount: 0,
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
    refreshRemoteDatabase(null, () => this.refreshPredictions(), () => {
      wx.showToast({ title: '云端比赛读取失败', icon: 'none' })
    })
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
        authMessage: '完成微信身份和昵称后才能提交预测，游客无法预测。',
        submittedPredictions: [],
        groupSubmittedPredictions: [],
        submittedRecordCount: 0,
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
      const groups = (result.groups || []).slice(0, 10).map(buildGroupCard)
      const submittedPredictions = (result.predictions || []).slice(0, 10).map(buildSubmittedPrediction)
      const groupSubmittedPredictions = groups.filter((group) => group.currentUserDone).map(buildGroupSubmittedPrediction)
      this.setData({
        canPredict: true,
        authMessage: '',
        submittedPredictions,
        groupSubmittedPredictions,
        submittedRecordCount: submittedPredictions.length + groupSubmittedPredictions.length,
        groups,
        medals: result.medals || {},
        predictionStats: result.stats || {}
      })
    }).catch((error) => {
      this.setData({
        authMessage: error && error.message === 'PROFILE_REQUIRED'
          ? '完成微信身份和昵称后才能提交预测，游客无法预测。'
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

  toggleSubmittedRecords() {
    this.setData({
      showSubmittedRecords: !this.data.showSubmittedRecords
    })
  },

  createGroup() {
    if (!hasPredictionProfile()) {
      wx.showToast({ title: '请先选择微信昵称', icon: 'none' })
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
      const title = error && error.message === 'PROFILE_REQUIRED' ? '请先选择微信昵称' : '发起失败'
      wx.showToast({ title, icon: 'none' })
    })
  },

  openGroup(event) {
    const id = event.currentTarget.dataset.id
    if (id) wx.navigateTo({ url: `/pages/predictionGroup/predictionGroup?id=${id}` })
  },

  deleteGroup(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.showModal({
      title: '删除小组',
      content: '删除后，成员将无法继续通过这个小组预测。确定删除吗？',
      confirmText: '删除',
      confirmColor: '#d64545',
      success: (result) => {
        if (!result.confirm) return
        deletePredictionGroup(id).then(() => {
          wx.showToast({ title: '已删除', icon: 'success' })
          this.refreshDashboard()
        }).catch((error) => {
          const title = error && error.message === 'GROUP_DELETE_FORBIDDEN' ? '只能删除自己发起的小组' : '删除失败'
          wx.showToast({ title, icon: 'none' })
        })
      }
    })
  }
}))
