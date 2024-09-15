// pages/my/my.js
const app = getApp()
const { login } = require('../../api/login')

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
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  toAppealList() {
    wx.navigateTo({
      url: '/pages/appeal-list/appeal-list',
    })
  }
})