const path = require('path')
const { readStore, readLiveScores, writeDatabaseSnapshot } = require('./store')

const miniProgramData = require(path.resolve(__dirname, '..', '..', 'utils', 'matches.js'))
const buildInfo = require(path.resolve(__dirname, '..', '..', 'utils', 'buildInfo.js'))
const FINISHED_KEEP_MS = 60 * 60 * 1000
const INCLUDE_BETFAIR_CACHE = process.env.INCLUDE_BETFAIR_CACHE === '1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function attachBetfairMarkets(matches, markets) {
  return matches.map((match) => ({
    ...match,
    remoteBetfair: markets[match.id] || match.remoteBetfair || null
  }))
}

function applyLiveScore(match, scores) {
  const latest = scores && scores[match.id]
  if (!latest) return match
  const next = {
    ...match,
    matchStatus: latest.matchStatus || match.matchStatus,
    statusText: latest.statusText || match.statusText,
    dateText: latest.dateText || match.dateText,
    kickoff: latest.kickoff || match.kickoff,
    scheduleAt: latest.scheduleAt || match.scheduleAt,
    sortTime: latest.sortTime || match.sortTime,
    scoreUpdatedAt: latest.updatedAt || match.scoreUpdatedAt,
    scoreSource: latest.source || match.scoreSource
  }

  if (next.matchStatus === 'not_started') {
    next.liveScore = ''
    next.matchClock = ''
    next.liveMinute = ''
    next.phaseText = ''
  } else {
    next.liveScore = latest.liveScore || match.liveScore
    next.matchClock = latest.matchClock || ''
    next.liveMinute = latest.liveMinute || ''
    next.phaseText = latest.phaseText || ''
  }

  if (next.matchStatus === 'finished' && !next.finishDetectedAt) {
    next.finishDetectedAt = Date.parse(latest.updatedAt || '') || Date.now()
  }
  return next
}

function applyLiveScores(matches, scores) {
  return matches.map((match) => applyLiveScore(match, scores))
}

function getFinishDetectedAt(match) {
  if (match.finishDetectedAt) return match.finishDetectedAt
  if (match.review && match.review.endedAtMs) return match.review.endedAtMs
  if (match.matchStatus === 'finished' && match.scoreUpdatedAt) {
    return Date.parse(match.scoreUpdatedAt) || Date.now()
  }
  if (match.matchStatus === 'finished' && match.sortTime) {
    return match.sortTime + 2 * 60 * 60 * 1000
  }
  return Date.now()
}

function keepVisibleFinished(match) {
  if (match.matchStatus !== 'finished') return true
  return Date.now() - getFinishDetectedAt(match) <= FINISHED_KEEP_MS
}

function getWinnerFromScore(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return ''
  if (parts[0] > parts[1]) return 'home'
  if (parts[0] < parts[1]) return 'away'
  return 'draw'
}

function getPickWinner(match) {
  const result = match.pick && match.pick.result ? match.pick.result : ''
  if (result.includes('平')) return 'draw'
  if ((match.home && result.includes(match.home.cn)) || result.includes('主胜')) return 'home'
  if ((match.away && result.includes(match.away.cn)) || result.includes('客胜')) return 'away'
  return ''
}

function getScoreTotal(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return parts[0] + parts[1]
}

function parseTotalRange(totalText) {
  const text = String(totalText || '')
  const rangeMatch = text.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) }
  const singleMatch = text.match(/(\d+)/)
  if (!singleMatch) return null
  const value = Number(singleMatch[1])
  return { min: value, max: value }
}

function inferTotalPickFromScores(scoreMain, scoreBackup) {
  const totals = [getScoreTotal(scoreMain), getScoreTotal(scoreBackup)].filter((value) => value !== null)
  if (!totals.length) return ''
  const min = Math.min(...totals)
  const max = Math.max(...totals)
  return min === max ? `${min}球` : `${min}-${max}球`
}

function isTotalCorrect(score, totalText) {
  const actualTotal = getScoreTotal(score)
  const range = parseTotalRange(totalText)
  return actualTotal !== null && !!range && actualTotal >= range.min && actualTotal <= range.max
}

function formatPercentValue(value) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`
}

function getPredictionWeight(mainCorrect, backupCorrect) {
  if (mainCorrect) return 100
  if (backupCorrect) return 50
  return 0
}

function getShortResultByWinner(winner, match) {
  if (winner === 'draw') return '平'
  if (winner === 'home') return match.home && match.home.cn
  if (winner === 'away') return match.away && match.away.cn
  return ''
}

function resultMatchesWinner(resultText, winner, match) {
  const text = String(resultText || '')
  if (!text || !winner) return false
  if (winner === 'draw') return text.includes('平')
  if (winner === 'home') return text.includes(match.home && match.home.cn) || text.includes('主胜')
  if (winner === 'away') return text.includes(match.away && match.away.cn) || text.includes('客胜')
  return false
}

function buildReviewFromFinishedMatch(match) {
  const pick = match.pick || {}
  const scoreMain = pick.score || ''
  const scoreBackup = pick.backup || ''
  const totalPick = pick.total || inferTotalPickFromScores(scoreMain, scoreBackup)
  const actualWinner = getWinnerFromScore(match.liveScore)
  const resultMainCorrect = actualWinner && getPickWinner(match) === actualWinner
  const resultBackupCorrect = actualWinner && resultMatchesWinner(pick.resultBackup, actualWinner, match)
  const scoreMainCorrect = match.liveScore === scoreMain
  const scoreBackupCorrect = match.liveScore === scoreBackup
  const totalCorrect = isTotalCorrect(match.liveScore, totalPick)
  const percentValue =
    getPredictionWeight(resultMainCorrect, resultBackupCorrect) * 0.5 +
    getPredictionWeight(scoreMainCorrect, scoreBackupCorrect) * 0.3 +
    (totalCorrect ? 100 : 0) * 0.2

  return {
    id: `${match.id}-server-review`,
    matchId: match.id,
    home: match.home && match.home.cn,
    away: match.away && match.away.cn,
    score: match.liveScore,
    resultMain: pick.result || '',
    resultBackup: pick.resultBackup || '',
    scoreMain,
    scoreBackup,
    totalPick,
    resultMainCorrect: !!resultMainCorrect,
    resultBackupCorrect: !!resultBackupCorrect,
    scoreMainCorrect,
    scoreBackupCorrect,
    totalCorrect,
    percentValue,
    percent: formatPercentValue(percentValue),
    endedAtSort: getFinishDetectedAt(match),
    source: 'server-live-score'
  }
}

function mergeFinishedReviews(staticReviews, finishedFromLive) {
  const byMatchId = new Map()
  staticReviews.forEach((review) => {
    byMatchId.set(review.matchId || review.id, review)
  })
  finishedFromLive.forEach((match) => {
    if (!match.liveScore) return
    byMatchId.set(match.id, buildReviewFromFinishedMatch(match))
  })
  return Array.from(byMatchId.values())
    .sort((a, b) => (b.endedAtSort || 0) - (a.endedAtSort || 0))
}

function buildDatabaseSnapshot(options = {}) {
  const betfairStore = readStore()
  const liveScoreStore = options.liveScoreStore || readLiveScores()
  const markets = INCLUDE_BETFAIR_CACHE ? (betfairStore.markets || {}) : {}
  const liveScores = liveScoreStore.scores || {}
  const matches = attachBetfairMarkets(applyLiveScores(clone(miniProgramData.matches || []), liveScores), markets)
  const baseUpcoming = attachBetfairMarkets(applyLiveScores(clone(miniProgramData.upcomingMatches || []), liveScores), markets)
  const baseRecentFinished = attachBetfairMarkets(applyLiveScores(clone(miniProgramData.recentFinishedHomeMatches || []), liveScores), markets)
  const historyMatches = attachBetfairMarkets(applyLiveScores(clone(miniProgramData.historyMatches || []), liveScores), markets)
  const finishedFromLive = baseUpcoming
    .concat(baseRecentFinished)
    .filter((match) => match.matchStatus === 'finished')
  const upcomingMatches = baseUpcoming.filter((match) => match.matchStatus !== 'finished')
  const recentFinishedHomeMatches = baseUpcoming
    .concat(baseRecentFinished)
    .filter((match) => match.matchStatus === 'finished' && keepVisibleFinished(match))
  const finishedMatches = mergeFinishedReviews(clone(miniProgramData.finishedMatches || []), finishedFromLive)

  return writeDatabaseSnapshot({
    version: buildInfo.DATABASE_VERSION,
    databaseUpdatedAt: new Date().toISOString(),
    source: 'server-snapshot',
    betfairUpdatedAt: betfairStore.updatedAt || '',
    liveScoreUpdatedAt: liveScoreStore.updatedAt || '',
    matches,
    upcomingMatches,
    recentFinishedHomeMatches,
    historyMatches,
    finishedMatches,
    reviewSuccessRate: miniProgramData.reviewSuccessRate || '',
    reviewSummary: miniProgramData.reviewSummary || ''
  })
}

if (require.main === module) {
  const result = buildDatabaseSnapshot()
  console.log(JSON.stringify({
    generatedAt: result.generatedAt,
    matches: result.matches.length,
    upcomingMatches: result.upcomingMatches.length,
    finishedMatches: result.finishedMatches.length
  }, null, 2))
}

module.exports = { buildDatabaseSnapshot }
