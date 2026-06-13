const FAVORITES_KEY = 'worldcup_favorite_match_ids'

function getFavoriteIds() {
  try {
    const ids = wx.getStorageSync(FAVORITES_KEY)
    return Array.isArray(ids) ? ids : []
  } catch (error) {
    return []
  }
}

function setFavoriteIds(ids) {
  try {
    wx.setStorageSync(FAVORITES_KEY, ids)
  } catch (error) {
    // Favorite state is local convenience; render should continue if storage fails.
  }
}

function isFavorite(matchId, favoriteIds = getFavoriteIds()) {
  return favoriteIds.indexOf(matchId) !== -1
}

function toggleFavorite(matchId) {
  const ids = getFavoriteIds()
  const exists = ids.indexOf(matchId) !== -1
  const nextIds = exists ? ids.filter((id) => id !== matchId) : [matchId].concat(ids)
  setFavoriteIds(nextIds)
  return nextIds
}

function decorateMatches(matches, favoriteIds = getFavoriteIds()) {
  return matches.map((match) => ({
    ...match,
    isFavorite: isFavorite(match.id, favoriteIds)
  }))
}

function sortFavoritesFirst(matches) {
  return matches.slice().sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
    return 0
  })
}

module.exports = {
  getFavoriteIds,
  toggleFavorite,
  decorateMatches,
  sortFavoritesFirst
}
