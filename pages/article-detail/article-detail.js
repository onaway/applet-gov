// pages/article-detail/article-detail.js
const app = getApp()

Page({
  data: {
    htmlContent: ''
  },
  onLoad() {
    const htmlContent = app.globalData.detailData.replace(/<img/g, '<img class="pic"')
    const content = this.escape2Html(htmlContent)
    
    this.setData({
      htmlContent: content
    })
  },
  escape2Html(str) {
    const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
    return  str && str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => {
      return arrEntities[t];
    })
  }
})