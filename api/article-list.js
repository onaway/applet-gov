const { request } = require('../utils/request')

// 文章列表
export const queryArticleList = (data) => {
  return request({
    method: 'GET',
    url: 'mini/article/list',
    data
  })
}