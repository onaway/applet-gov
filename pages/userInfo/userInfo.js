// pages/userInfo/userInfo.js
const app = getApp()

Page({
  data: {
    avatarUrl: '/images/avatar.png',
    nickName: ''
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    console.log('avatarUrl: ', avatarUrl)
    this.setData({
      avatarUrl,
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
    app.globalData.userInfo = {
      // avatarUrl,
      avatarUrl: 'https://app-oss.byte-app.com/common/platform/verify/user/logo/1000434393060675584/a75f94330f0f482b87b5c162afefa141.jpeg',
      nickName
    }
    app.globalData.firstLogin = true
  }
})