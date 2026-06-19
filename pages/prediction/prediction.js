const { upcomingMatches } = require('../../utils/matches')
const { getRemoteDatabaseBadge, getRemoteMatchesSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { fetchPredictionDashboard, getPrediction, hasPredictionProfile } = require('../../utils/userPredictions')
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

Page({
  data: {
    databaseBadge: getRemoteDatabaseBadge(),
    canPredict: hasPredictionProfile(),
    authMessage: '',
    matches: buildPredictionMatches(),
    submittedPredictions: [],
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
    this.setData({
      databaseBadge: getRemoteDatabaseBadge(),
      canPredict: hasPredictionProfile(),
      matches: buildPredictionMatches()
    })
  },

  refreshDashboard() {
    if (!hasPredictionProfile()) {
      this.setData({
        canPredict: false,
        authMessage: '同意使用微信头像和微信名后才能提交预测，游客无法预测。',
        submittedPredictions: [],
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
      this.setData({
        canPredict: true,
        authMessage: '',
        submittedPredictions: (result.predictions || []).slice(0, 10).map(buildSubmittedPrediction),
        predictionStats: result.stats || {}
      })
    }).catch((error) => {
      this.setData({
        authMessage: error && error.message === 'PROFILE_REQUIRED'
          ? '同意使用微信头像和微信名后才能提交预测，游客无法预测。'
          : '暂时无法读取云端预测档案'
      })
    })
  }
})
