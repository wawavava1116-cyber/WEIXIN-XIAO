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
  if (value > 0) return { type: 'up', icon: '↑' }
  if (value < 0) return { type: 'down', icon: '↓' }
  return { type: 'flat', icon: '－' }
}

function runnerMatchesText(runner, values) {
  const name = String(runner && runner.name || '').toLowerCase()
  return values.some((value) => {
    const text = String(value || '').toLowerCase()
    return text && name.indexOf(text) >= 0
  })
}

function buildOutcomeEntries(sample, match) {
  const runners = Array.isArray(sample && sample.runners) ? sample.runners : []
  const changes = sample && sample.changes && sample.changes.runners ? sample.changes.runners : {}
  const homeRunner = runners.find((runner) => runnerMatchesText(runner, [match.home.cn, match.home.en])) || runners[0]
  const drawRunner = runners.find((runner) => runnerMatchesText(runner, ['draw', 'tie', '平']))
  const awayRunner = runners.find((runner) => runnerMatchesText(runner, [match.away.cn, match.away.en])) ||
    runners.find((runner) => runner !== homeRunner && runner !== drawRunner)
  return [
    { key: 'home', label: '胜', runner: homeRunner },
    { key: 'draw', label: '平', runner: drawRunner },
    { key: 'away', label: '负', runner: awayRunner }
  ].map((entry, index) => {
    const runner = entry.runner || {}
    const runnerChange = changes[runner.selectionId] || {}
    const volumeDelta = Number(runnerChange.totalMatchedDelta || runnerChange.tradedVolumeDelta || 0)
    const oddsDelta = Number(runnerChange.priceDelta || 0)
    return {
      key: entry.key,
      label: entry.label,
      selectionId: runner.selectionId || '',
      name: runner.name || '',
      odds: formatOdds(runner.lastPriceTraded),
      separator: index < 2 ? '/' : '',
      probability: runner.probability || 0,
      volumeDelta,
      volumeText: `${formatAmountK(volumeDelta)}（${Math.round(runner.probability || 0)}%）`,
      volumeDirection: getDirection(volumeDelta),
      oddsDirection: getDirection(oddsDelta)
    }
  })
}

function buildBetfairRealtimeAnalysis(match, samples) {
  if (!Array.isArray(samples) || !samples.length) {
    return null
  }
  const latest = samples[samples.length - 1]
  const entries = buildOutcomeEntries(latest, match)
  const maxEntry = entries
    .slice()
    .sort((a, b) => Math.abs(b.volumeDelta) - Math.abs(a.volumeDelta))[0]
  if (!maxEntry || !maxEntry.selectionId) {
    return null
  }
  const hasEnoughHistory = samples.length >= 2
  const isVolumeUp = maxEntry.volumeDelta > 0
  let adjustmentText = hasEnoughHistory ? '变化仍偏中性，暂不明显调整打出预期和进球预期。' : ''
  let adjustmentLevel = 'neutral'
  if (hasEnoughHistory && isVolumeUp && maxEntry.oddsDirection.type === 'up') {
    adjustmentText = `${maxEntry.label}成交放大但赔率走高，降低该方向打出预期和进球数量预期。`
    adjustmentLevel = 'negative'
  } else if (hasEnoughHistory && isVolumeUp && maxEntry.oddsDirection.type === 'down') {
    adjustmentText = `${maxEntry.label}成交放大且赔率走低，提高该方向打出预期和进球数量预期。`
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
      wx.showToast({ title: '云端详情读取失败', icon: 'none' })
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
