const Hosts = {
  dev: 'https://inanxin-test.yiycm.cn/prod-api',   
  tri: 'https://inanxin-test.yiycm.cn/prod-api', 
  prod: 'https://inanxin.yiycm.cn/prod-api'
};

export const getBaseUrl = () => {
  const { envVersion } = wx.getAccountInfoSync().miniProgram;
  let baseUrl = '';
  switch (envVersion) {
    case 'develop':
        baseUrl = `${Hosts.dev}`;
        break;
    case 'trial':
        baseUrl = `${Hosts.tri}`;
        break;
    case 'release':
        baseUrl = `${Hosts.prod}`;
        break;
    default:
        baseUrl = `${Hosts.prod}`;
        break;
  }
  return baseUrl;
}
