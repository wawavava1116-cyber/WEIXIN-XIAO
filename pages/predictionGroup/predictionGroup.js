const {
  fetchPredictionGroup,
  hasPredictionProfile,
  joinPredictionGroup,
  markPredictionGroupShared,
  submitGroupPredictions
} = require('../../utils/userPredictions')
const { getStoredUser } = require('../../utils/userAuth')
const { createBackSwipeHandlers } = require('../../utils/swipeNavigation')

const RESULT_OPTIONS = ['主胜', '平局', '客胜']
const GOAL_OPTIONS = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
const SCORE_GROUPS = [
  { key: 'home', title: '主胜比分', options: ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '胜其它'] },
  { key: 'draw', title: '平局比分', options: ['0:0', '1:1', '2:2', '3:3', '平其它'] },
  { key: 'away', title: '客胜比分', options: ['0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:5', '1:5', '2:5', '负其它'] }
]

function makeSelection(match) {
  return {
    matchId: match.matchId,
    result: '',
    backup: '',
    scores: [],
    goals: ''
  }
}

function decorateOptionList(options, selected) {
  return options.map((value) => ({ value, selected: value === selected }))
}

function decorateScoreGroups(selectedScores) {
  return SCORE_GROUPS.map((group) => Object.assign({}, group, {
    options: group.options.map((value) => ({
      value,
      selected: selectedScores.indexOf(value) !== -1
    }))
  }))
}

function decorateMatch(match, selection, collapsed, canCollapse) {
  return Object.assign({}, match, {
    collapsed: Boolean(collapsed),
    canCollapse: Boolean(canCollapse),
    toggleText: collapsed ? '展开' : '收起',
    resultOptions: decorateOptionList(RESULT_OPTIONS, selection.result),
    backupOptions: decorateOptionList(RESULT_OPTIONS, selection.backup),
    goalOptions: decorateOptionList(GOAL_OPTIONS, selection.goals),
    scoreGroups: decorateScoreGroups(selection.scores)
  })
}

function decorateGroup(group, selections, collapsedMatches) {
  if (!group) return null
  const matches = group.matches || []
  const canCollapse = matches.length > 1
  const collapsedMap = collapsedMatches || {}
  return Object.assign({}, group, {
    matchForms: matches.map((match) => decorateMatch(
      match,
      selections[match.matchId] || makeSelection(match),
      canCollapse && collapsedMap[match.matchId],
      canCollapse
    ))
  })
}

function getMedalText(medal) {
  if (medal === 'gold') return '金牌'
  if (medal === 'silver') return '银牌'
  if (medal === 'bronze') return '铜牌'
  return ''
}

function decorateMembers(group) {
  return (group && group.members || []).map((member) => Object.assign({}, member, {
    medalText: getMedalText(member.medal)
  }))
}

function getMySelections(group, fallbackSelections) {
  const user = getStoredUser() || {}
  const row = (group && group.members || []).find((member) => member.userId === user.id)
  const selections = Object.assign({}, fallbackSelections || {})
  if (row && Array.isArray(row.predictions)) {
    row.predictions.forEach((prediction) => {
      const picks = prediction.picks || {}
      selections[prediction.matchId] = {
        matchId: prediction.matchId,
        result: picks.result || '',
        backup: picks.backup || '',
        scores: Array.isArray(picks.scores) ? picks.scores.slice(0, 2) : [],
        goals: picks.goals || ''
      }
    })
  }
  return selections
}

Page(Object.assign({}, createBackSwipeHandlers(), {
  data: {
    group: null,
    members: [],
    canPredict: hasPredictionProfile(),
    selections: {},
    collapsedMatches: {},
    statusText: ''
  },

  onLoad(options) {
    this.groupId = options && options.id
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.loadGroup()
  },

  onShow() {
    if (this.groupId) this.loadGroup()
  },

  loadGroup() {
    if (!this.groupId) return
    fetchPredictionGroup(this.groupId).then((result) => {
      const group = result.group
      const selections = getMySelections(group, this.data.selections)
      const collapsedMatches = Object.assign({}, this.data.collapsedMatches)
      ;(group.matches || []).forEach((match, index) => {
        if (!selections[match.matchId]) selections[match.matchId] = makeSelection(match)
        if ((group.matches || []).length > 1 && collapsedMatches[match.matchId] === undefined) {
          collapsedMatches[match.matchId] = index > 0
        }
      })
      this.setData({
        group: decorateGroup(group, selections, collapsedMatches),
        members: decorateMembers(group),
        canPredict: hasPredictionProfile(),
        selections,
        collapsedMatches,
        statusText: group.allSettled ? '已结算' : group.allPredicted ? '等待赛果' : '等待成员预测'
      })
    }).catch(() => {
      wx.showToast({ title: '小组读取失败', icon: 'none' })
    })
  },

  joinGroup() {
    joinPredictionGroup(this.groupId).then((result) => {
      const group = result.group
      this.setData({
        group: decorateGroup(group, this.data.selections, this.data.collapsedMatches),
        members: decorateMembers(group)
      })
    }).catch((error) => {
      const title = error && error.message === 'PROFILE_REQUIRED' ? '请先选择微信昵称' : '加入失败'
      wx.showToast({ title, icon: 'none' })
    })
  },

  updateSelection(matchId, patch) {
    const selections = Object.assign({}, this.data.selections)
    selections[matchId] = Object.assign({}, selections[matchId] || { matchId, scores: [] }, patch)
    this.setData({
      selections,
      group: decorateGroup(this.data.group, selections, this.data.collapsedMatches)
    })
  },

  toggleMatchForm(event) {
    const matchId = event.currentTarget.dataset.matchId
    if (!matchId) return
    const collapsedMatches = Object.assign({}, this.data.collapsedMatches)
    collapsedMatches[matchId] = !collapsedMatches[matchId]
    this.setData({
      collapsedMatches,
      group: decorateGroup(this.data.group, this.data.selections, collapsedMatches)
    })
  },

  selectResult(event) {
    this.updateSelection(event.currentTarget.dataset.matchId, {
      result: event.currentTarget.dataset.value
    })
  },

  selectBackup(event) {
    const matchId = event.currentTarget.dataset.matchId
    const value = event.currentTarget.dataset.value
    const current = this.data.selections[matchId] || { matchId, scores: [] }
    this.updateSelection(matchId, {
      backup: current.backup === value ? '' : value
    })
  },

  selectScore(event) {
    const matchId = event.currentTarget.dataset.matchId
    const value = event.currentTarget.dataset.value
    const current = this.data.selections[matchId] || { matchId, scores: [] }
    const scores = current.scores.slice()
    const index = scores.indexOf(value)
    if (index !== -1) {
      scores.splice(index, 1)
    } else if (scores.length < 2) {
      scores.push(value)
    } else {
      wx.showToast({ title: '每场比分最多选 2 个', icon: 'none' })
      return
    }
    this.updateSelection(matchId, { scores })
  },

  selectGoals(event) {
    this.updateSelection(event.currentTarget.dataset.matchId, {
      goals: event.currentTarget.dataset.value
    })
  },

  submitGroup() {
    const group = this.data.group
    if (!group) return
    const predictions = (group.matches || []).map((match) => {
      const selection = this.data.selections[match.matchId] || makeSelection(match)
      return {
        matchId: match.matchId,
        dateText: match.dateText,
        kickoff: match.kickoff,
        home: match.home,
        away: match.away,
        picks: {
          result: selection.result,
          backup: selection.backup,
          scores: selection.scores,
          goals: selection.goals
        }
      }
    })
    const incomplete = predictions.some((item) => !item.picks.result || item.picks.scores.length !== 2 || !item.picks.goals)
    if (incomplete) {
      wx.showToast({ title: '请完成每场预测', icon: 'none' })
      return
    }
    submitGroupPredictions(group.id, predictions).then((result) => {
      const nextGroup = result.group
      wx.showToast({ title: '已提交', icon: 'success' })
      this.setData({
        group: decorateGroup(nextGroup, this.data.selections, this.data.collapsedMatches),
        members: decorateMembers(nextGroup)
      })
    }).catch((error) => {
      const title = error && error.message === 'PROFILE_REQUIRED' ? '请先选择微信昵称' : '提交失败'
      wx.showToast({ title, icon: 'none' })
    })
  },

  markShared() {
    if (!this.groupId || !hasPredictionProfile()) return
    markPredictionGroupShared(this.groupId).then((result) => {
      if (result && result.group) {
        this.setData({
          group: decorateGroup(result.group, this.data.selections, this.data.collapsedMatches),
          members: decorateMembers(result.group)
        })
      }
    }).catch(() => {})
  },

  onShareAppMessage() {
    const group = this.data.group || {}
    this.markShared()
    return {
      title: `${group.size || ''}人世界杯预测小组，来一起预测`,
      path: `/pages/predictionGroup/predictionGroup?id=${this.groupId}`
    }
  },

  onShareTimeline() {
    const group = this.data.group || {}
    this.markShared()
    return {
      title: `${group.size || ''}人世界杯预测小组，来一起预测`,
      query: `id=${this.groupId}`
    }
  }
}))
