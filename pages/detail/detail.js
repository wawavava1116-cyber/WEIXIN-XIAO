const { matches } = require('../../utils/matches')

Page({
  data: {
    match: null
  },

  onLoad(options) {
    const match = matches.find((item) => item.id === options.id) || matches[0]
    wx.setNavigationBarTitle({
      title: `${match.home.cn} vs ${match.away.cn}`
    })
    this.setData({ match })
  },

  showReward() {
    wx.showModal({
      title: '感谢支持',
      content: '这里可以接入微信赞赏码或客服二维码。当前版本先保留不强制支付的打赏入口。',
      confirmText: '继续加油',
      showCancel: false
    })
  }
})
