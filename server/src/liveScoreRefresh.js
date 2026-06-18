const { readDatabaseSnapshot, writeLiveScores } = require('./store')
const { fetchLiveScores } = require('./liveScoresClient')
const { buildDatabaseSnapshot } = require('./buildDatabaseSnapshot')

function getTrackedMatchIds() {
  const snapshot = readDatabaseSnapshot()
  const fromSnapshot = snapshot && Array.isArray(snapshot.upcomingMatches)
    ? snapshot.upcomingMatches.concat(snapshot.recentFinishedHomeMatches || [])
    : []
  return Array.from(new Set(fromSnapshot.map((match) => match.id).filter(Boolean)))
}

async function refreshLiveScoreSnapshot(matchIds = getTrackedMatchIds()) {
  const scores = await fetchLiveScores(matchIds)
  const liveScoreStore = writeLiveScores(scores)
  const snapshot = buildDatabaseSnapshot({ liveScoreStore })
  return {
    ok: true,
    liveScoreUpdatedAt: liveScoreStore.updatedAt,
    scoreCount: Object.keys(scores).length,
    generatedAt: snapshot.generatedAt,
    upcomingMatches: snapshot.upcomingMatches.length,
    recentFinishedHomeMatches: snapshot.recentFinishedHomeMatches.length,
    finishedMatches: snapshot.finishedMatches.length
  }
}

if (require.main === module) {
  refreshLiveScoreSnapshot()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}

module.exports = { refreshLiveScoreSnapshot }
