const { getStoredUser } = require('../../utils/userAuth')

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
    profile: getProfile()
  },

  onShow() {
    this.setData({ profile: getProfile() })
  }
})
