// pages/appeal-submit/appeal-submit.js
const app = getApp()
const { getBaseUrl } = require('../../utils/baseUrl')
const { formatTime, containsImageLink } = require('../../utils/util')
const { autoReply, addAppeal, updateAppeal } = require('../../api/appeal-submit')
let oldContent = '' // 清空输入框之前输入的值

Page({
  data: {
    typeId: '',
    type: 'appeal',
    userId: null,
    order: 0, // 排序
    placeholder: '请输入诉求',
    autoList: [], // 转人工前的自动回复列表
    appealList: [
      // {order:"1",userId:110,time:"2024-09-06 17:17:22",content: "123456"},
      // {order:"2",userId:101,time:"2024-09-06 17:17:22",content: "https://community-images-cdn.hdyx.cn/community/20240701/101220399616377.jpg"},
      // {order:"3",userId:110,time:"2024-09-06 17:17:22",content: "https://community-images-cdn.hdyx.cn/community/20240912/164702092871768.jpg"},
    ], // 诉求或意见列表
    userList: {}, // 存在一条，两条，多条
    inputContent: '',
    isShowPic: false, // 是否显示上传图片icon
    isHuman: false, // 是否人工
    keyboardHeight: 0,
  },
  onLoad(options) {
    this.initData(options)

    this.initTitle(options)

    this.handleAppealList()
  },
  initData(options) {
    console.log('options: ', options)
    const userId = wx.getStorageSync('userId')
    console.log('userId :', userId, typeof userId, 'u' + userId)
    const { nickName, avatarUrl } = app.globalData.userInfo
    this.setData({
      userId,
      type: options.type,
      typeId: options.typeId,
      isShowPic: options.type === 'suggestion',
      userList: {
        ['u'+userId]: {
          userId: userId, nickName, avatar: avatarUrl
        }
      }
    })
    console.log('this.data.userList :', this.data.userList)
  },
  initTitle(options) {
    if (options.type === 'suggestion') {
      this.setData({
        placeholder: '请输入意见建议'
      })
      wx.setNavigationBarTitle({
        title: '意见建议',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '诉求提交',
      })
    }
  },
  handleAppealList() {
    const { appealList, userList } = this.data
    const list = appealList.map(item => {
      if (containsImageLink(item.content)) {
        item.hasPic = true
      } else {
        item.hasPic = false
      }
      const user = Object.values(userList).find(v => v.userId === item.userId)
      if (user) {
        item.avatar = user.avatar
      } else {
        item.avatar = '/images/avatar.png'
      }
      return item
    })

    this.setData({
      appealList: list
    })
    console.log('this.data.appealList :', this.data.appealList)
  },
  // 获取接口参数 content 中的 content
  getContentParams() {
    const { appealList } = this.data
    const copyList = JSON.parse(JSON.stringify(appealList))
    return copyList.map(item => {
      delete item.hasPic
      delete item.avatar
      return item
    })
  },
  // 转人工客服
  toHuman() {
    const { autoList } = this.data
    autoList.push({ user: 'human', content: '已转人工客服' })
    this.setData({
      isHuman: true,
      isShowPic: true,
      autoList
    })
  },
  previewImage(e) {
    const currentUrl = e.currentTarget.dataset.src
    const images = this.data.appealList
      .filter(item => item.hasPic)
      .map(item => item.content)

    wx.previewImage({
      current: currentUrl, // 当前显示的图片链接
      urls: images // 需要预览的图片链接列表
    })
  },
  onFocus() {
    wx.onKeyboardHeightChange((res) => {
      console.log('res: ', res)
      // wx.showToast({
      //   title: JSON.stringify(res)
      // })
      this.setData({
        keyboardHeight: res.height || 0
      })
    })
  },
  getKeyBoardHeight(e){
    console.log('e.detail.height: ', e.detail.height)
    const height = e.detail.height || 0
    this.setData({
      keyboardHeight: height
    })
  },
  onChange(e) {
    const { value } = e.detail
    this.setData({
      inputContent: value
    })
  },
  onUpload() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album'],
      success: res => {
        console.log('chooseMedia res: ', res)
        this.uploadImg(res.tempFiles)
      }
    })
  },
  uploadImg(tempFiles) {
    const baseUrl = getBaseUrl()
    const token = wx.getStorageSync('token')
    const header = {
      Authorization: `Bearer ${token}`
    }
    tempFiles.forEach(file => {
      console.log('file :', file)
      wx.uploadFile({
        filePath: file.tempFilePath,
        header,
        name: 'file',
        url: baseUrl + '/common/uploadMinio',
        success: res => {
          console.log('uploadFile res: ', res)
          console.log('res.data :', JSON.parse(res.data))
          const { url } = JSON.parse(res.data)
          if (this.data.type === 'appeal') {
            
          } else {

          }
        }
      })
    })
  },
  send() {
    console.log('this.data.inputContent: ', this.data.inputContent)
    const { inputContent, type, isHuman, appealList } = this.data
    oldContent = inputContent

    this.setData({
      inputContent: ''
    })

    if (type === 'appeal' && !isHuman) {
      this.robotReply()
    }
    if (type === 'appeal' && isHuman && !appealList.length ) {
      this.addAppealSubmit()
    }
    if (type === 'appeal' && isHuman && appealList.length ) {
      this.updateAppealSubmit()
    }
  },
  robotReply() {
    const myselfObj = {
      avatar: app.globalData.userInfo.avatarUrl,
      content: oldContent,
      user: 'myself',
      time: formatTime(new Date())
    }

    const { autoList } = this.data
    autoList.push(myselfObj)

    this.setData({
      autoList
    })

    const params = {
      pageSize: 1,
      status: '0',
      replyKey: oldContent
    }
    autoReply(params).then(res => {
      console.log('autoReply res: ', res)
      if (Array.isArray(res.rows) && res.rows.length) {
        const [data] = res.rows
        const robotObj = {
          avatar: '/images/robot.png',
          content: data.replyContent,
          user: 'robot',
          time: data.updateTime
        }
        this.data.autoList.push(robotObj)
        this.setData({
          autoList: this.data.autoList
        })
      }
    }).catch(err => {
      if (err.code === 401) {
        app.toLogin().then(() => {
          this.robotReply()
        })
      }
    })
  },
  // 新增诉求
  addAppealSubmit() {
    const { userId, typeId, userList, appealList } = this.data
    const myselfObj = {
      order: '1',
      userId,
      avatar: app.globalData.userInfo.avatarUrl,
      content: oldContent,
      hasPic: false,
      time: formatTime(new Date())
    }

    appealList.push(myselfObj)

    this.setData({
      appealList
    })

    const tmpContent = this.getContentParams()

    const params = {
      typeId,
      content: JSON.stringify({
        userList,
        content: tmpContent
      }),
      orderNum: 1,
      visible: 'N',
      appealStatus: '0',
      appealType: '0',
      userId: this.data.userId
    }

    addAppeal(params).then(res => {
      console.log('addAppeal res :', res)
    })
  },
  // 更新诉求
  updateAppealSubmit() {},
})