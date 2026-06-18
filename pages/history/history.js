const { matches, historyMatches, finishedMatches } = require('../../utils/matches')
const { getDatabaseBadge } = require('../../utils/buildInfo')
const { getDynamicReviews, mergeReviewLists } = require('../../utils/reviewCache')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')

const ALL_DATE_LABEL = '全部'

function buildHistoryMatch(review) {
  if (!review || !review.matchId) return null
  const remoteDatabase = getRemoteDatabaseSync()
  const remoteMatches = remoteDatabase && Array.isArray(remoteDatabase.matches) ? remoteDatabase.matches : []
  const remoteHistoryMatches = remoteDatabase && Array.isArray(remoteDatabase.historyMatches) ? remoteDatabase.historyMatches : []
  const sourceMatch = remoteMatches.find((item) => item.id === review.matchId) ||
    remoteHistoryMatches.find((item) => item.id === review.matchId) ||
    matches.find((item) => item.id === review.matchId) ||
    historyMatches.find((item) => item.id === review.matchId)
  const sourceReview = sourceMatch && sourceMatch.review ? sourceMatch.review : null
  const nextReview = { ...(sourceReview || {}), ...review }
  if (sourceMatch) {
    return {
      ...sourceMatch,
      dateText: nextReview.dateText || sourceMatch.dateText,
      kickoff: nextReview.kickoff || sourceMatch.kickoff,
      group: nextReview.group || sourceMatch.group,
      venue: nextReview.venue || sourceMatch.venue,
      review: nextReview
    }
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

function buildHistoryMatches() {
  const remoteDatabase = getRemoteDatabaseSync()
  const staticReviews = remoteDatabase && Array.isArray(remoteDatabase.finishedMatches) && remoteDatabase.finishedMatches.length
    ? remoteDatabase.finishedMatches.filter(Boolean)
    : finishedMatches.filter(Boolean)
  return mergeReviewLists(staticReviews, getDynamicReviews(), 0)
    .map(buildHistoryMatch)
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

const initialHistoryMatches = buildHistoryMatches()
const initialFilteredHistoryMatches = filterHistoryMatches(initialHistoryMatches, ALL_DATE_LABEL)

Page({
  data: {
    historyMatches: initialHistoryMatches,
    filteredHistoryMatches: initialFilteredHistoryMatches,
    historyDates: buildHistoryDates(initialHistoryMatches),
    historyDateIndex: 0,
    databaseBadge: getDatabaseBadge(),
    selectedHistoryDate: ALL_DATE_LABEL
  },

  onShow() {
    refreshRemoteDatabase(null, () => this.refreshHistoryMatches())
  },

  refreshHistoryMatches() {
    const historyMatches = buildHistoryMatches()
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
      selectedHistoryDate
    })
  },

  onHistoryDateChange(event) {
    const index = Number(event.detail.value)
    const selectedDate = this.data.historyDates[index] || ALL_DATE_LABEL
    const filteredHistoryMatches = filterHistoryMatches(this.data.historyMatches, selectedDate)
    this.setData({ historyDateIndex: index, selectedHistoryDate: selectedDate, filteredHistoryMatches })
  }
})
