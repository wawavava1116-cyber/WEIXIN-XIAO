const DYNAMIC_REVIEW_CACHE_KEY = 'worldcup_dynamic_finished_reviews'
const MAX_REVIEW_COUNT = 10

function canUseStorage() {
  return typeof wx !== 'undefined' && wx && wx.getStorageSync && wx.setStorageSync
}

function normalizeReviews(reviews, limit = MAX_REVIEW_COUNT) {
  const reviewMap = {}
  ;(reviews || []).forEach((review) => {
    if (!review || !review.matchId) return
    reviewMap[review.matchId] = review
  })
  const normalized = Object.keys(reviewMap)
    .map((key) => reviewMap[key])
    .sort((a, b) => (b.endedAtSort || b.endedAtMs || 0) - (a.endedAtSort || a.endedAtMs || 0))
  return limit ? normalized.slice(0, limit) : normalized
}

function getDynamicReviews() {
  if (!canUseStorage()) return []
  try {
    const cached = wx.getStorageSync(DYNAMIC_REVIEW_CACHE_KEY)
    return Array.isArray(cached) ? normalizeReviews(cached) : []
  } catch (error) {
    return []
  }
}

function saveDynamicReviews(reviews) {
  if (!canUseStorage()) return []
  const nextReviews = normalizeReviews((reviews || []).concat(getDynamicReviews()))
  try {
    wx.setStorageSync(DYNAMIC_REVIEW_CACHE_KEY, nextReviews)
  } catch (error) {
    // Local cache failure should not block live score rendering.
  }
  return nextReviews
}

function mergeReviewLists(staticReviews, dynamicReviews, limit = MAX_REVIEW_COUNT) {
  return normalizeReviews((dynamicReviews || []).concat(staticReviews || []), limit)
}

module.exports = {
  getDynamicReviews,
  saveDynamicReviews,
  mergeReviewLists
}
