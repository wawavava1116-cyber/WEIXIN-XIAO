const { normalizeRequestError, requestServerApi } = require('./remoteApi')

const USER_TOKEN_KEY = 'worldcup_user_token'
const USER_INFO_KEY = 'worldcup_user_info'
const GUEST_ID_KEY = 'worldcup_guest_id'
const PROFILE_CHOICE_KEY = 'worldcup_profile_choice_done'
const REQUEST_TIMEOUT_MS = 15000
const UPLOAD_TIMEOUT_MS = 30000

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
  return requestServerApi({
    path,
    method: 'POST',
    data,
    token,
    timeout: REQUEST_TIMEOUT_MS
  })
}

function getAvatarMime(filePath) {
  const lower = String(filePath || '').toLowerCase()
  if (lower.indexOf('.png') >= 0) return 'image/png'
  if (lower.indexOf('.webp') >= 0) return 'image/webp'
  return 'image/jpeg'
}

function readFileBase64(filePath) {
  return new Promise((resolve, reject) => {
    if (!filePath || !wx.getFileSystemManager) {
      reject(new Error('AVATAR_FILE_MISSING'))
      return
    }
    wx.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success(result) {
        resolve(result.data || '')
      },
      fail(error) {
        reject(new Error(error && error.errMsg ? normalizeRequestError(error.errMsg) : 'AVATAR_READ_FAILED'))
      }
    })
  })
}

function compressAvatar(filePath) {
  return new Promise((resolve) => {
    if (!filePath || !wx.compressImage) {
      resolve(filePath)
      return
    }
    wx.compressImage({
      src: filePath,
      quality: 72,
      success(result) {
        resolve(result.tempFilePath || filePath)
      },
      fail() {
        resolve(filePath)
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
      fail(error) {
        reject(new Error(error && error.errMsg ? normalizeRequestError(error.errMsg) : 'WX_LOGIN_FAILED'))
      }
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

function saveUserProfile(profile) {
  const token = getStoredToken()
  if (!token) return Promise.reject(new Error('MISSING_TOKEN'))

  if (profile.avatarTempPath) {
    return compressAvatar(profile.avatarTempPath)
      .then((filePath) => readFileBase64(filePath).then((avatarData) => ({ filePath, avatarData })))
      .then((avatar) => requestServerApi({
        path: '/api/users/me/profile',
        method: 'POST',
        token,
        timeout: UPLOAD_TIMEOUT_MS,
        data: {
          nickname: profile.nickname || '',
          avatarData: avatar.avatarData,
          avatarMime: getAvatarMime(avatar.filePath)
        }
      }))
      .then((result) => saveSession({ token, user: result.user }))
  }

  return requestJson('/api/users/me/profile', {
    nickname: profile.nickname || '',
    avatarUrl: profile.avatarUrl || ''
  }, token).then((result) => saveSession({ token, user: result.user }))
}

function shouldAskProfileChoice() {
  try {
    if (wx.getStorageSync(PROFILE_CHOICE_KEY)) return false
    const user = getStoredUser()
    return !(user && user.mode === 'wechat')
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
  saveUserProfile,
  shouldAskProfileChoice,
  markProfileChoiceDone
}
