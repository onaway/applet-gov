export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 字符串是否包含图片
export const containsImageLink = str => {
  // 定义正则表达式，匹配常见的图片扩展名
  const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))/i
  return imageRegex.test(str)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 设置token和存储时间
export const setToken = (token, userId, userInfo) => {
  const currentTime = Date.now() // 获取当前时间戳
  wx.setStorageSync('token', token)
  wx.setStorageSync('userId', userId)
  wx.setStorageSync('userInfo', userInfo)
  wx.setStorageSync('tokenTime', currentTime) // 存储当前时间
  wx.setStorageSync('isRegister', true) // 是否注册过
}

export const isTokenExpired = () => {
  const tokenTime = wx.getStorageSync('tokenTime')
  if (!tokenTime) {
    return true // 如果没有存储时间，认为过期
  }
  
  const currentTime = Date.now()
  const timeDifference = currentTime - tokenTime
  // const thirtyMinutes = 30 * 60 * 1000 // 30分钟的毫秒数
  const thirtyMinutes = 1 * 60 * 1000 // 30分钟的毫秒数

  return timeDifference > thirtyMinutes
}

// 移除token
export const removeToken = () => {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userId')
  wx.removeStorageSync('userInfo')
  wx.removeStorageSync('tokenTime')
}
