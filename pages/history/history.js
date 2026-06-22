const { getRemoteDatabaseBadge, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')
const { createBackSwipeHandlers } = require('../../utils/swipeNavigation')

const ALL_DATE_LABEL = '\u5168\u90e8'

function buildHistoryMatch(review, remoteDatabase) {
  if (!review || !review.matchId) return null
  const remoteMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) ? remoteDatabase.matches : []
  const remoteHistoryMatches = remoteDatabase && Array.isArray(remoteDatabase.historyMatches) ? remoteDatabase.historyMatches : []
  const sourceMatch = remoteMatches.find((item) => item.id === review.matchId) ||
    remoteHistoryMatches.find((item) => item.id === review.matchId)
  const sourceReview = sourceMatch && sourceMatch.review ? sourceMatch.review : null
  const nextReview = Object.assign({}, sourceReview || {}, review)
  if (sourceMatch) {
    return Object.assign({}, sourceMatch, {
      dateText: nextReview.dateText || sourceMatch.dateText,
      kickoff: nextReview.kickoff || sourceMatch.kickoff,
      group: nextReview.group || sourceMatch.group,
      venue: nextReview.venue || sourceMatch.venue,
      review: nextReview
    })
  }
  return {
    id: review.matchId || review.id,
    dateText: review.dateText || '',
    kickoff: review.kickoff || '',
    group: review.group || '',
    venue: review.venue || '',
    home: { cn: review.home || '', en: '', flag: '' },
    away: { cn: review.away || '', en: '', flag: '' },
    pick: {
      result: review.resultMain || '',
      resultBackup: review.resultBackup || '',
      score: review.scoreMain || '',
      backup: review.scoreBackup || '',
      total: review.totalPick || ''
    },
    analysis: {},
    review: nextReview
  }
}

function buildHistoryMatches(remoteDatabase) {
  if (!remoteDatabase || !Array.isArray(remoteDatabase.finishedMatches)) {
    return []
  }
  return remoteDatabase.finishedMatches
    .filter(Boolean)
    .map((review) => buildHistoryMatch(review, remoteDatabase))
    .filter(Boolean)
}

function buildHistoryDates(items) {
  return [ALL_DATE_LABEL].concat(Array.from(new Set(items.map((item) => item.dateText).filter(Boolean))))
}

function filterHistoryMatches(items, selectedDate) {
  return selectedDate === ALL_DATE_LABEL
    ? items.slice(0, 10)
    : items.filter((item) => item.dateText === selectedDate)
}

Page(Object.assign({}, createBackSwipeHandlers(), {
  data: {
    historyMatches: [],
    filteredHistoryMatches: [],
    historyDates: [ALL_DATE_LABEL],
    historyDateIndex: 0,
    databaseBadge: '\u6b63\u5728\u8bfb\u53d6\u4e91\u7aef\u6570\u636e\u5e93',
    selectedHistoryDate: ALL_DATE_LABEL,
    isLoadingHistory: true,
    historyLoadFailed: false
  },

  onShow() {
    this.setData({
      historyMatches: [],
      filteredHistoryMatches: [],
      historyDates: [ALL_DATE_LABEL],
      historyDateIndex: 0,
      selectedHistoryDate: ALL_DATE_LABEL,
      databaseBadge: '\u6b63\u5728\u8bfb\u53d6\u4e91\u7aef\u6570\u636e\u5e93',
      isLoadingHistory: true,
      historyLoadFailed: false
    })
    refreshRemoteDatabase((remoteDatabase) => {
      this.refreshHistoryMatches(remoteDatabase)
    }, null, () => {
      this.setData({
        isLoadingHistory: false,
        historyLoadFailed: true,
        databaseBadge: '\u4e91\u7aef\u5386\u53f2\u8bfb\u53d6\u5931\u8d25'
      })
      wx.showToast({ title: '\u4e91\u7aef\u5386\u53f2\u8bfb\u53d6\u5931\u8d25', icon: 'none' })
    })
  },

  refreshHistoryMatches(remoteDatabase) {
    const nextDatabase = remoteDatabase
    if (!nextDatabase) {
      this.setData({ isLoadingHistory: false, historyLoadFailed: true })
      return
    }
    const historyMatches = buildHistoryMatches(nextDatabase)
    const historyDates = buildHistoryDates(historyMatches)
    let selectedHistoryDate = this.data.selectedHistoryDate || ALL_DATE_LABEL
    if (historyDates.indexOf(selectedHistoryDate) === -1) {
      selectedHistoryDate = ALL_DATE_LABEL
    }
    const historyDateIndex = Math.max(0, historyDates.indexOf(selectedHistoryDate))
    const filteredHistoryMatches = filterHistoryMatches(historyMatches, selectedHistoryDate)
    this.setData({
      historyMatches,
      filteredHistoryMatches,
      historyDates,
      historyDateIndex,
      selectedHistoryDate,
      databaseBadge: getRemoteDatabaseBadge(),
      isLoadingHistory: false,
      historyLoadFailed: false
    })
  },

  onHistoryDateChange(event) {
    const index = Number(event.detail.value)
    const selectedDate = this.data.historyDates[index] || ALL_DATE_LABEL
    const filteredHistoryMatches = filterHistoryMatches(this.data.historyMatches, selectedDate)
    this.setData({ historyDateIndex: index, selectedHistoryDate: selectedDate, filteredHistoryMatches })
  }
}))
