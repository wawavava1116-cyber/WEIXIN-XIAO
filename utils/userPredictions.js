const { apiBaseUrl } = require('./serverConfig')
const { getStoredToken, getStoredUser } = require('./userAuth')

const STORAGE_KEY = 'worldcup_user_predictions'
const MAX_ITEMS = 80

function getApiBaseUrl() {
  return String(apiBaseUrl || '').replace(/\/$/, '')
}

function hasPredictionProfile() {
  const user = getStoredUser()
  return Boolean(user && user.mode === 'wechat' && user.nickname && user.hasProfile)
}

function requestPredictionApi(path, method, data) {
  return new Promise((resolve, reject) => {
    const baseUrl = getApiBaseUrl()
    const token = getStoredToken()
    if (!baseUrl) {
      reject(new Error('API_BASE_URL_MISSING'))
      return
    }
    if (!token) {
      reject(new Error('MISSING_TOKEN'))
      return
    }
    wx.request({
      url: `${baseUrl}${path}`,
      method,
      data: data || {},
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      timeout: 5000,
      success(response) {
        const result = response.data || {}
        if (response.statusCode >= 200 && response.statusCode < 300 && result.ok !== false) {
          resolve(result)
          return
        }
        reject(new Error(result.error || 'REQUEST_FAILED'))
      },
      fail: reject
    })
  })
}

function requestPublicPredictionApi(path, method, data) {
  return new Promise((resolve, reject) => {
    const baseUrl = getApiBaseUrl()
    const token = getStoredToken()
    if (!baseUrl) {
      reject(new Error('API_BASE_URL_MISSING'))
      return
    }
    const header = {
      'content-type': 'application/json'
    }
    if (token) header.Authorization = `Bearer ${token}`
    wx.request({
      url: `${baseUrl}${path}`,
      method,
      data: data || {},
      header,
      timeout: 5000,
      success(response) {
        const result = response.data || {}
        if (response.statusCode >= 200 && response.statusCode < 300 && result.ok !== false) {
          resolve(result)
          return
        }
        reject(new Error(result.error || 'REQUEST_FAILED'))
      },
      fail: reject
    })
  })
}

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

function submitPrediction(prediction) {
  if (!hasPredictionProfile()) return Promise.reject(new Error('PROFILE_REQUIRED'))
  return requestPredictionApi('/api/users/me/predictions', 'POST', prediction)
    .then((result) => {
      const saved = result.prediction ? savePrediction(result.prediction) : savePrediction(prediction)
      return Object.assign({}, result, { prediction: saved })
    })
}

function fetchPredictionDashboard() {
  if (!hasPredictionProfile()) return Promise.reject(new Error('PROFILE_REQUIRED'))
  return requestPredictionApi('/api/users/me/predictions', 'GET')
    .then((result) => {
      if (Array.isArray(result.predictions)) setPredictions(result.predictions)
      return result
    })
}

function createPredictionGroup(payload) {
  if (!hasPredictionProfile()) return Promise.reject(new Error('PROFILE_REQUIRED'))
  return requestPredictionApi('/api/prediction-groups', 'POST', payload)
}

function fetchPredictionGroup(groupId) {
  return requestPublicPredictionApi(`/api/prediction-groups/${encodeURIComponent(groupId)}`, 'GET')
}

function joinPredictionGroup(groupId) {
  if (!hasPredictionProfile()) return Promise.reject(new Error('PROFILE_REQUIRED'))
  return requestPredictionApi(`/api/prediction-groups/${encodeURIComponent(groupId)}/join`, 'POST')
}

function submitGroupPredictions(groupId, predictions) {
  if (!hasPredictionProfile()) return Promise.reject(new Error('PROFILE_REQUIRED'))
  return requestPredictionApi(`/api/prediction-groups/${encodeURIComponent(groupId)}/predictions`, 'POST', { predictions })
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
  createPredictionGroup,
  fetchPredictionDashboard,
  fetchPredictionGroup,
  getPrediction,
  getPredictions,
  hasPredictionProfile,
  joinPredictionGroup,
  savePrediction,
  submitGroupPredictions,
  submitPrediction
}
