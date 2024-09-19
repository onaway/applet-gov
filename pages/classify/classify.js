// pages/appeal-classify/appeal-classify.js
const app = getApp()
const { queryServiceList } = require('../../api/home')
const { isTokenExpired, removeToken } = require('../../utils/util')

Page({
  data: {
    type: '',
    text: '诉求',
    appealTypeList: []
  },
  onLoad(options) {
    console.log('options: ', options)
    this.setData({
      type: options.type
    })
    if (options.type === 'suggestion') {
      this.setData({
        text: '意见'
      })
      wx.setNavigationBarTitle({
        title: '意见建议',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '诉求提交',
      })
    }
    this.getAppealTypeList()
  },
  getAppealTypeList() {
    queryServiceList({ parentId: '0', status: '0' }).then(res => {
      console.log('queryServiceList res: ', res)
      this.setData({
        appealTypeList: res.data || []
      })
    })
  },
  toAppealSubmit(e) {
    const typeId = e.currentTarget.dataset.id
    if (isTokenExpired()) {
      removeToken()
      console.log('已经登录过，但是 token 过期了，重新登录')
      app.toLogin().then(() => {
        this.jumpToAppealSubmit(typeId)
      })
    } else {
      this.jumpToAppealSubmit(typeId)
    }
  },
  jumpToAppealSubmit(typeId) {
    wx.navigateTo({
      url: `/pages/appeal-submit/appeal-submit?typeId=${typeId}&type=${this.data.type}`,
    })
  }
})