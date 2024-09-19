// app.js
const { login } = require('./api/login')
const { setToken, isTokenExpired, removeToken } = require('./utils/util')

App({
  onLaunch() {
    if (isTokenExpired()) {
      removeToken()
      console.log('app.js Token expired and removed')
    } else {
      console.log('Token is still valid')
      const userInfo = wx.getStorageSync('userInfo')
      this.globalData.userInfo = userInfo 
    }
  },
  globalData: {
    userInfo: null,
    userId: null,
    detailData: null,
    firstLogin: false, // 只要从 userInfo 页面返回的就算首次登录
  },
  toLogin() {
    return new Promise((resolve) => {
      const { avatarUrl, nickName } = this.globalData.userInfo || {}

      wx.showToast({
        title: '登录中...',
        icon: 'loading'
      })

      wx.login({
        success: (res) => {
          if (res.code) {
            const params = {
              code: res.code
            }
            if (avatarUrl) {
              params.avatar = avatarUrl
            }
            if (nickName) {
              params.nickName = nickName
            }
            login(params).then(ret => {
              console.log('app.js ret: ', ret)
              const { token, userId, nickName, avatar } = ret

              setToken(token, userId, { nickName, avatarUrl: avatar })
              this.globalData.userId = userId
              this.globalData.userInfo = {
                avatarUrl: avatar,
                nickName
              }
  
              resolve()
            })
          }
        }
      })
    })
  }
})
