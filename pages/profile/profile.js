const {
  ensureWechatSession,
  getStoredUser,
  markProfileChoiceDone,
  saveUserProfile
} = require('../../utils/userAuth')
const { fetchPredictionDashboard, hasPredictionProfile } = require('../../utils/userPredictions')

function getProfile() {
  const user = getStoredUser() || {}
  const isWechat = user.mode === 'wechat'
  return {
    nickname: user.nickname || '游客用户',
    avatarUrl: user.avatarUrl || '',
    modeText: isWechat ? '微信用户' : '游客用户',
    statusText: isWechat
      ? '已建立微信用户档案。头像和昵称可随时点击修改。'
      : '当前为游客用户，登录后会自动建立用户档案。',
    hasProfile: Boolean(isWechat),
    canLogin: !isWechat,
    canEditProfile: isWechat
  }
}

Page({
  data: {
    profile: getProfile(),
    medals: { gold: 0, silver: 0, bronze: 0 },
    showProfileForm: false,
    profileNickname: '',
    savingProfile: false
  },

  onShow() {
    this.refreshProfile()
  },

  refreshProfile() {
    this.setData({ profile: getProfile() })
    if (!hasPredictionProfile()) {
      this.setData({ medals: { gold: 0, silver: 0, bronze: 0 } })
      return
    }
    fetchPredictionDashboard().then((result) => {
      this.setData({ medals: result.medals || { gold: 0, silver: 0, bronze: 0 } })
    }).catch(() => {})
  },

  oneTapWechatLogin() {
    this.setData({ savingProfile: true })
    wx.showLoading({ title: '正在登录' })
    ensureWechatSession()
      .then(() => {
        markProfileChoiceDone()
        wx.hideLoading()
        this.setData({ savingProfile: false })
        this.refreshProfile()
        wx.showToast({ title: '登录成功', icon: 'success' })
      })
      .catch((error) => {
        wx.hideLoading()
        this.setData({ savingProfile: false })
        const message = error && error.message ? error.message : '登录失败'
        wx.showToast({ title: message.slice(0, 28), icon: 'none' })
      })
  },

  showManualProfileForm() {
    const user = getStoredUser() || {}
    if (user.mode !== 'wechat') {
      this.oneTapWechatLogin()
      return
    }
    this.setData({
      savingProfile: false,
      profile: getProfile(),
      showProfileForm: true,
      profileNickname: user.nickname || ''
    })
  },

  onProfileNicknameInput(event) {
    this.setData({
      profileNickname: event.detail.value || ''
    })
  },

  onChooseAvatar(event) {
    const avatarTempPath = event.detail && event.detail.avatarUrl
    if (!avatarTempPath) return
    this.setData({ savingProfile: true })
    wx.showLoading({ title: '正在保存' })
    ensureWechatSession()
      .then(() => {
        const user = getStoredUser() || {}
        return saveUserProfile({
          nickname: user.nickname || '',
          avatarTempPath
        })
      })
      .then(() => {
        markProfileChoiceDone()
        wx.hideLoading()
        this.setData({ savingProfile: false })
        this.refreshProfile()
        wx.showToast({ title: '头像已保存', icon: 'success' })
      })
      .catch((error) => {
        wx.hideLoading()
        this.setData({ savingProfile: false })
        const message = error && error.message ? error.message : '头像保存失败'
        wx.showToast({ title: message.slice(0, 28), icon: 'none' })
      })
  },

  saveWechatProfile() {
    const nickname = String(this.data.profileNickname || '').trim()
    if (!nickname) {
      wx.showToast({ title: '请先选择或输入昵称', icon: 'none' })
      return
    }
    this.setData({ savingProfile: true })
    wx.showLoading({ title: '正在保存' })
    ensureWechatSession()
      .then(() => saveUserProfile({ nickname }))
      .then(() => {
        markProfileChoiceDone()
        wx.hideLoading()
        this.setData({
          showProfileForm: false,
          profileNickname: '',
          savingProfile: false
        })
        this.refreshProfile()
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch((error) => {
        wx.hideLoading()
        this.setData({ savingProfile: false })
        const message = error && error.message ? error.message : '保存失败'
        wx.showToast({ title: message.slice(0, 28), icon: 'none' })
      })
  }
})
