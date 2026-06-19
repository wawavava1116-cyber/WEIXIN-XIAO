const STORAGE_KEY = 'worldcup_user_predictions'
const MAX_ITEMS = 80

function getPredictions() {
  try {
    const value = wx.getStorageSync(STORAGE_KEY)
    return Array.isArray(value) ? value : []
  } catch (error) {
    return []
  }
}

function setPredictions(items) {
  try {
    wx.setStorageSync(STORAGE_KEY, items.slice(0, MAX_ITEMS))
  } catch (error) {
    // Local prediction history is a convenience feature; failing to save should not block submit.
  }
}

function savePrediction(prediction) {
  const id = prediction.id || `user-prediction-${Date.now()}`
  const item = Object.assign({}, prediction, {
    id,
    createdAt: prediction.createdAt || Date.now()
  })
  const next = [item].concat(getPredictions().filter((oldItem) => oldItem.id !== id))
  setPredictions(next)
  return item
}

function getPrediction(id) {
  return getPredictions().find((item) => item.id === id) || null
}

function encodePrediction(prediction) {
  try {
    const compact = {
      i: prediction.id,
      d: prediction.dateText,
      k: prediction.kickoff,
      h: prediction.home,
      a: prediction.away,
      p: prediction.picks
    }
    return encodeURIComponent(JSON.stringify(compact))
  } catch (error) {
    return ''
  }
}

function decodePrediction(payload) {
  if (!payload) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(payload))
    if (parsed && parsed.p) {
      return {
        id: parsed.i,
        dateText: parsed.d,
        kickoff: parsed.k,
        home: parsed.h,
        away: parsed.a,
        picks: parsed.p
      }
    }
    return parsed
  } catch (error) {
    return null
  }
}

module.exports = {
  decodePrediction,
  encodePrediction,
  getPrediction,
  getPredictions,
  savePrediction
}
