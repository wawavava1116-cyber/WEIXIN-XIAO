const { matches } = require('../../utils/matches')

Page({
  data: {
    matches,
    featured: matches[0],
    reviewOpen: false,
    reviewSummary: '3 场已复盘 · 方向 2/3',
    finishedMatches: [
      {
        id: 'mexico-southafrica-review',
        home: '墨西哥',
        away: '南非',
        score: '2-0',
        pick: '墨西哥胜 2-0',
        accuracy: '完全命中',
        levelClass: 'hit'
      },
      {
        id: 'korea-czechia-review',
        home: '韩国',
        away: '捷克',
        score: '2-1',
        pick: '韩国不败 1-1',
        accuracy: '方向命中',
        levelClass: 'near'
      },
      {
        id: 'canada-bosnia-review',
        home: '加拿大',
        away: '波黑',
        score: '待更新',
        pick: '加拿大不败 2-1',
        accuracy: '赛后更新',
        levelClass: 'pending'
      }
    ]
  },

  toggleReview() {
    this.setData({
      reviewOpen: !this.data.reviewOpen
    })
  }
})
