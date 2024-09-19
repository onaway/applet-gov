// pages/home/home.js
const app = getApp()
const { queryBannerList, queryServiceList } = require('../../api/home')
const { isTokenExpired, removeToken } = require('../../utils/util')

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
      // 为了让用户信息可以马上显示
      this.setData({
        userInfo,
        hasUserInfo: true
      })
      app.globalData.firstLogin = false

      app.toLogin().then(() => {
        // 如果用户信息更新了，那么这里重置一次
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
    const isRegister = wx.getStorageSync('isRegister') // 是否注册过
    if (!isRegister) {
      this.jumpToUserInfo()
    } else {
      if (isTokenExpired()) {
        removeToken()
        console.log('已经登录过，但是 token 过期了，重新登录')
        app.toLogin().then(() => {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
          wx.showToast({
            title: '登录成功',
            icon: 'none'
          })
        })
      }
    }
  },
  jumpToUserInfo() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  toClassify(e) {
    const isRegister = wx.getStorageSync('isRegister') // 是否注册过
    if (!isRegister) {
      this.jumpToUserInfo()
    } else {
      const type = e.currentTarget.dataset.type
      if (isTokenExpired()) {
        removeToken()
        console.log('已经登录过，但是 token 过期了，重新登录')
        app.toLogin().then(() => {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
          this.jumpToClassify(type)
        })
      } else {
        console.log('toClassify: token is still valid')
        this.jumpToClassify(type)
      }
    }
  },
  jumpToClassify(type) {
    wx.navigateTo({
      url: `/pages/classify/classify?type=${type}`,
    })
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