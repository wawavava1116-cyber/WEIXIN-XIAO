const { upcomingMatches } = require('../../utils/matches')
const { getRemoteDatabaseBadge, getRemoteMatchesSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')

function getMatchTimeValue(match) {
  if (typeof match.sortTime === 'number' && match.sortTime > 0) return match.sortTime
  return 0
}

function buildPredictions() {
  return getRemoteMatchesSync('upcomingMatches', upcomingMatches).slice()
    .sort((a, b) => getMatchTimeValue(a) - getMatchTimeValue(b))
    .map((match) => ({
      id: match.id,
      dateText: match.dateText,
      kickoff: match.kickoff,
      home: match.home,
      away: match.away,
      pick: match.pick || {},
      risk: match.analysis && match.analysis.risk ? match.analysis.risk : ''
    }))
}

Page({
  data: {
    databaseBadge: getRemoteDatabaseBadge(),
    matches: buildPredictions()
  },

  onShow() {
    refreshRemoteDatabase(null, () => this.refreshPredictions())
    this.refreshPredictions()
  },

  refreshPredictions() {
    this.setData({
      databaseBadge: getRemoteDatabaseBadge(),
      matches: buildPredictions()
    })
  }
})
