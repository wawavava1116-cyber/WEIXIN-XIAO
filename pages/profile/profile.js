const { getStoredUser } = require('../../utils/userAuth')
const { fetchPredictionDashboard, hasPredictionProfile } = require('../../utils/userPredictions')

function getProfile() {
  const user = getStoredUser() || {}
  return {
    nickname: user.nickname || '游客用户',
    avatarUrl: user.avatarUrl || '',
    modeText: user.mode === 'wechat' ? '微信用户' : '游客用户',
    hasProfile: Boolean(user.hasProfile)
  }
}

Page({
  data: {
    profile: getProfile(),
    medals: { gold: 0, silver: 0, bronze: 0 }
  },

  onShow() {
    this.setData({ profile: getProfile() })
    if (!hasPredictionProfile()) {
      this.setData({ medals: { gold: 0, silver: 0, bronze: 0 } })
      return
    }
    fetchPredictionDashboard().then((result) => {
      this.setData({ medals: result.medals || { gold: 0, silver: 0, bronze: 0 } })
    }).catch(() => {})
  }
})
