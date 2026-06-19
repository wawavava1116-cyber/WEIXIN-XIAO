const {
  getStoredUser,
  loginWithWechat,
  markProfileChoiceDone,
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
    canLogin: user.mode !== 'wechat' || !user.hasProfile
  }
}

Page({
  data: {
    profile: getProfile(),
    medals: { gold: 0, silver: 0, bronze: 0 },
    showProfileForm: false,
    profileNickname: '',
    profileAvatarTempPath: '',
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

  startWechatLogin() {
    if (this.data.savingProfile) return
    wx.showLoading({ title: '正在登录' })
    loginWithWechat()
      .then((session) => {
        wx.hideLoading()
        const user = session.user || {}
        this.setData({
          profile: getProfile(),
          showProfileForm: true,
          profileNickname: user.nickname && user.nickname !== '游客用户' ? user.nickname : '',
          profileAvatarTempPath: ''
        })
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({ title: '微信登录暂不可用', icon: 'none' })
      })
  },

  onChooseAvatar(event) {
    this.setData({
      profileAvatarTempPath: event.detail.avatarUrl || ''
    })
  },

  onProfileNicknameInput(event) {
    this.setData({
      profileNickname: event.detail.value || ''
    })
  },

  saveWechatProfile() {
    const nickname = String(this.data.profileNickname || '').trim()
    const avatarTempPath = this.data.profileAvatarTempPath
    if (!nickname || !avatarTempPath) {
      wx.showToast({ title: '请先选择头像并填写微信名', icon: 'none' })
      return
    }
    this.setData({ savingProfile: true })
    wx.showLoading({ title: '正在保存' })
    saveUserProfile({ nickname, avatarTempPath })
      .then(() => {
        markProfileChoiceDone()
        wx.hideLoading()
        this.setData({
          showProfileForm: false,
          profileNickname: '',
          profileAvatarTempPath: '',
          savingProfile: false
        })
        this.refreshProfile()
        wx.showToast({ title: '已登录', icon: 'success' })
      })
      .catch(() => {
        wx.hideLoading()
        this.setData({ savingProfile: false })
        wx.showToast({ title: '保存失败，请稍后再试', icon: 'none' })
      })
  }
})
