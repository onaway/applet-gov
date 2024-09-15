// pages/appeal-list/appeal-list.js
const app = getApp()
const { queryAppealList } = require('../../api/appeal-list')

Page({
  data: {
    pageNum: 1,
    pageSize: 10,
    list: [],
    loading: true,
    hasMore: true,
    isEnd: false
  },
  onLoad() {
    this.loadMore()
  },
  toAppealDetail() {},
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

        const { rows } = res

        // 更新数据
        this.setData({
          list: this.data.list.concat(rows),
          pageNum: pageNum + 1,
          loading: false
        })

        if (rows.length < pageSize) {
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