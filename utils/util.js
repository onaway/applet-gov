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
export const containsImageLink = (str) => {
  // 定义正则表达式，匹配常见的图片扩展名
  const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))/i
  return imageRegex.test(str)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
