// pages/appeal-submit/appeal-submit.js
const app = getApp()
const { getBaseUrl } = require('../../utils/baseUrl')
const { formatTime, containsImageLink } = require('../../utils/util')
const { autoReply, addAppeal, updateAppeal } = require('../../api/appeal-submit')
let oldContent = '' // 清空输入框之前输入的值
let cacheFiles = [] // 上传接口报错401保存的获取图片的数据

Page({
  data: {
    typeId: '',
    type: 'appeal',
    status: '',
    userId: null,
    order: 0, // 排序
    placeholder: '请输入诉求',
    appealId: null, // 诉求id
    autoList: [], // 转人工前的自动回复列表
    appealList: [], // 诉求或意见列表
    userList: {}, // 存在一条，两条，多条
    inputContent: '',
    isShowPic: false, // 是否显示上传图片icon
    isHuman: false, // 是否人工
    keyboardHeight: 0,
  },
  onLoad(options) {
    this.initData(options)

    this.initTitle(options)

    if (options.content) {
      this.initAppealList(options.content)
    }
  },
  initData(options) {
    console.log('options: ', options)
    const { type, typeId, content, status, appealId } = options
    const { nickName, avatarUrl } = app.globalData.userInfo
    const userId = wx.getStorageSync('userId')
    let userList = {}
    console.log('userId :', userId, typeof userId, 'u' + userId)
    if (content) {
      userList = JSON.parse(content).userList
    } else {
      userList = {
        ['u'+userId]: {
          userId: userId, nickName, avatar: avatarUrl
        }
      }
    }
    console.log('userList :', userList)
    this.setData({
      userId,
      type,
      typeId,
      userList,
      appealId: appealId ? appealId : '',
      status: status ? status : '',
      isShowPic: type === 'suggestion' || !!content,
      isHuman: !!content
    })
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
  initAppealList(content) {
    const appealList = JSON.parse(content).content
    const { userList } = this.data
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
    const copyList = JSON.parse(JSON.stringify(this.data.appealList))
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
      this.setData({
        keyboardHeight: res.height || 0
      })
    })
  },
  getKeyBoardHeight(e){
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
  // 上传图片或者点击发送按钮更新诉求列表
  updateAppealList(actionType, actionContnt) {
    const { userId, appealList } = this.data
    const myselfObj = {
      order: appealList.length + 1 + '',
      userId,
      content: actionContnt,
      time: formatTime(new Date()),
      avatar: app.globalData.userInfo.avatarUrl,
      hasPic: actionType === 'picture' ? true : false
    }

    appealList.push(myselfObj)

    this.setData({
      appealList
    })
    console.log('appealList: ', this.data.appealList)
  },
  onUpload() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album'],
      success: res => {
        console.log('chooseMedia res: ', res)
        cacheFiles = res.tempFiles
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
      wx.uploadFile({
        filePath: file.tempFilePath,
        header,
        name: 'file',
        url: baseUrl + '/common/uploadMinio',
        success: res => {
          const data = JSON.parse(res.data)
          console.log('data :', data)

          if (data.code === 401) {
            app.toLogin().then(() => {
              this.uploadImg(cacheFiles)
            })
            return 
          }

          if (data.code === 200) {
            const { url } = data
            const { appealList } = this.data
            if (!appealList.length ) {
              this.addAppealSubmit('picture', url)
              return
            }
            if (appealList.length ) {
              this.updateAppealSubmit('picture', url)
              return
            }
          }
        }
      })
    })
  },
  send() {
    console.log('this.data.inputContent: ', this.data.inputContent)
    const { inputContent, type, isHuman, appealList } = this.data
    oldContent = inputContent

    if (!inputContent) {
      const con = type === 'appeal' ? '诉求' : '意见建议'
      wx.showToast({
        title: `请输入${con}`,
        icon: 'none'
      })
      return
    }

    this.setData({
      inputContent: ''
    })

    if (type === 'appeal' && !isHuman) {
      this.robotReply()
      return
    }
    if (!appealList.length ) {
      this.addAppealSubmit('text', oldContent)
      return
    }
    if (appealList.length ) {
      this.updateAppealSubmit('text', oldContent)
      return
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

    this.autoReplyRequest()
  },
  autoReplyRequest() {
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
      if (Array.isArray(res.rows) && !res.rows.length) {
        const { autoList } = this.data
        autoList.push(
          { user: 'nodata', content: '我不太理解您的意思，如有需要请转人工服务' }
        )
        this.setData({
          autoList
        })
      }
    }).catch(err => {
      if (err.code === 401) {
        app.toLogin().then(() => {
          this.autoReplyRequest()
        })
      }
    })
  },
  // 新增诉求或意见
  addAppealSubmit(actionType, actionContnt) {
    this.updateAppealList(actionType, actionContnt)

    this.addAppealRequest()
  },
  addAppealRequest() {
    const { type, typeId, userList } = this.data
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
      appealType: type === 'appeal' ? '0' : '1',
      userId: this.data.userId
    }
    console.log('addAppeal params: ', params)

    addAppeal(params).then(res => {
      console.log('addAppeal res :', res)
      this.setData({
        appealId: res.data.appealId
      })
    }).catch(err => {
      if (err.code === 401) {
        app.toLogin().then(() => {
          this.addAppealRequest()
        })
      }
    })
  },
  // 更新诉求或意见
  updateAppealSubmit(actionType, actionContnt) {
    this.updateAppealList(actionType, actionContnt)

    this.updateAppealRequest()
  },
  updateAppealRequest(status) {
    const { appealId, userList } = this.data
    const tmpContent = this.getContentParams()

    const params = {
      appealId,
      content: JSON.stringify({
        userList,
        content: tmpContent
      }),
      appealStatus: status ? status : 0
    }
    console.log('updateAppeal params: ', params)

    updateAppeal(params).then(res => {
      console.log('addAppeal res :', res)
    }).catch(err => {
      if (err.code === 401) {
        app.toLogin().then(() => {
          this.updateAppealRequest()
        })
      }
    })
  },
  onUnload() {
    if (this.data.type === 'suggestion') {
      this.updateAppealRequest(2)
    }
  }
})