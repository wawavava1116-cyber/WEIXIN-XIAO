const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(__dirname, '..', 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const AVATAR_DIR = path.join(DATA_DIR, 'avatars')

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function ensureAvatarDir() {
  fs.mkdirSync(AVATAR_DIR, { recursive: true })
}

function nowIso() {
  return new Date().toISOString()
}

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(16).toString('hex')}`
}

function safeText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function readUsersStore() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8')
    const store = JSON.parse(raw)
    return {
      users: store.users || {},
      tokenIndex: store.tokenIndex || {},
      openidIndex: store.openidIndex || {},
      guestIndex: store.guestIndex || {}
    }
  } catch (error) {
    return {
      users: {},
      tokenIndex: {},
      openidIndex: {},
      guestIndex: {}
    }
  }
}

function writeUsersStore(store) {
  ensureDataDir()
  const payload = {
    users: store.users || {},
    tokenIndex: store.tokenIndex || {},
    openidIndex: store.openidIndex || {},
    guestIndex: store.guestIndex || {},
    updatedAt: nowIso()
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(payload, null, 2))
  return payload
}

function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    mode: user.mode,
    nickname: user.nickname || '',
    avatarUrl: user.avatarUrl || '',
    hasProfile: Boolean(user.nickname),
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    lastProfileUpdateAt: user.lastProfileUpdateAt || ''
  }
}

function upsertGuest(guestId) {
  const store = readUsersStore()
  const stableGuestId = safeText(guestId, 80) || createId('local')
  const existingUserId = store.guestIndex[stableGuestId]
  const userId = existingUserId || createId('usr')
  const token = createId('tok')
  const current = store.users[userId] || {}
  const user = Object.assign({}, current, {
    id: userId,
    mode: 'guest',
    guestId: stableGuestId,
    nickname: current.nickname || '游客用户',
    avatarUrl: current.avatarUrl || '',
    token,
    createdAt: current.createdAt || nowIso(),
    lastLoginAt: nowIso()
  })
  store.users[userId] = user
  store.guestIndex[stableGuestId] = userId
  store.tokenIndex[token] = userId
  writeUsersStore(store)
  return { token, user: publicUser(user) }
}

function upsertWechatUser(sessionData) {
  const openid = safeText(sessionData && sessionData.openid, 120)
  if (!openid) throw new Error('MISSING_OPENID')

  const store = readUsersStore()
  const existingUserId = store.openidIndex[openid]
  const userId = existingUserId || createId('usr')
  const token = createId('tok')
  const current = store.users[userId] || {}
  const user = Object.assign({}, current, {
    id: userId,
    mode: 'wechat',
    openid,
    unionid: safeText(sessionData.unionid, 120) || current.unionid || '',
    token,
    createdAt: current.createdAt || nowIso(),
    lastLoginAt: nowIso()
  })
  store.users[userId] = user
  store.openidIndex[openid] = userId
  store.tokenIndex[token] = userId
  writeUsersStore(store)
  return { token, user: publicUser(user) }
}

function getUserByToken(token) {
  const cleanToken = safeText(token, 120)
  if (!cleanToken) return null
  const store = readUsersStore()
  const userId = store.tokenIndex[cleanToken]
  return userId ? store.users[userId] || null : null
}

function saveAvatar(userId, file) {
  if (!file || !file.buffer || !file.buffer.length) return ''
  ensureAvatarDir()
  const extMap = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
  }
  const ext = extMap[String(file.contentType || '').toLowerCase()] || path.extname(file.filename || '').toLowerCase() || '.jpg'
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].indexOf(ext) !== -1 ? ext : '.jpg'
  const filename = `${userId}_${Date.now()}_${crypto.randomBytes(5).toString('hex')}${safeExt}`
  fs.writeFileSync(path.join(AVATAR_DIR, filename), file.buffer)
  return `/api/users/avatars/${filename}`
}

function updateUserProfile(token, profile) {
  const store = readUsersStore()
  const userId = store.tokenIndex[safeText(token, 120)]
  const current = userId ? store.users[userId] : null
  if (!current) return null

  const next = Object.assign({}, current, {
    nickname: safeText(profile.nickname, 40) || current.nickname || '',
    avatarUrl: safeText(profile.avatarUrl, 300) || current.avatarUrl || '',
    mode: current.mode === 'guest' ? 'guest' : 'wechat',
    lastProfileUpdateAt: nowIso()
  })
  store.users[userId] = next
  writeUsersStore(store)
  return publicUser(next)
}

function getAvatarFile(filename) {
  const safeName = path.basename(String(filename || ''))
  const filePath = path.join(AVATAR_DIR, safeName)
  if (!safeName || !filePath.startsWith(AVATAR_DIR) || !fs.existsSync(filePath)) return null
  return filePath
}

module.exports = {
  AVATAR_DIR,
  readUsersStore,
  publicUser,
  upsertGuest,
  upsertWechatUser,
  getUserByToken,
  saveAvatar,
  updateUserProfile,
  getAvatarFile
}
