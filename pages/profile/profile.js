const {
  ensureWechatSession,
  getStoredUser,
  markProfileChoiceDone,
  saveFunctionalWechatProfile,
  saveUserProfile
} = require('../../utils/userAuth')
const { fetchPredictionDashboard, hasPredictionProfile } = require('../../utils/userPredictions')

function getProfile() {
  const user = getStoredUser() || {}
  return {
    nickname: user.nickname || '游客用户',
    avatarUrl: user.avatarUrl || '',
    modeText: user.mode === 'wechat' ? '微信用户' : '游客用户',
    hasProfile: Boolean(user.hasProfile),
    canCompleteProfile: user.mode !== 'wechat' || !user.hasProfile
  }
}

Page({
  data: {
    profile: getProfile(),
    medals: { gold: 0, silver: 0, bronze: 0 },
    showProfileForm: false,
    wechatProfileArgs: { withCredentials: true, lang: 'zh_CN', timeout: 15000 },
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

  onWechatProfileSuccess(event) {
    if (this.data.savingProfile) return
    this.setData({ savingProfile: true })
    wx.showLoading({ title: '正在保存' })
    saveFunctionalWechatProfile(event.detail || {})
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
        const message = error && error.message ? error.message : ''
        if (message && message !== 'WECHAT_PROFILE_SELECTION_REQUIRED' && !message.includes('getUserProfile:fail')) {
          wx.showToast({ title: message.slice(0, 28), icon: 'none' })
        }
        this.showManualProfileForm()
      })
  },

  onWechatProfileFail(event) {
    const message = event && event.detail && event.detail.errMsg ? event.detail.errMsg : ''
    if (message && !message.includes('cancel')) {
      wx.showToast({ title: message.slice(0, 28), icon: 'none' })
    }
    this.showManualProfileForm()
  },

  onWechatProfileCancel() {
    this.showManualProfileForm()
  },

  showManualProfileForm() {
    const user = getStoredUser() || {}
    this.setData({
      savingProfile: false,
      profile: getProfile(),
      showProfileForm: true,
      profileNickname: user.nickname && user.nickname !== '游客用户' ? user.nickname : ''
    })
  },

  onProfileNicknameInput(event) {
    this.setData({
      profileNickname: event.detail.value || ''
    })
  },

  saveWechatProfile() {
    const nickname = String(this.data.profileNickname || '').trim()
    if (!nickname) {
      wx.showToast({ title: '请先选择或填写微信名', icon: 'none' })
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
        const message = error && error.message ? error.message : '请检查域名或微信配置'
        wx.showToast({ title: message.slice(0, 28), icon: 'none' })
      })
  }
})
