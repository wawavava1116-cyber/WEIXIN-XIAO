const { historyMatches } = require('../../utils/matches')

Page({
  data: {
    historyMatches,
    filteredHistoryMatches: historyMatches,
    historyDates: ['全部'].concat(Array.from(new Set(historyMatches.map((item) => item.dateText)))),
    historyDateIndex: 0,
    selectedHistoryDate: '全部'
  },

  onHistoryDateChange(event) {
    const index = Number(event.detail.value)
    const selectedDate = this.data.historyDates[index] || '全部'
    const filteredHistoryMatches = selectedDate === '全部'
      ? this.data.historyMatches
      : this.data.historyMatches.filter((item) => item.dateText === selectedDate)
    this.setData({ historyDateIndex: index, selectedHistoryDate: selectedDate, filteredHistoryMatches })
  }
})
