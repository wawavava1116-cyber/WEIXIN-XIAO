const { getFavoriteIds, toggleFavorite, decorateMatches } = require('../../utils/favorites')
const { getRemoteDatabaseSync, refreshRemoteDatabase } = require('../../utils/remoteMatchDatabase')

function getAllMatches() {
  const remoteDatabase = getRemoteDatabaseSync()
  const remoteMatches = remoteDatabase
    ? []
      .concat(remoteDatabase.matches || [])
      .concat(remoteDatabase.historyMatches || [])
      .concat(remoteDatabase.upcomingMatches || [])
      .concat(remoteDatabase.recentFinishedHomeMatches || [])
    : []
  const seen = {}
  return remoteMatches.filter((match) => {
    if (seen[match.id]) return false
    seen[match.id] = true
    return true
  })
}

function getFavoriteMatches() {
  const favoriteIds = getFavoriteIds()
  const decorated = decorateMatches(getAllMatches(), favoriteIds)
  return favoriteIds
    .map((id) => decorated.find((match) => match.id === id))
    .filter(Boolean)
}

Page({
  data: {
    favoriteMatches: []
  },

  onShow() {
    refreshRemoteDatabase(null, () => this.refreshFavorites(), () => {
      wx.showToast({ title: '云端收藏数据读取失败', icon: 'none' })
    })
  },

  refreshFavorites() {
    this.setData({ favoriteMatches: getFavoriteMatches() })
  },

  toggleFavorite(event) {
    const matchId = event.currentTarget.dataset.id
    if (!matchId) return
    toggleFavorite(matchId)
    this.refreshFavorites()
    wx.showToast({ title: '已取消关注', icon: 'none' })
  }
})
