// pages/appeal-classify/appeal-classify.js
const { queryServiceList } = require('../../api/home')

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
    wx.navigateTo({
      url: `/pages/appeal-submit/appeal-submit?typeId=${typeId}&type=${this.data.type}`,
    })
  }
})