App({
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({ traceUser: true })
    }
  },

  globalData: {
    appName: '世界杯赛前播报'
  }
})
