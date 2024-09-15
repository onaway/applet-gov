const { getBaseUrl } = require('./baseUrl');

export const request = (options) => {
  const baseUrl = getBaseUrl()
  const token = wx.getStorageSync('token')
  const headers = {
    Authorization: `Bearer ${token}`
  }
  const header = Object.assign({}, headers, options.header) 
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}/${options.url}`,
      method: options.method,
      data: options.data,
      header,
      success: (res) => {
        // console.log('request res: ', res)
        if (res.data.code === 401) {
          reject(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
