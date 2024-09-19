// pages/appeal-list/appeal-list.js
const app = getApp()
const { queryAppealList } = require('../../api/appeal-list')
const { isTokenExpired, removeToken } = require('../../utils/util')

Page({
  data: {
    pageNum: 1,
    pageSize: 15,
    list: [],
    loading: true,
    hasMore: true,
    isEnd: false
  },
  onLoad() {
    this.loadMore()
  },
  toAppealDetail(e) {
    if (isTokenExpired()) {
      removeToken()
      console.log('已经登录过，但是 token 过期了，重新登录')
      app.toLogin().then(() => {
        this.jumpToAppealDetail(e)
      })
    } else {
      this.jumpToAppealDetail(e)
    }
  },
  jumpToAppealDetail(e) {
    const { content, id, status, appealid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/appeal-submit/appeal-submit?type=appeal&typeId=${id}&content=${content}&status=${status}&appealId=${appealid}`,
    })
  },
  onReachBottom() {
    if (this.data.isEnd) {
      return
    }
    this.loadMore()
  },
  loadMore() {
    const { pageNum, pageSize } = this.data
    
    const params = {
      pageNum,
      pageSize,
      userId: app.globalData.userId,
      appealType: '0',
    }
    console.log('params: ', params)

    queryAppealList(params)
      .then(res => {
        console.log('queryAppealList res: ', res)

        const { rows, total } = res

        // 更新数据
        this.setData({
          list: this.data.list.concat(rows),
          pageNum: pageNum + 1,
          loading: false
        })

        if (pageSize * pageNum >= total) {
          this.setData({
            hasMore: false,
            isEnd: true
          })
          return
        }
      })
      .catch(err => {
        if (err.code === 401) {
          app.toLogin().then(() => {
            this.loadMore()
          })
        }
      })
  }
})