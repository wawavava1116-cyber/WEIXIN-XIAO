const { syncBetfairMarkets } = require('./syncOnce')
const { buildDatabaseSnapshot } = require('./buildDatabaseSnapshot')

async function dailyRefresh() {
  let betfairStatus = 'skipped'
  try {
    await syncBetfairMarkets()
    betfairStatus = 'synced'
  } catch (error) {
    betfairStatus = `failed: ${error.message}`
  }

  const snapshot = buildDatabaseSnapshot()
  return {
    ok: true,
    betfairStatus,
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
