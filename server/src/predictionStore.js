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

function safeText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function readPredictionStore() {
  try {
    const raw = fs.readFileSync(PREDICTIONS_FILE, 'utf8')
    const store = JSON.parse(raw)
    return {
      predictions: Array.isArray(store.predictions) ? store.predictions : []
    }
  } catch (error) {
    return { predictions: [] }
  }
}

function writePredictionStore(store) {
  ensureDataDir()
  const payload = {
    predictions: Array.isArray(store.predictions) ? store.predictions : [],
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
  getPredictionDashboard,
  saveUserPrediction
}
