const { request } = require('../utils/request')

// 登录
export const login = (data) => {
  return request({
    method: 'GET',
    url: 'mini/user/login',
    data
  })
}