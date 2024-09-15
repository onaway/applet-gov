const { request } = require('../utils/request')

// 诉求列表
export const queryAppealList = (data) => {
  return request({
    method: 'GET',
    url: 'business/appeal/list',
    data
  })
}