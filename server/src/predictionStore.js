const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { readUsersStore, publicUser } = require('./userStore')

const DATA_DIR = path.resolve(__dirname, '..', 'data')
const PREDICTIONS_FILE = path.join(DATA_DIR, 'predictions.json')

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function nowIso() {
  return new Date().toISOString()
}

function createId() {
  return `pred_${crypto.randomBytes(12).toString('hex')}`
}

function createGroupId() {
  return `grp_${crypto.randomBytes(10).toString('hex')}`
}

function safeText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function readPredictionStore() {
  try {
    const raw = fs.readFileSync(PREDICTIONS_FILE, 'utf8')
    const store = JSON.parse(raw)
    return {
      predictions: Array.isArray(store.predictions) ? store.predictions : [],
      groups: Array.isArray(store.groups) ? store.groups : []
    }
  } catch (error) {
    return { predictions: [], groups: [] }
  }
}

function writePredictionStore(store) {
  ensureDataDir()
  const payload = {
    predictions: Array.isArray(store.predictions) ? store.predictions : [],
    groups: Array.isArray(store.groups) ? store.groups : [],
    updatedAt: nowIso()
  }
  fs.writeFileSync(PREDICTIONS_FILE, JSON.stringify(payload, null, 2))
  return payload
}

function normalizeTeam(team) {
  return {
    cn: safeText(team && team.cn, 40),
    en: safeText(team && team.en, 80),
    abbr: safeText(team && team.abbr, 8),
    flag: safeText(team && team.flag, 200)
  }
}

function normalizePrediction(user, payload) {
  const picks = payload && payload.picks ? payload.picks : {}
  const scores = Array.isArray(picks.scores) ? picks.scores.map((item) => safeText(item, 12)).filter(Boolean).slice(0, 2) : []
  return {
    id: createId(),
    userId: user.id,
    matchId: safeText(payload && payload.matchId, 120),
    dateText: safeText(payload && payload.dateText, 40),
    kickoff: safeText(payload && payload.kickoff, 20),
    home: normalizeTeam(payload && payload.home),
    away: normalizeTeam(payload && payload.away),
    picks: {
      result: safeText(picks.result, 12),
      backup: safeText(picks.backup, 12),
      scores,
      goals: safeText(picks.goals, 12)
    },
    createdAt: nowIso()
  }
}

function validatePrediction(prediction) {
  if (!prediction.matchId) return 'MISSING_MATCH_ID'
  if (!prediction.picks.result) return 'MISSING_RESULT'
  if (prediction.picks.scores.length !== 2) return 'MISSING_SCORES'
  if (!prediction.picks.goals) return 'MISSING_GOALS'
  return ''
}

function saveUserPrediction(user, payload) {
  const prediction = normalizePrediction(user, payload)
  const error = validatePrediction(prediction)
  if (error) {
    const err = new Error(error)
    err.statusCode = 400
    throw err
  }
  const store = readPredictionStore()
  const sameMatchIndex = store.predictions.findIndex((item) => item.userId === user.id && item.matchId === prediction.matchId)
  if (sameMatchIndex !== -1) {
    prediction.id = store.predictions[sameMatchIndex].id
    prediction.createdAt = store.predictions[sameMatchIndex].createdAt || prediction.createdAt
    prediction.updatedAt = nowIso()
    store.predictions[sameMatchIndex] = prediction
  } else {
    store.predictions.unshift(prediction)
  }
  writePredictionStore(store)
  return prediction
}

function normalizeGroupMatch(match) {
  return {
    matchId: safeText(match && (match.matchId || match.id), 120),
    dateText: safeText(match && match.dateText, 40),
    kickoff: safeText(match && match.kickoff, 20),
    home: normalizeTeam(match && match.home),
    away: normalizeTeam(match && match.away)
  }
}

function createPredictionGroup(user, payload) {
  const size = Number(payload && payload.size)
  if ([2, 5, 10].indexOf(size) === -1) {
    const err = new Error('INVALID_GROUP_SIZE')
    err.statusCode = 400
    throw err
  }
  const matches = Array.isArray(payload && payload.matches)
    ? payload.matches.map(normalizeGroupMatch).filter((match) => match.matchId).slice(0, 12)
    : []
  if (!matches.length) {
    const err = new Error('MISSING_GROUP_MATCHES')
    err.statusCode = 400
    throw err
  }
  const store = readPredictionStore()
  const group = {
    id: createGroupId(),
    ownerId: user.id,
    size,
    matches,
    members: [user.id],
    predictions: {},
    createdAt: nowIso()
  }
  store.groups.unshift(group)
  writePredictionStore(store)
  return group
}

function getGroupById(groupId) {
  const store = readPredictionStore()
  return store.groups.find((group) => group.id === groupId) || null
}

function deletePredictionGroup(user, groupId) {
  const store = readPredictionStore()
  const index = store.groups.findIndex((group) => group.id === groupId)
  if (index === -1) {
    const err = new Error('GROUP_NOT_FOUND')
    err.statusCode = 404
    throw err
  }
  const group = store.groups[index]
  if (group.ownerId !== user.id) {
    const err = new Error('GROUP_DELETE_FORBIDDEN')
    err.statusCode = 403
    throw err
  }
  store.groups.splice(index, 1)
  writePredictionStore(store)
  return group
}

function joinPredictionGroup(user, groupId) {
  const store = readPredictionStore()
  const group = store.groups.find((item) => item.id === groupId)
  if (!group) {
    const err = new Error('GROUP_NOT_FOUND')
    err.statusCode = 404
    throw err
  }
  group.members = Array.isArray(group.members) ? group.members : []
  if (group.members.indexOf(user.id) === -1) {
    if (group.members.length >= group.size) {
      const err = new Error('GROUP_FULL')
      err.statusCode = 409
      throw err
    }
    group.members.push(user.id)
    group.updatedAt = nowIso()
    writePredictionStore(store)
  }
  return group
}

function saveGroupPredictions(user, groupId, payload) {
  const store = readPredictionStore()
  const group = store.groups.find((item) => item.id === groupId)
  if (!group) {
    const err = new Error('GROUP_NOT_FOUND')
    err.statusCode = 404
    throw err
  }
  if ((group.members || []).indexOf(user.id) === -1) {
    if ((group.members || []).length >= group.size) {
      const err = new Error('GROUP_FULL')
      err.statusCode = 409
      throw err
    }
    group.members = (group.members || []).concat(user.id)
  }
  const byMatch = {}
  const submitted = Array.isArray(payload && payload.predictions) ? payload.predictions : []
  submitted.forEach((item) => {
    const prediction = normalizePrediction(user, item)
    const error = validatePrediction(prediction)
    if (!error) byMatch[prediction.matchId] = prediction
  })
  const required = (group.matches || []).map((match) => match.matchId)
  const complete = required.every((matchId) => byMatch[matchId])
  if (!complete) {
    const err = new Error('INCOMPLETE_GROUP_PREDICTIONS')
    err.statusCode = 400
    throw err
  }
  group.predictions = group.predictions || {}
  group.predictions[user.id] = {
    userId: user.id,
    predictions: required.map((matchId) => byMatch[matchId]),
    submittedAt: nowIso()
  }
  group.updatedAt = nowIso()
  writePredictionStore(store)
  return group
}

function getScoreParts(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return parts
}

function getActualResult(review) {
  const parts = getScoreParts(review && review.score)
  if (!parts) return ''
  if (parts[0] > parts[1]) return '主胜'
  if (parts[0] < parts[1]) return '客胜'
  return '平局'
}

function scoreOptionMatches(actualScore, option) {
  const parts = getScoreParts(actualScore)
  if (!parts || !option) return false
  const exact = String(option).replace(':', '-')
  if (/^\d+-\d+$/.test(exact)) return exact === actualScore
  const home = parts[0]
  const away = parts[1]
  const listedHomeWins = ['1-0', '2-0', '2-1', '3-0', '3-1', '3-2', '4-0', '4-1', '4-2', '5-0', '5-1', '5-2']
  const listedDraws = ['0-0', '1-1', '2-2', '3-3']
  const listedAwayWins = ['0-1', '0-2', '1-2', '0-3', '1-3', '2-3', '0-4', '1-4', '2-4', '0-5', '1-5', '2-5']
  if (option === '胜其它') return home > away && listedHomeWins.indexOf(actualScore) === -1
  if (option === '平其它') return home === away && listedDraws.indexOf(actualScore) === -1
  if (option === '负其它') return home < away && listedAwayWins.indexOf(actualScore) === -1
  return false
}

function goalOptionMatches(actualScore, option) {
  const parts = getScoreParts(actualScore)
  if (!parts || !option) return false
  const total = parts[0] + parts[1]
  if (option === '5+') return total >= 5
  const range = String(option).match(/^(\d+)-(\d+)$/)
  if (!range) return false
  return total >= Number(range[1]) && total <= Number(range[2])
}

function getWeight(mainCorrect, backupCorrect) {
  if (mainCorrect) return 100
  if (backupCorrect) return 50
  return 0
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function settlePrediction(prediction, reviewMap) {
  const review = reviewMap[prediction.matchId]
  if (!review || !review.score) {
    return Object.assign({}, prediction, {
      settled: false,
      percentValue: null,
      percent: '待结算'
    })
  }
  const actualResult = getActualResult(review)
  const resultMainCorrect = prediction.picks.result === actualResult
  const resultBackupCorrect = prediction.picks.backup ? prediction.picks.backup === actualResult : false
  const scoreMainCorrect = scoreOptionMatches(review.score, prediction.picks.scores[0])
  const scoreBackupCorrect = scoreOptionMatches(review.score, prediction.picks.scores[1])
  const totalCorrect = goalOptionMatches(review.score, prediction.picks.goals)
  const percentValue = getWeight(resultMainCorrect, resultBackupCorrect) * 0.5 +
    getWeight(scoreMainCorrect, scoreBackupCorrect) * 0.3 +
    (totalCorrect ? 100 : 0) * 0.2
  return Object.assign({}, prediction, {
    settled: true,
    actualScore: review.score,
    endedAtSort: review.endedAtSort || 0,
    resultMainCorrect,
    resultBackupCorrect,
    scoreMainCorrect,
    scoreBackupCorrect,
    totalCorrect,
    percentValue,
    percent: formatPercent(percentValue)
  })
}

function buildReviewMap(snapshot) {
  const reviews = snapshot && Array.isArray(snapshot.finishedMatches) ? snapshot.finishedMatches : []
  return reviews.reduce((map, review) => {
    if (review && review.matchId) map[review.matchId] = review
    return map
  }, {})
}

function getLatestSettled(predictions, limit) {
  return predictions
    .filter((item) => item.settled)
    .sort((a, b) => (b.endedAtSort || 0) - (a.endedAtSort || 0))
    .slice(0, limit)
}

function buildStats(predictions) {
  const latest = getLatestSettled(predictions, 10)
  const average = latest.length
    ? latest.reduce((sum, item) => sum + Number(item.percentValue || 0), 0) / latest.length
    : 0
  return {
    settledCount: latest.length,
    accuracyValue: average,
    accuracy: formatPercent(average)
  }
}

function buildUserSummaries(settledPredictions) {
  const usersStore = readUsersStore()
  const byUser = {}
  settledPredictions.forEach((prediction) => {
    if (!byUser[prediction.userId]) byUser[prediction.userId] = []
    byUser[prediction.userId].push(prediction)
  })
  return Object.keys(byUser).map((userId) => {
    const stats = buildStats(byUser[userId])
    return {
      userId,
      user: publicUser(usersStore.users[userId]),
      settledCount: stats.settledCount,
      accuracyValue: stats.accuracyValue,
      accuracy: stats.accuracy
    }
  }).filter((item) => item.settledCount > 0)
    .sort((a, b) => {
      const accuracyDiff = b.accuracyValue - a.accuracyValue
      if (accuracyDiff) return accuracyDiff
      return b.settledCount - a.settledCount
    })
    .map((item, index) => Object.assign({}, item, { rank: index + 1 }))
}

function getPublicUserMap(userIds) {
  const usersStore = readUsersStore()
  return userIds.reduce((map, userId) => {
    map[userId] = publicUser(usersStore.users[userId]) || {
      id: userId,
      nickname: '微信用户',
      avatarUrl: '',
      hasProfile: false
    }
    return map
  }, {})
}

function decorateGroup(group, currentUserId, snapshot) {
  const reviewMap = buildReviewMap(snapshot)
  const members = Array.isArray(group.members) ? group.members : []
  const userMap = getPublicUserMap(members)
  const predictionsByUser = group.predictions || {}
  const doneMembers = members.filter((userId) => {
    const entry = predictionsByUser[userId]
    return entry && Array.isArray(entry.predictions) && entry.predictions.length >= (group.matches || []).length
  })
  const rows = members.map((userId) => {
    const entry = predictionsByUser[userId]
    const predictions = entry && Array.isArray(entry.predictions) ? entry.predictions.map((prediction) => settlePrediction(prediction, reviewMap)) : []
    const settled = predictions.filter((prediction) => prediction.settled)
    const accuracyValue = settled.length
      ? settled.reduce((sum, item) => sum + Number(item.percentValue || 0), 0) / settled.length
      : 0
    const allSettled = predictions.length > 0 && predictions.every((prediction) => prediction.settled)
    return {
      userId,
      user: userMap[userId],
      done: doneMembers.indexOf(userId) !== -1,
      submittedAt: entry && entry.submittedAt || '',
      predictions,
      settledCount: settled.length,
      allSettled,
      accuracyValue,
      accuracy: formatPercent(accuracyValue)
    }
  })
  const allPredicted = doneMembers.length >= group.size
  const allSettled = allPredicted && rows.every((row) => row.allSettled)
  let rankedRows = rows
  if (allSettled) {
    rankedRows = rows.slice().sort((a, b) => {
      const diff = b.accuracyValue - a.accuracyValue
      if (diff) return diff
      return Date.parse(a.submittedAt || 0) - Date.parse(b.submittedAt || 0)
    }).map((row, index) => {
      const rank = group.size === 2 ? null : index + 1
      const medal = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : ''
      return Object.assign({}, row, { rank, medal })
    })
  }
  return Object.assign({}, group, {
    currentUserJoined: members.indexOf(currentUserId) !== -1,
    currentUserDone: doneMembers.indexOf(currentUserId) !== -1,
    doneCount: doneMembers.length,
    progressText: `${doneMembers.length}/${group.size}`,
    allPredicted,
    allSettled,
    members: rankedRows
  })
}

function getGroupDashboard(user, snapshot) {
  const store = readPredictionStore()
  return {
    groups: store.groups
      .filter((group) => (group.members || []).indexOf(user.id) !== -1 || group.ownerId === user.id)
      .map((group) => decorateGroup(group, user.id, snapshot))
  }
}

function getUserMedals(user, snapshot) {
  const store = readPredictionStore()
  const medals = { gold: 0, silver: 0, bronze: 0 }
  store.groups.forEach((group) => {
    const decorated = decorateGroup(group, user.id, snapshot)
    if (!decorated.allSettled || group.size === 2) return
    const row = decorated.members.find((item) => item.userId === user.id)
    if (row && row.medal && medals[row.medal] !== undefined) medals[row.medal] += 1
  })
  return medals
}

function getPredictionDashboard(user, snapshot) {
  const store = readPredictionStore()
  const reviewMap = buildReviewMap(snapshot)
  const settledAll = store.predictions.map((prediction) => settlePrediction(prediction, reviewMap))
  const userPredictions = settledAll
    .filter((prediction) => prediction.userId === user.id)
    .sort((a, b) => Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0))
  const leaderboard = buildUserSummaries(settledAll)
  const mine = leaderboard.find((item) => item.userId === user.id)
  const stats = Object.assign(buildStats(userPredictions), {
    rank: mine ? mine.rank : null,
    totalUsers: leaderboard.length
  })
  return {
    predictions: userPredictions,
    stats,
    leaderboard: leaderboard.slice(0, 50)
  }
}

module.exports = {
  createPredictionGroup,
  deletePredictionGroup,
  decorateGroup,
  getGroupById,
  getGroupDashboard,
  getUserMedals,
  getPredictionDashboard,
  joinPredictionGroup,
  saveGroupPredictions,
  saveUserPrediction
}
