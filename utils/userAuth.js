const { apiBaseUrl } = require('./serverConfig')

const USER_TOKEN_KEY = 'worldcup_user_token'
const USER_INFO_KEY = 'worldcup_user_info'
const GUEST_ID_KEY = 'worldcup_guest_id'
const PROFILE_CHOICE_KEY = 'worldcup_profile_choice_done'
const REQUEST_TIMEOUT_MS = 15000
const UPLOAD_TIMEOUT_MS = 30000
const DEFAULT_WECHAT_NICKNAMES = {
  '微信用户': true,
  'WeChat User': true
}

function getApiBaseUrl() {
  return String(apiBaseUrl || '').replace(/\/$/, '')
}

function getStoredUser() {
  try {
    return wx.getStorageSync(USER_INFO_KEY) || null
  } catch (error) {
    return null
  }
}

function getStoredToken() {
  try {
    return wx.getStorageSync(USER_TOKEN_KEY) || ''
  } catch (error) {
    return ''
  }
}

function saveSession(payload) {
  const token = payload && payload.token ? payload.token : ''
  const user = payload && payload.user ? payload.user : null
  try {
    if (token) wx.setStorageSync(USER_TOKEN_KEY, token)
    if (user) wx.setStorageSync(USER_INFO_KEY, user)
  } catch (error) {
    // Storage failure should not block guest browsing.
  }
  return { token, user }
}

function getOrCreateGuestId() {
  try {
    const cached = wx.getStorageSync(GUEST_ID_KEY)
    if (cached) return cached
    const next = `guest_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
    wx.setStorageSync(GUEST_ID_KEY, next)
    return next
  } catch (error) {
    return `guest_${Date.now()}`
  }
}

function requestJson(path, data, token) {
  return new Promise((resolve, reject) => {
    const baseUrl = getApiBaseUrl()
    if (!baseUrl) {
      reject(new Error('API_BASE_URL_MISSING'))
      return
    }
    const header = { 'content-type': 'application/json' }
    if (token) header.Authorization = `Bearer ${token}`
    wx.request({
      url: `${baseUrl}${path}`,
      method: 'POST',
      data: data || {},
      header,
      timeout: REQUEST_TIMEOUT_MS,
      success(response) {
        const result = response.data || {}
        if (response.statusCode >= 200 && response.statusCode < 300 && result.ok !== false) {
          resolve(result)
          return
        }
        reject(new Error(result.error || `HTTP_${response.statusCode}`))
      },
      fail(error) {
        const message = error && error.errMsg ? error.errMsg : 'REQUEST_NETWORK_FAILED'
        reject(new Error(message))
      }
    })
  })
}

function createLocalGuestSession() {
  const user = {
    id: getOrCreateGuestId(),
    mode: 'guest',
    nickname: '游客用户',
    avatarUrl: '',
    hasProfile: false
  }
  try {
    wx.setStorageSync(USER_INFO_KEY, user)
  } catch (error) {
    // Local guest fallback should be best effort.
  }
  return Promise.resolve({ token: '', user })
}

function loginAsGuest() {
  const guestId = getOrCreateGuestId()
  return requestJson('/api/users/guest', { guestId })
    .then(saveSession)
    .catch(createLocalGuestSession)
}

function loginWithWechat() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(result) {
        if (!result.code) {
          reject(new Error('WX_LOGIN_NO_CODE'))
          return
        }
        loginWithWechatCode(result.code).then(resolve).catch(reject)
      },
      fail: reject
    })
  })
}

function loginWithWechatCode(code) {
  if (!code) return Promise.reject(new Error('WX_LOGIN_NO_CODE'))
  return requestJson('/api/auth/wechat-login', { code })
    .then(saveSession)
}

function ensureWechatSession() {
  const token = getStoredToken()
  const user = getStoredUser()
  if (token && user && user.mode === 'wechat') {
    return Promise.resolve({ token, user })
  }
  return loginWithWechat()
}

function isDefaultWechatProfile(userInfo) {
  const nickname = String(userInfo && userInfo.nickName ? userInfo.nickName : '').trim()
  return !nickname || DEFAULT_WECHAT_NICKNAMES[nickname]
}

function getWechatProfileFromUserInfo(userInfo) {
  if (!userInfo || isDefaultWechatProfile(userInfo)) {
    return null
  }
  return {
    nickname: String(userInfo.nickName || '').trim(),
    avatarUrl: userInfo.avatarUrl || ''
  }
}

function saveFunctionalWechatProfile(detail) {
  const profile = getWechatProfileFromUserInfo(detail && detail.userInfo)
  if (!profile) {
    return Promise.reject(new Error('WECHAT_PROFILE_SELECTION_REQUIRED'))
  }
  return loginWithWechatCode(detail && detail.code)
    .then(() => saveUserProfile(profile))
}

function saveUserProfile(profile) {
  const token = getStoredToken()
  if (!token) return Promise.reject(new Error('MISSING_TOKEN'))
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) return Promise.reject(new Error('API_BASE_URL_MISSING'))

  if (profile.avatarTempPath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${baseUrl}/api/users/me/profile`,
        filePath: profile.avatarTempPath,
        name: 'avatar',
        formData: {
          nickname: profile.nickname || '微信用户'
        },
        header: {
          Authorization: `Bearer ${token}`
        },
        timeout: UPLOAD_TIMEOUT_MS,
        success(response) {
          let result = {}
          try {
            result = JSON.parse(response.data || '{}')
          } catch (error) {
            reject(error)
            return
          }
          if (response.statusCode >= 200 && response.statusCode < 300 && result.ok !== false) {
            resolve(saveSession({ token, user: result.user }))
            return
          }
          reject(new Error(result.error || 'UPLOAD_FAILED'))
        },
        fail(error) {
          const message = error && error.errMsg ? error.errMsg : 'UPLOAD_NETWORK_FAILED'
          reject(new Error(message))
        }
      })
    })
  }

  return requestJson('/api/users/me/profile', {
    nickname: profile.nickname || '微信用户',
    avatarUrl: profile.avatarUrl || ''
  }, token).then((result) => saveSession({ token, user: result.user }))
}

function shouldAskProfileChoice() {
  try {
    if (wx.getStorageSync(PROFILE_CHOICE_KEY)) return false
    const user = getStoredUser()
    return !(user && user.hasProfile)
  } catch (error) {
    return true
  }
}

function markProfileChoiceDone() {
  try {
    wx.setStorageSync(PROFILE_CHOICE_KEY, Date.now())
  } catch (error) {
    // Choice cache failure should not block browsing.
  }
}

module.exports = {
  getStoredUser,
  getStoredToken,
  ensureWechatSession,
  loginAsGuest,
  loginWithWechat,
  loginWithWechatCode,
  saveFunctionalWechatProfile,
  saveUserProfile,
  shouldAskProfileChoice,
  markProfileChoiceDone
}
