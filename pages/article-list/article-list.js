// pages/article-list/article-list.js
const app = getApp()
const { queryArticleList } = require('../../api/article-list')

Page({
  data: {
    pageNum: 1,
    pageSize: 10,
    typeId: '',
    list: [],
    loading: true,
    hasMore: true,
    isSearch: false,
    searchContnet: '',
    isEnd: false
  },
  onLoad(options) {
    this.setData({
      typeId: options.typeId
    })
    this.loadMore()
  },
  onShow() {
    if (app.globalData.firstLogin) {
      app.globalData.firstLogin = false

      app.toLogin()
    }
  },
  handleSearch() {
    this.setData({
      isSearch: true,
      loading: true,
      pageNum: 1,
      list: []
    })

    this.loadMore()
  },
  onChange(e) {
    this.setData({
      searchContnet: e.detail.value
    })
  },
  toArticleDetail(e) {
    const content = e.currentTarget.dataset.content
    app.globalData.detailData = content
    wx.navigateTo({
      url: '/pages/article-detail/article-detail',
    })
  },
  toAppealSubmit() {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.toUserInfo()
    } else {
      const typeId = this.data.list[0].typeId
      wx.navigateTo({
        url: `/pages/appeal-submit/appeal-submit?typeId=${typeId}`,
      })
    }
  },
  toUserInfo() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
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
      typeId: this.data.typeId,
      status: '0',
      tittle: this.data.searchContnet
    }
    console.log('params: ', params)

    queryArticleList(params).then(res => {
      console.log('queryArticleList res: ', res)

      const { rows } = res

      // 更新数据
      this.setData({
        list: this.data.list.concat(rows),
        pageNum: pageNum + 1,
        loading: false
      })
      console.log('list: ', this.data.list)

      if (rows.length < pageSize) {
        this.setData({
          hasMore: false,
          isEnd: true
        })
        return
      }
    })
  }
})