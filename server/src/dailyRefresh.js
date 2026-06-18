const { syncBetfairMarkets } = require('./syncOnce')
const { buildDatabaseSnapshot } = require('./buildDatabaseSnapshot')
const { refreshLiveScoreSnapshot } = require('./liveScoreRefresh')

async function dailyRefresh() {
  let betfairStatus = 'skipped'
  try {
    await syncBetfairMarkets()
    betfairStatus = 'synced'
  } catch (error) {
    betfairStatus = `failed: ${error.message}`
  }

  let snapshot = buildDatabaseSnapshot()
  let liveScoreStatus = 'skipped'
  try {
    const liveScoreResult = await refreshLiveScoreSnapshot()
    liveScoreStatus = `synced: ${liveScoreResult.scoreCount}`
    snapshot = buildDatabaseSnapshot()
  } catch (error) {
    liveScoreStatus = `failed: ${error.message}`
  }

  return {
    ok: true,
    betfairStatus,
    liveScoreStatus,
    generatedAt: snapshot.generatedAt,
    matches: snapshot.matches.length,
    upcomingMatches: snapshot.upcomingMatches.length,
    finishedMatches: snapshot.finishedMatches.length
  }
}

if (require.main === module) {
  dailyRefresh()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2))
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}

module.exports = { dailyRefresh }
