// pages/userInfo/userInfo.js
const app = getApp()
const { getBaseUrl } = require('../../utils/baseUrl')

Page({
  data: {
    avatarUrl: '/images/avatar.png',
    nickName: ''
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const baseUrl = getBaseUrl()

    wx.uploadFile({
      filePath: avatarUrl,
      name: 'file',
      url: baseUrl + '/mini/uploadAvatar',
      success: res => {
        const data = JSON.parse(res.data)
        console.log('data :', data)

        if (data.code === 200) {
          const { url } = data
          this.setData({
            avatarUrl: url,
          })
        }
      }
    })
  },
  getNickName(e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  confirm() {
    const { avatarUrl, nickName } = this.data
    if (avatarUrl === '/images/avatar.png') {
      return wx.showToast({
        title: '请选择头像',
        icon: 'none'
      })
    }

    if (!nickName) {
      return wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  onUnload() {
    const { avatarUrl, nickName } = this.data
    if (avatarUrl === '/images/avatar.png') {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
      return
    }

    if (!nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    app.globalData.userInfo = {
      avatarUrl,
      nickName
    }
    app.globalData.firstLogin = true
  }
})