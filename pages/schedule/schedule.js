const { upcomingMatches, recentFinishedHomeMatches } = require('../../utils/matches')
const { getDatabaseBadge } = require('../../utils/buildInfo')

function getMatchTimeValue(match) {
  if (typeof match.sortTime === 'number' && match.sortTime > 0) return match.sortTime
  return 0
}

function buildSchedule() {
  return upcomingMatches.concat(recentFinishedHomeMatches || [])
    .slice()
    .sort((a, b) => getMatchTimeValue(a) - getMatchTimeValue(b))
    .map((match) => ({
      id: match.id,
      dateText: match.dateText,
      kickoff: match.kickoff,
      group: match.group,
      venue: match.venue,
      statusText: match.statusText || '未开赛',
      home: match.home,
      away: match.away
    }))
}

Page({
  data: {
    databaseBadge: getDatabaseBadge(),
    matches: buildSchedule()
  },

  onShow() {
    this.setData({
      databaseBadge: getDatabaseBadge(),
      matches: buildSchedule()
    })
  }
})
