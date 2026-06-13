const { matches, historyMatches } = require('../../utils/matches')
const { getFavoriteIds, toggleFavorite, decorateMatches } = require('../../utils/favorites')

function getAllMatches() {
  const seen = {}
  return matches.concat(historyMatches).filter((match) => {
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
    this.refreshFavorites()
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
