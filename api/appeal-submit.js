const { request } = require('../utils/request')

// 查询自动回复内容
export const autoReply = (data) => {
  return request({
    method: 'GET',
    url: '/business/reply/list',
    data
  })
}

// 新建诉求、意见
export const addAppeal = (data) => {
  return request({
    method: 'POST',
    url: 'business/appeal',
    data
  })
}

// 更新诉求、意见
export const updateAppeal = (data) => {
  return request({
    method: 'PUT',
    url: 'business/appeal',
    data
  })
}
