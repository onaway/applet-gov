const { request } = require('../utils/request')

// 轮播图
export const queryBannerList = (data) => {
  return request({
    method: 'GET',
    url: 'mini/swiper/list',
    data
  })
}

// 主题服务
export const queryServiceList = (data) => {
  return request({
    method: 'GET',
    url: 'mini/articleType/list',
    data
  })
}