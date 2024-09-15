// app.js
// token 过期返回 401，需要重新登录再调用接口
// 主题服务和诉求分类图片懒加载
const { login } = require('./api/login')

App({
  onLaunch() {},
  globalData: {
    userInfo: null,
    userId: null,
    detailData: null,
    firstLogin: false, // 只要从 userInfo 页面返回的就算首次登录
  },
  toLogin() {
    return new Promise((resolve) => {
      const { avatarUrl, nickName } = this.globalData.userInfo || {}

      wx.login({
        success: (res) => {
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
    
            wx.setStorageSync('token', token)
            wx.setStorageSync('userId', userId)
            this.globalData.userId = userId
            this.globalData.userInfo = {
              avatarUrl: avatar,
              nickName
            }

            resolve()
          })
        },
      })
    })
  }
})
