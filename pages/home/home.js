// pages/home/home.js
const app = getApp()
const { login } = require('../../api/login')
const { queryBannerList, queryServiceList } = require('../../api/home')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    bannerList: ['slide1', 'slide2', 'slide3'],
    indicatorDots: true,
    currentIndex: 0,
    serviceList: []
  },
  onShow() {
    const { firstLogin, userInfo } = app.globalData
    if (firstLogin) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
      app.globalData.firstLogin = false

      app.toLogin().then(() => {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      })
    }
    if (userInfo && !app.globalData.firstLogin) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },
  onLoad() {
    const token = wx.getStorageSync('token') || ''
    if (token) {
      app.toLogin().then(() => {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      })
    }

    this.getBannerList()

    this.getServiceList()
  },
  getBannerList() {
    queryBannerList({ status: '0', pagesize: 5 }).then(res => {
      console.log('queryBannerList res: ', res)
      this.setData({
        bannerList: res.rows || []
      })
    })
  },
  getServiceList() {
    queryServiceList({ parentId: '0', status: '0' }).then(res => {
      console.log('queryServiceList res: ', res)
      this.setData({
        serviceList: res.data || []
      })
    })
  },
  toUserInfo() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  toClassify(e) {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.toUserInfo()
    } else {
      const type = e.currentTarget.dataset.type
      console.log('type: ', type)
      wx.navigateTo({
        url: `/pages/classify/classify?type=${type}`,
      })
    }
  },
  toBannerDetail(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: `/pages/webview/webview?url=${url}`,
    })
  },
  onSwiperChange(e) { 
    this.setData({
      currentIndex: e.detail.current
    });
  },
  toArticleList(e) {
    const typeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/article-list/article-list?typeId=${typeId}`,
    })
  },
})