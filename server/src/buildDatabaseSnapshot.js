const path = require('path')
const { readStore, writeDatabaseSnapshot } = require('./store')

const miniProgramData = require(path.resolve(__dirname, '..', '..', 'utils', 'matches.js'))
const buildInfo = require(path.resolve(__dirname, '..', '..', 'utils', 'buildInfo.js'))

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function attachBetfairMarkets(matches, markets) {
  return matches.map((match) => ({
    ...match,
    remoteBetfair: markets[match.id] || match.remoteBetfair || null
  }))
}

function buildDatabaseSnapshot() {
  const betfairStore = readStore()
  const markets = betfairStore.markets || {}
  const matches = attachBetfairMarkets(clone(miniProgramData.matches || []), markets)
  const upcomingMatches = attachBetfairMarkets(clone(miniProgramData.upcomingMatches || []), markets)
  const recentFinishedHomeMatches = attachBetfairMarkets(clone(miniProgramData.recentFinishedHomeMatches || []), markets)
  const historyMatches = attachBetfairMarkets(clone(miniProgramData.historyMatches || []), markets)
  const finishedMatches = clone(miniProgramData.finishedMatches || [])

  return writeDatabaseSnapshot({
    version: buildInfo.DATABASE_VERSION,
    databaseUpdatedAt: new Date().toISOString(),
    source: 'server-snapshot',
    betfairUpdatedAt: betfairStore.updatedAt || '',
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
