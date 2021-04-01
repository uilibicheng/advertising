const isDev = true // 判断环境 true 测试环境  false 正式环境
const DEV_APPID = 'wxa190de12848963ce'
const PRD_APPID = 'wxb9e3601e997899f6'
const DEV_BASE_URL = 'http://portal-dev-api-ad.1pluslive.com/advertising'
const PRD_BASE_URL = 'http://portal-prd-api-ad.1pluslive.com/advertising'
const DEV_ROOT_URL = 'http://advertiser-dev-h5-ad.1pluslive.com/'
const PRD_ROOT_URL = 'http://advertiser-prd-h5-ad.1pluslive.com/'

export default {
  BASE_URL: isDev ? DEV_BASE_URL : PRD_BASE_URL,
  APPID: isDev ? DEV_APPID : PRD_APPID,
  ROOT_URL: isDev ? DEV_ROOT_URL : PRD_ROOT_URL,
  BASIC_AUTHORIZATION: 'Basic YWR2ZXJ0aXNpbmctY2xpZW50OmFkdmVydGlzaW5nLXNlY3JldA==',
  USER_INFO_AUTH_URL: '/user/getUserInfoByWxOAuthCode'
}