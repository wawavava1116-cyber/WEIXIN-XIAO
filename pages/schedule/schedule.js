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
  ['1E', '3ABCDF'], ['1I', '3CDFGH'], ['2A', '2B'], ['1F', '2C'],
  ['2K', '2L'], ['1H', '2J'], ['1D', '3BEFIJ'], ['1G', '3AEHIJ'],
  ['1C', '2F'], ['2E', '2I'], ['1A', '3CEFHI'], ['1L', '3EHIJK'],
  ['1J', '2H'], ['2D', '2G'], ['1B', '3EFGIJ'], ['1K', '3DEIJL']
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
  return remoteDatabase && Array.isArray(remoteDatabase.finishedMatches)
    ? remoteDatabase.finishedMatches
    : []
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
      const reverseSeed = `${row.rank}${group.key}`
      result[seed] = {
        seed,
        abbr: row.abbr,
        flag: row.team.flag,
        confirmed: true
      }
      result[reverseSeed] = Object.assign({}, result[seed], { seed: reverseSeed })
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

function makeEmptyBracketTeam(seed) {
  return {
    seed,
    abbr: seed,
    flag: '',
    confirmed: false
  }
}

function makePendingWinner(seed) {
  return makeEmptyBracketTeam(seed)
}

function makeBracketTeamFromTeam(team, fallbackSeed) {
  if (!team) return makeEmptyBracketTeam(fallbackSeed)
  return {
    seed: team.key || team.cn || fallbackSeed,
    abbr: getAbbr(team) || fallbackSeed,
    flag: team.flag || '',
    confirmed: true
  }
}

function getBracketScoreParts(match) {
  const score = match && match.score ? match.score : ''
  return getScoreParts(score)
}

function getBracketWinner(match) {
  if (!match) return null
  if (match.winner === 'home' || match.winner === match.home.seed || match.winner === match.home.abbr) return match.home
  if (match.winner === 'away' || match.winner === match.away.seed || match.winner === match.away.abbr) return match.away
  const penaltyParts = getScoreParts(match.penaltyScore)
  if (penaltyParts) return penaltyParts[0] > penaltyParts[1] ? match.home : match.away
  const extraParts = getScoreParts(match.extraScore)
  if (extraParts && extraParts[0] !== extraParts[1]) return extraParts[0] > extraParts[1] ? match.home : match.away
  const scoreParts = getBracketScoreParts(match)
  if (scoreParts && scoreParts[0] !== scoreParts[1]) return scoreParts[0] > scoreParts[1] ? match.home : match.away
  return null
}

function getBracketLoser(match) {
  const winner = getBracketWinner(match)
  if (!winner) return null
  return winner.seed === match.home.seed ? match.away : match.home
}

function makeBracketMatch(id, home, away, source = {}) {
  const winner = getBracketWinner({ home, away, score: source.score || '', extraScore: source.extraScore || '', penaltyScore: source.penaltyScore || '', winner: source.winner || '' })
  return {
    id,
    home,
    away,
    score: source.score || '',
    extraScore: source.extraScore || '',
    penaltyScore: source.penaltyScore || '',
    winner: source.winner || '',
    winnerSeed: winner ? winner.seed : ''
  }
}

function getKnockoutRoundKey(match) {
  const text = [
    match.knockoutRound,
    match.round,
    match.stage,
    match.phase,
    match.group,
    match.title
  ].map((value) => String(value || '')).join(' ')
  if (/3\s*-\s*4|三四|季军/.test(text)) return 'third'
  if (/决赛|final/i.test(text)) return 'final'
  if (/32|三十二/.test(text)) return '32'
  if (/16|十六/.test(text)) return '16'
  if (/8|八强|1\/4|quarter/i.test(text)) return '8'
  if (/4|四强|半决赛|semi/i.test(text)) return '4'
  return ''
}

function buildKnockoutSourceMap(sourceMatches, reviewMap) {
  const result = { 32: [], 16: [], 8: [], 4: [], final: [], third: [] }
  sourceMatches.forEach((match) => {
    const roundKey = getKnockoutRoundKey(match)
    if (!roundKey) return
    const review = reviewMap[match.id] || match.review || {}
    result[roundKey].push({
      home: makeBracketTeamFromTeam(match.home, 'TBD'),
      away: makeBracketTeamFromTeam(match.away, 'TBD'),
      score: review.score || match.liveScore || '',
      extraScore: review.extraScore || match.extraScore || '',
      penaltyScore: review.penaltyScore || match.penaltyScore || '',
      winner: review.winner || match.winner || '',
      sortTime: match.sortTime || review.endedAtSort || 0
    })
  })
  Object.keys(result).forEach((key) => {
    result[key].sort((a, b) => (a.sortTime || 0) - (b.sortTime || 0))
  })
  return result
}

function mergeBracketSource(baseHome, baseAway, source) {
  if (!source) return { home: baseHome, away: baseAway, source: {} }
  return {
    home: source.home || baseHome,
    away: source.away || baseAway,
    source
  }
}

function buildNextRound(previousMatches, prefix, label, roundSources = []) {
  const matches = []
  for (let index = 0; index < previousMatches.length; index += 2) {
    const leftWinner = getBracketWinner(previousMatches[index])
    const rightWinner = getBracketWinner(previousMatches[index + 1])
    const homeSeed = `${label}${Math.floor(index / 2) + 1}A`
    const awaySeed = `${label}${Math.floor(index / 2) + 1}B`
    const sourceMerge = mergeBracketSource(
      leftWinner || makePendingWinner(homeSeed),
      rightWinner || makePendingWinner(awaySeed),
      roundSources[Math.floor(index / 2)]
    )
    matches.push(makeBracketMatch(
      `${prefix}-${Math.floor(index / 2)}`,
      sourceMerge.home,
      sourceMerge.away,
      sourceMerge.source
    ))
  }
  return matches
}

function buildThirdPlaceMatch(semis, source) {
  const sourceMerge = mergeBracketSource(
    getBracketLoser(semis[0]) || makePendingWinner('L-SF1'),
    getBracketLoser(semis[1]) || makePendingWinner('L-SF2'),
    source
  )
  return makeBracketMatch('third-place', sourceMerge.home, sourceMerge.away, sourceMerge.source)
}

function buildBracket(groups, sourceMatches, reviewMap) {
  const qualifiedTeams = buildQualifiedTeams(groups)
  const knockoutSources = buildKnockoutSourceMap(sourceMatches, reviewMap)
  const round32 = BRACKET_SEEDS.map((pair, index) => makeBracketMatch(
    `r32-${index}`,
    knockoutSources[32][index] ? knockoutSources[32][index].home : makeBracketTeam(pair[0], qualifiedTeams),
    knockoutSources[32][index] ? knockoutSources[32][index].away : makeBracketTeam(pair[1], qualifiedTeams),
    knockoutSources[32][index] || {}
  ))
  const round16 = buildNextRound(round32, 'r16', '16', knockoutSources[16])
  const quarters = buildNextRound(round16, 'qf', '8', knockoutSources[8])
  const semis = buildNextRound(quarters, 'sf', '4', knockoutSources[4])
  const finalMerge = mergeBracketSource(
    getBracketWinner(semis[0]) || makePendingWinner('F1'),
    getBracketWinner(semis[1]) || makePendingWinner('F2'),
    knockoutSources.final[0]
  )
  const finalMatch = makeBracketMatch('final', finalMerge.home, finalMerge.away, finalMerge.source)
  const thirdPlace = buildThirdPlaceMatch(semis, knockoutSources.third[0])
  return {
    leftRounds: [
      { key: 'l16', label: '16强', matches: round32.slice(0, 8) },
      { key: 'l8', label: '8强', matches: round16.slice(0, 4) },
      { key: 'l4', label: '4强', matches: quarters.slice(0, 2) },
      { key: 'l2', label: '2强', matches: semis.slice(0, 1) }
    ],
    rightRounds: [
      { key: 'r2', label: '2强', matches: semis.slice(1, 2) },
      { key: 'r4', label: '4强', matches: quarters.slice(2, 4) },
      { key: 'r8', label: '8强', matches: round16.slice(4, 8) },
      { key: 'r16', label: '16强', matches: round32.slice(8, 16) }
    ],
    final: finalMatch,
    thirdPlace
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
    bracket: buildBracket(groups, sourceMatches, reviewMap)
  }
}

function getBaseMatches() {
  const remoteDatabase = getRemoteDatabaseSync()
  const sourceMatches = remoteDatabase && Array.isArray(remoteDatabase.matches)
    ? remoteDatabase.matches
    : []
  return sourceMatches.map(cloneMatch)
}

Page({
  data: Object.assign({
    selectedGroupKey: 'A',
    isRefreshing: false,
    liveSyncText: '正在读取实时赛程'
  }, buildPageData(getBaseMatches(), 'A')),

  onLoad() {
    this.sourceMatches = []
    refreshRemoteDatabase(null, () => this.refreshLiveSchedule(), () => {
      wx.showToast({ title: '云端赛程读取失败', icon: 'none' })
    })
    this.scoreTimer = setInterval(() => {
      refreshRemoteDatabase(null, () => this.refreshLiveSchedule({ silent: true }), () => {})
    }, 10000)
  },

  onShow() {
    refreshRemoteDatabase(null, () => this.refreshLiveSchedule({ silent: true }), () => {})
  },

  onUnload() {
    if (this.scoreTimer) clearInterval(this.scoreTimer)
  },

  onPullDownRefresh() {
    refreshRemoteDatabase(null, () => this.refreshLiveSchedule({ manual: true }), () => {
      wx.stopPullDownRefresh()
      wx.showToast({ title: '云端赛程读取失败', icon: 'none' })
    })
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
