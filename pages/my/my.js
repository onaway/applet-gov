// pages/my/my.js
const app = getApp()
const { isTokenExpired, removeToken } = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  onShow() {
    const { firstLogin, userInfo } = app.globalData
    if (firstLogin) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
      app.globalData.firstLogin = false

      this.toLogin().then(() => {
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
  toAppealList() {
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
          this.jumpToAppealList()
        })
      } else {
        console.log('toClassify: token is still valid')
        this.jumpToAppealList()
      }
    }
  },
  jumpToAppealList() {
    wx.navigateTo({
      url: '/pages/appeal-list/appeal-list',
    })
  }
})