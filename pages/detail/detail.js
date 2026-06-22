const { refreshTeamStats } = require('../../utils/liveTeamStats')
const { refreshLiveScores } = require('../../utils/liveMatchScores')
const { getDynamicReviews } = require('../../utils/reviewCache')
const { refreshBetfairHistory } = require('../../utils/remoteBetfairMarkets')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { createBackSwipeHandlers } = require('../../utils/swipeNavigation')

const BETFAIR_HISTORY_REFRESH_MS = 5 * 60 * 1000

function formatAmountK(value) {
  const amount = Math.abs(Number(value) || 0)
  if (amount >= 1000) return `${Math.round(amount / 1000)}K`
  return `${Math.round(amount)}`
}

function formatOdds(value) {
  const odds = Number(value)
  if (!odds) return '--'
  return odds >= 10 ? odds.toFixed(1) : odds.toFixed(2).replace(/0$/, '').replace(/\.0$/, '')
}

function getDirection(delta) {
  const value = Number(delta) || 0
  if (value > 0) return { type: 'up', icon: '\u2191' }
  if (value < 0) return { type: 'down', icon: '\u2193' }
  return { type: 'flat', icon: '-' }
}

function runnerMatchesText(runner, values) {
  const name = String(runner && runner.name || '').toLowerCase()
  return values.some((value) => {
    const text = String(value || '').toLowerCase()
    return text && name.indexOf(text) >= 0
  })
}

function getRunnerChange(sample, runner, previousSample) {
  if (!runner) return {}
  const changes = sample && sample.changes && sample.changes.runners ? sample.changes.runners : {}
  const directChange = changes[runner.selectionId]
  if (directChange) return directChange
  const previousRunners = Array.isArray(previousSample && previousSample.runners) ? previousSample.runners : []
  const previousRunner = previousRunners.find((item) => {
    if (!item) return false
    if (runner.selectionId && item.selectionId === runner.selectionId) return true
    return item.name && runner.name && item.name === runner.name
  }) || {}
  const latestOdds = Number(runner.lastPriceTraded || 0)
  const previousOdds = Number(previousRunner.lastPriceTraded || 0)
  return {
    priceDelta: latestOdds && previousOdds ? Number((latestOdds - previousOdds).toFixed(3)) : 0,
    probabilityDelta: Number(((runner.probability || 0) - (previousRunner.probability || 0)).toFixed(1)),
    totalMatchedDelta: Number(((runner.totalMatched || 0) - (previousRunner.totalMatched || 0)).toFixed(2)),
    tradedVolumeDelta: Number(((runner.tradedVolume || 0) - (previousRunner.tradedVolume || 0)).toFixed(2))
  }
}

function buildOutcomeEntries(sample, previousSample, match) {
  const runners = Array.isArray(sample && sample.runners) ? sample.runners : []
  const marketDelta = Number(sample && sample.changes && sample.changes.totalMatchedDelta || 0)
  const homeRunner = runners.find((runner) => runnerMatchesText(runner, [match.home.cn, match.home.en])) || runners[0]
  const drawRunner = runners.find((runner) => runnerMatchesText(runner, ['draw', 'tie', '\u5e73']))
  const awayRunner = runners.find((runner) => runnerMatchesText(runner, [match.away.cn, match.away.en])) ||
    runners.find((runner) => runner !== homeRunner && runner !== drawRunner)
  return [
    { key: 'home', label: '\u80dc', runner: homeRunner },
    { key: 'draw', label: '\u5e73', runner: drawRunner },
    { key: 'away', label: '\u8d1f', runner: awayRunner }
  ].map((entry, index) => {
    const runner = entry.runner || {}
    const runnerChange = getRunnerChange(sample, runner, previousSample)
    const volumeDelta = Number(runnerChange.totalMatchedDelta || runnerChange.tradedVolumeDelta || 0)
    const displayDelta = volumeDelta || marketDelta
    const oddsDelta = Number(runnerChange.priceDelta || 0)
    return {
      key: entry.key,
      label: entry.label,
      selectionId: runner.selectionId || '',
      name: runner.name || '',
      odds: formatOdds(runner.lastPriceTraded),
      separator: index < 2 ? '/' : '',
      probability: runner.probability || 0,
      probabilityDelta: Number(runnerChange.probabilityDelta || 0),
      volumeDelta,
      marketDelta,
      displayDelta,
      volumeText: `${formatAmountK(displayDelta)}\uFF08${Math.round(runner.probability || 0)}%\uFF09`,
      volumeDirection: getDirection(displayDelta),
      oddsDirection: getDirection(oddsDelta),
      oddsDelta
    }
  })
}

function buildBetfairRealtimeAnalysis(match, samples) {
  if (!Array.isArray(samples) || !samples.length) {
    return null
  }
  const previous = samples.length >= 2 ? samples[samples.length - 2] : null
  const latest = samples[samples.length - 1]
  const entries = buildOutcomeEntries(latest, previous, match)
  const maxEntry = entries
    .slice()
    .sort((a, b) => {
      const bScore = Math.abs(b.volumeDelta) || Math.abs(b.probabilityDelta) || Math.abs(b.oddsDelta) || Math.abs(b.displayDelta)
      const aScore = Math.abs(a.volumeDelta) || Math.abs(a.probabilityDelta) || Math.abs(a.oddsDelta) || Math.abs(a.displayDelta)
      return bScore - aScore
    })[0]
  if (!maxEntry || !maxEntry.selectionId) {
    return null
  }
  const hasEnoughHistory = samples.length >= 2
  const isVolumeUp = maxEntry.displayDelta > 0
  let adjustmentText = hasEnoughHistory ? '\u53D8\u5316\u4ECD\u504F\u4E2D\u6027\uFF0C\u6682\u4E0D\u660E\u663E\u8C03\u6574\u6253\u51FA\u9884\u671F\u548C\u8FDB\u7403\u9884\u671F\u3002' : ''
  let adjustmentLevel = 'neutral'
  if (hasEnoughHistory && isVolumeUp && maxEntry.oddsDirection.type === 'up') {
    adjustmentText = `${maxEntry.label}\u6210\u4EA4\u653E\u5927\u4F46\u8D54\u7387\u8D70\u9AD8\uFF0C\u964D\u4F4E\u8BE5\u65B9\u5411\u6253\u51FA\u9884\u671F\u548C\u8FDB\u7403\u6570\u91CF\u9884\u671F\u3002`
    adjustmentLevel = 'negative'
  } else if (hasEnoughHistory && isVolumeUp && maxEntry.oddsDirection.type === 'down') {
    adjustmentText = `${maxEntry.label}\u6210\u4EA4\u653E\u5927\u4E14\u8D54\u7387\u8D70\u4F4E\uFF0C\u63D0\u9AD8\u8BE5\u65B9\u5411\u6253\u51FA\u9884\u671F\u548C\u8FDB\u7403\u6570\u91CF\u9884\u671F\u3002`
    adjustmentLevel = 'positive'
  }
  return {
    updatedAt: latest.recordedAt || '',
    maxEntry,
    oddsEntries: entries,
    oddsLine: entries.map((entry) => entry.odds).join('/'),
    adjustmentText,
    hasAdjustment: Boolean(adjustmentText),
    adjustmentLevel
  }
}
function buildDynamicHistoryMatch(review) {
  if (!review || !review.matchId) return null
  const remoteDatabase = getRemoteDatabaseSync()
  const remoteMatches = remoteDatabase
    ? []
      .concat(remoteDatabase.matches || [])
      .concat(remoteDatabase.historyMatches || [])
      .concat(remoteDatabase.upcomingMatches || [])
      .concat(remoteDatabase.recentFinishedHomeMatches || [])
    : []
  const sourceMatch = remoteMatches.find((item) => item.id === review.matchId)
  if (sourceMatch) {
    return Object.assign({}, sourceMatch, {
      dateText: review.dateText || sourceMatch.dateText,
      kickoff: review.kickoff || sourceMatch.kickoff,
      group: review.group || sourceMatch.group,
      venue: review.venue || sourceMatch.venue,
      isFinished: true,
      matchStatus: 'finished',
      statusText: '\u5b8c\u8d5b',
      liveScore: review.score,
      review: Object.assign({}, sourceMatch.review || {}, review)
    })
  }
  const analysis = {
    conclusion: '\u8be5\u573a\u6bd4\u8d5b\u6765\u81ea\u5b9e\u65f6\u5b8c\u8d5b\u590d\u76d8\u7f13\u5b58\uff0c\u6570\u636e\u5e93\u6b63\u5f0f\u590d\u76d8\u66f4\u65b0\u540e\u4f1a\u663e\u793a\u5b8c\u6574\u5206\u6790\u3002',
    market: { oneXtwo: '', handicap: '', total: '' },
    form: { home: '', away: '' },
    news: { home: '', away: '' },
    tactics: '',
    h2h: '',
    order: '',
    risk: ''
  }
  return {
    id: review.matchId,
    dateText: review.dateText || '',
    kickoff: review.kickoff || '',
    group: review.group || '',
    venue: review.venue || '',
    weatherIcon: '',
    weather: '',
    altitude: '',
    altitudeLevel: 'unknown',
    isFinished: true,
    matchStatus: 'finished',
    statusText: '\u5b8c\u8d5b',
    liveScore: review.score,
    home: { cn: review.home || '', en: '', flag: '' },
    away: { cn: review.away || '', en: '', flag: '' },
    pick: {
      result: review.resultMain || '',
      resultBackup: review.resultBackup || '',
      score: review.scoreMain || '',
      backup: review.scoreBackup || '',
      total: review.totalPick || ''
    },
    analysis,
    review
  }
}

function getScorePanel(match) {
  const isFinished = Boolean(match.review || match.isFinished || match.matchStatus === 'finished')
  const isLive = match.matchStatus === 'live'
  const predictedScore = match.pick && match.pick.score ? match.pick.score : '--'

  if (isFinished) {
    return {
      mode: 'finished',
      eyebrow: '\u5b8c\u8d5b\u6bd4\u5206',
      score: (match.review && match.review.score) || match.liveScore || '--',
      subLabel: '\u9884\u6d4b\u6bd4\u5206',
      subScore: predictedScore
    }
  }

  if (isLive) {
    return {
      mode: 'live',
      eyebrow: match.matchClock || match.phaseText || '\u8fdb\u884c\u4e2d',
      score: match.liveScore || '--',
      subLabel: '\u9884\u6d4b\u6bd4\u5206',
      subScore: predictedScore
    }
  }

  return {
    mode: 'pending',
    eyebrow: '\u9884\u6d4b\u6bd4\u5206',
    score: predictedScore,
    subLabel: '\u5907\u7528\u6bd4\u5206',
    subScore: (match.pick && match.pick.backup) || '--'
  }
}

Page(Object.assign({}, createBackSwipeHandlers(), {
  data: {
    match: null,
    scorePanel: null
  },

  onLoad(options) {
    this.loadOptions = options || {}
    refreshRemoteDatabase(null, () => this.loadMatch(this.loadOptions, true), () => {
      wx.showToast({ title: '\u4e91\u7aef\u8be6\u60c5\u8bfb\u53d6\u5931\u8d25', icon: 'none' })
    })
    this.scoreTimer = setInterval(() => {
      this.refreshScore()
    }, 10000)
    this.betfairTimer = setInterval(() => {
      this.refreshBetfairRealtime()
    }, BETFAIR_HISTORY_REFRESH_MS)
  },

  onUnload() {
    if (this.scoreTimer) {
      clearInterval(this.scoreTimer)
      this.scoreTimer = null
    }
    if (this.betfairTimer) {
      clearInterval(this.betfairTimer)
      this.betfairTimer = null
    }
  },

  loadMatch(options, remoteReady) {
    const remoteDatabase = getRemoteDatabaseSync()
    const remoteMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) ? remoteDatabase.matches : []
    const remoteHistoryMatches = remoteDatabase && Array.isArray(remoteDatabase.historyMatches) ? remoteDatabase.historyMatches : []
    const primaryMatches = options.source === 'history'
      ? remoteHistoryMatches
      : remoteMatches
    const alternateRemoteMatches = options.source === 'history'
      ? remoteMatches
      : remoteHistoryMatches
    const dynamicReview = getDynamicReviews().find((item) => item.matchId === options.id || item.id === options.id)
    const baseMatch = primaryMatches.find((item) => item.id === options.id) ||
      alternateRemoteMatches.find((item) => item.id === options.id)
    const dynamicMatch = dynamicReview ? buildDynamicHistoryMatch(dynamicReview) : null
    const match = options.source === 'history' && dynamicMatch ? dynamicMatch : (baseMatch || dynamicMatch)
    if (!match) {
      if (remoteReady) wx.showToast({ title: '\u672a\u627e\u5230\u6bd4\u8d5b', icon: 'none' })
      return
    }
    wx.setNavigationBarTitle({
      title: `${match.home.cn} vs ${match.away.cn}`
    })
    this.setMatch(match)
    this.refreshBetfairRealtime(match)
    refreshTeamStats([match], (updatedMatches) => {
      this.setMatch(updatedMatches[0])
    })
    this.refreshScore()
  },

  setMatch(match) {
    const currentMatch = this.data.match
    if (currentMatch && currentMatch.id === match.id &&
      currentMatch.analysis && currentMatch.analysis.betfairRealtime &&
      match.analysis && !match.analysis.betfairRealtime) {
      match = Object.assign({}, match, {
        analysis: Object.assign({}, match.analysis, {
          betfairRealtime: currentMatch.analysis.betfairRealtime
        })
      })
    }
    this.setData({
      match,
      scorePanel: getScorePanel(match)
    })
  },

  refreshBetfairRealtime(match) {
    const targetMatch = match || this.data.match
    if (!targetMatch || targetMatch.review || targetMatch.matchStatus === 'finished') return
    refreshBetfairHistory(targetMatch.id, (samples) => {
      const betfairRealtime = buildBetfairRealtimeAnalysis(targetMatch, samples)
      if (!betfairRealtime) return
      const currentMatch = this.data.match
      if (!currentMatch || currentMatch.id !== targetMatch.id) return
      this.setMatch(Object.assign({}, currentMatch, {
        analysis: Object.assign({}, currentMatch.analysis || {}, {
          betfairRealtime
        })
      }))
    })
  },

  refreshScore() {
    if (!this.data.match || this.data.match.review) return
    refreshLiveScores([this.data.match], (updatedMatches) => {
      this.setMatch(updatedMatches[0])
    })
  }
}))
