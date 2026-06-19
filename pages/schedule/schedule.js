const { matches, finishedMatches } = require('../../utils/matches')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')

const ABBR = {
  Argentina: 'ARG',
  Australia: 'AUS',
  Austria: 'AUT',
  Belgium: 'BEL',
  'Bosnia and Herzegovina': 'BIH',
  Brazil: 'BRA',
  Canada: 'CAN',
  'Cabo Verde': 'CPV',
  Colombia: 'COL',
  'Congo DR': 'COD',
  "Cote d'Ivoire": 'CIV',
  Croatia: 'CRO',
  Curacao: 'CUW',
  Czechia: 'CZE',
  Ecuador: 'ECU',
  England: 'ENG',
  France: 'FRA',
  Germany: 'GER',
  Ghana: 'GHA',
  Haiti: 'HAI',
  Iran: 'IRN',
  Iraq: 'IRQ',
  Japan: 'JPN',
  Jordan: 'JOR',
  'Korea Republic': 'KOR',
  Mexico: 'MEX',
  Morocco: 'MAR',
  Netherlands: 'NED',
  'New Zealand': 'NZL',
  Norway: 'NOR',
  Panama: 'PAN',
  Paraguay: 'PAR',
  Portugal: 'POR',
  Qatar: 'QAT',
  'Saudi Arabia': 'KSA',
  Scotland: 'SCO',
  Senegal: 'SEN',
  'South Africa': 'RSA',
  Spain: 'ESP',
  Sweden: 'SWE',
  Switzerland: 'SUI',
  Tunisia: 'TUN',
  Uruguay: 'URU',
  Uzbekistan: 'UZB',
  'United States': 'USA'
}

const BRACKET_SEEDS = [
  ['A1', 'B2'], ['C1', 'D2'], ['E1', 'F2'], ['G1', 'H2'],
  ['I1', 'J2'], ['K1', 'L2'], ['A2', 'B1'], ['C2', 'D1'],
  ['E2', 'F1'], ['G2', 'H1'], ['I2', 'J1'], ['K2', 'L1'],
  ['A3', 'C3'], ['B3', 'D3'], ['E3', 'G3'], ['F3', 'H3']
]

function cloneMatch(match) {
  return Object.assign({}, match, {
    home: Object.assign({}, match.home),
    away: Object.assign({}, match.away),
    pick: match.pick ? Object.assign({}, match.pick) : match.pick
  })
}

function getAbbr(team) {
  if (!team) return ''
  return ABBR[team.en] || String(team.en || team.cn || '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()
}

function getMatchTimeValue(match) {
  if (typeof match.sortTime === 'number' && match.sortTime > 0) return match.sortTime
  return 0
}

function getGroupKey(groupName) {
  const match = String(groupName || '').match(/[A-L]/i)
  return match ? match[0].toUpperCase() : groupName
}

function getGroupNumber(groupName) {
  const key = getGroupKey(groupName)
  const code = key.charCodeAt(0)
  return code >= 65 && code <= 90 ? code - 64 : 99
}

function getSourceReviews() {
  const remoteDatabase = getRemoteDatabaseSync()
  return remoteDatabase && Array.isArray(remoteDatabase.finishedMatches) && remoteDatabase.finishedMatches.length
    ? remoteDatabase.finishedMatches
    : finishedMatches
}

function buildReviewMap(sourceMatches) {
  const sourceReviews = getSourceReviews()
  const result = sourceReviews.reduce((map, review) => {
    if (review.matchId) map[review.matchId] = review
    return map
  }, {})
  sourceMatches.forEach((match) => {
    if (match.matchStatus === 'finished' && match.liveScore) {
      result[match.id] = {
        matchId: match.id,
        score: match.liveScore,
        endedAtSort: match.sortTime || Date.now()
      }
    }
  })
  return result
}

function getScoreParts(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return parts
}

function makeEmptyStats(team, groupName) {
  return {
    key: team.key || team.cn,
    groupName,
    team,
    abbr: getAbbr(team),
    played: 0,
    win: 0,
    draw: 0,
    loss: 0,
    gf: 0,
    ga: 0,
    points: 0
  }
}

function applyScoreToRows(home, away, scoreParts) {
  if (!home || !away || !scoreParts) return
  const homeGoals = scoreParts[0]
  const awayGoals = scoreParts[1]
  home.played += 1
  away.played += 1
  home.gf += homeGoals
  home.ga += awayGoals
  away.gf += awayGoals
  away.ga += homeGoals
  if (homeGoals > awayGoals) {
    home.win += 1
    away.loss += 1
    home.points += 3
  } else if (homeGoals < awayGoals) {
    away.win += 1
    home.loss += 1
    away.points += 3
  } else {
    home.draw += 1
    away.draw += 1
    home.points += 1
    away.points += 1
  }
}

function buildStandings(sourceMatches, reviewMap) {
  const sourceReviews = getSourceReviews()
  const groups = {}
  const sourceIds = {}
  sourceMatches.forEach((match) => {
    sourceIds[match.id] = true
    const groupName = match.group || '未分组'
    if (!groups[groupName]) groups[groupName] = {}
    ;[match.home, match.away].forEach((team) => {
      const key = team.key || team.cn
      if (!groups[groupName][key]) groups[groupName][key] = makeEmptyStats(team, groupName)
    })
  })

  sourceMatches.forEach((match) => {
    const review = reviewMap[match.id]
    const scoreParts = review ? getScoreParts(review.score) : null
    if (!scoreParts) return
    const groupName = match.group || '未分组'
    const home = groups[groupName][match.home.key || match.home.cn]
    const away = groups[groupName][match.away.key || match.away.cn]
    applyScoreToRows(home, away, scoreParts)
  })

  sourceReviews.forEach((review) => {
    if (!review.matchId || sourceIds[review.matchId]) return
    const scoreParts = getScoreParts(review.score)
    if (!scoreParts) return
    const groupName = review.group || '未分组'
    if (!groups[groupName]) return
    const home = groups[groupName][review.homeTeam] || groups[groupName][review.home]
    const away = groups[groupName][review.awayTeam] || groups[groupName][review.away]
    applyScoreToRows(home, away, scoreParts)
  })

  return Object.keys(groups)
    .sort((a, b) => getGroupNumber(a) - getGroupNumber(b))
    .map((groupName) => {
      const table = Object.keys(groups[groupName]).map((key) => groups[groupName][key])
        .sort((a, b) => {
          const pointDiff = b.points - a.points
          if (pointDiff) return pointDiff
          const gdDiff = (b.gf - b.ga) - (a.gf - a.ga)
          if (gdDiff) return gdDiff
          const gfDiff = b.gf - a.gf
          if (gfDiff) return gfDiff
          return a.abbr.localeCompare(b.abbr)
        })
        .map((row, index) => Object.assign({}, row, {
          rank: index + 1,
          rankClass: index === 0 ? 'rank-one' : index === 1 ? 'rank-two' : index === 2 ? 'rank-three' : 'rank-four',
          record: `${row.win}/${row.draw}/${row.loss}`,
          goals: `${row.gf}/${row.ga}`
        }))
      return {
        key: getGroupKey(groupName),
        name: groupName,
        table
      }
    })
}

function isFinishedMatch(match, reviewMap) {
  return match.matchStatus === 'finished' || Boolean(reviewMap[match.id])
}

function buildGroupMatches(sourceMatches, groupName, reviewMap) {
  return sourceMatches
    .filter((match) => match.group === groupName && !isFinishedMatch(match, reviewMap))
    .sort((a, b) => getMatchTimeValue(a) - getMatchTimeValue(b))
    .map((match) => ({
      id: match.id,
      dateText: match.dateText,
      kickoff: match.kickoff,
      statusText: match.matchStatus === 'live' ? (match.statusText || match.phaseText || '进行中') : '',
      isLive: match.matchStatus === 'live',
      home: Object.assign({}, match.home, { abbr: getAbbr(match.home) }),
      away: Object.assign({}, match.away, { abbr: getAbbr(match.away) }),
      hasPrediction: Boolean(match.pick && match.pick.result)
    }))
}

function buildQualifiedTeams(groups) {
  const result = {}
  groups.forEach((group) => {
    const groupComplete = group.table.length && group.table.every((item) => item.played >= 3)
    if (!groupComplete) return
    group.table.slice(0, 3).forEach((row) => {
      const seed = `${group.key}${row.rank}`
      result[seed] = {
        seed,
        abbr: row.abbr,
        flag: row.team.flag,
        confirmed: true
      }
    })
  })
  return result
}

function makeBracketTeam(seed, qualifiedTeams) {
  return qualifiedTeams[seed] || {
    seed,
    abbr: seed,
    flag: '',
    confirmed: false
  }
}

function buildBracket(groups) {
  const qualifiedTeams = buildQualifiedTeams(groups)
  const ties = BRACKET_SEEDS.map((pair, index) => ({
    id: `r32-${index}`,
    home: makeBracketTeam(pair[0], qualifiedTeams),
    away: makeBracketTeam(pair[1], qualifiedTeams),
    score: '',
    extraScore: '',
    penaltyScore: '',
    winner: ''
  }))
  return {
    left: ties.slice(0, 8),
    right: ties.slice(8)
  }
}

function buildPageData(sourceMatches, selectedGroupKey) {
  const reviewMap = buildReviewMap(sourceMatches)
  const groups = buildStandings(sourceMatches, reviewMap)
  const selectedGroup = groups.find((group) => group.key === selectedGroupKey) || groups[0]
  return {
    groupTabs: groups.map((group) => ({
      key: group.key,
      name: group.name,
      active: selectedGroup && group.key === selectedGroup.key
    })),
    selectedGroup,
    groupMatches: selectedGroup ? buildGroupMatches(sourceMatches, selectedGroup.name, reviewMap) : [],
    bracket: buildBracket(groups)
  }
}

function getBaseMatches() {
  const remoteDatabase = getRemoteDatabaseSync()
  const sourceMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) && remoteDatabase.matches.length
    ? remoteDatabase.matches
    : matches
  return sourceMatches.map(cloneMatch)
}

Page({
  data: Object.assign({
    selectedGroupKey: 'A',
    isRefreshing: false,
    liveSyncText: '正在读取实时赛程'
  }, buildPageData(getBaseMatches(), 'A')),

  onLoad() {
    this.sourceMatches = getBaseMatches()
    refreshRemoteDatabase(null, () => this.refreshLiveSchedule())
    this.refreshLiveSchedule()
    this.scoreTimer = setInterval(() => {
      this.refreshLiveSchedule({ silent: true })
    }, 15000)
  },

  onShow() {
    refreshRemoteDatabase(null, () => this.refreshLiveSchedule({ silent: true }))
    this.refreshPage(this.data.selectedGroupKey || 'A')
  },

  onUnload() {
    if (this.scoreTimer) clearInterval(this.scoreTimer)
  },

  onPullDownRefresh() {
    this.refreshLiveSchedule({ manual: true })
  },

  refreshPage(groupKey) {
    const sourceMatches = this.sourceMatches && this.sourceMatches.length ? this.sourceMatches : getBaseMatches()
    this.setData(Object.assign({
      selectedGroupKey: groupKey
    }, buildPageData(sourceMatches, groupKey)))
  },

  refreshLiveSchedule(options = {}) {
    const sourceMatches = getBaseMatches()
    this.sourceMatches = sourceMatches
    if (!options.silent) {
      this.setData({
        isRefreshing: true,
        liveSyncText: '正在读取实时赛程'
      })
    }
    refreshLiveScores(sourceMatches, (liveMatches) => {
      this.sourceMatches = liveMatches
      this.setData(Object.assign({
        selectedGroupKey: this.data.selectedGroupKey || 'A'
      }, buildPageData(liveMatches, this.data.selectedGroupKey || 'A')))
    }, () => {
      if (options.manual) wx.stopPullDownRefresh()
      if (!options.silent) {
        this.setData({
          isRefreshing: false,
          liveSyncText: '实时赛程已更新'
        })
      }
    })
  },

  selectGroup(event) {
    const groupKey = event.currentTarget.dataset.group
    if (!groupKey) return
    this.refreshPage(groupKey)
  }
})
