// pages/article-list/article-list.js
const app = getApp()
const { queryArticleList } = require('../../api/article-list')
const { isTokenExpired, removeToken } = require('../../utils/util')

Page({
  data: {
    pageNum: 1,
    pageSize: 15,
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
    const isRegister = wx.getStorageSync('isRegister') // 是否注册过
    if (!isRegister) {
      this.toUserInfo()
    } else {
      if (isTokenExpired()) {
        removeToken()
        console.log('已经登录过，但是 token 过期了，重新登录')
        app.toLogin().then(() => {
          this.jumpToAppealSubmit()
        })
      } else {
        this.jumpToAppealSubmit()
      }
    }
  },
  toUserInfo() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  jumpToAppealSubmit() {
    const typeId = this.data.typeId
    wx.navigateTo({
      url: `/pages/appeal-submit/appeal-submit?typeId=${typeId}&type=appeal`,
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

      const { rows, total } = res

      // 更新数据
      this.setData({
        list: this.data.list.concat(rows),
        pageNum: pageNum + 1,
        loading: false
      })
      console.log('list: ', this.data.list)

      if (pageNum * pageSize >= total) {
        this.setData({
          hasMore: false,
          isEnd: true
        })
        return
      }
    })
  }
})