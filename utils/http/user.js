import $http from './request'
import constants from '../../config/constants'

export default {
  getCurrentUser(opts) {
    opts.url = '/user/currentUser'
    $http.post(opts)
  },

  sendSMSLoginCode(opts) {
    opts.header = {
      Authorization: constants.BASIC_AUTHORIZATION,
    }
    opts.url = '/sms/loginCode'
    $http.post(opts, false)
  },

  login(opts) {
    opts.header = {
      Authorization: constants.BASIC_AUTHORIZATION,
    }
    opts.url = '/user/loginByCode'
    $http.post(opts, false)
  },

  getUserAuthCode(opts) {
    opts.url = `${constants.USER_INFO_AUTH_URL}?code=${opts.code}`
    opts.method = 'GET'
    $http.post(opts)
  },

  updateUserAuth(opts) {
    opts.url = '/user/updateWeChat'
    $http.post(opts)
  },

  logout(opts) {
    opts.url = '/user/logout'
    $http.post(opts, false)
  },

  sendSMSRegisterCode(opts) {
    opts.header = {
      Authorization: constants.BASIC_AUTHORIZATION,
    }
    opts.url = '/sms/registerCode'
    $http.post(opts, false)
  },

  register(opts) {
    opts.header = {
      Authorization: constants.BASIC_AUTHORIZATION,
    }
    opts.url = '/user/register'
    $http.post(opts, false)
  },

  adRecharge(opts) {
    opts.url = '/user/adRecharge'
    $http.post(opts)
  },

  realNameVerification(opts) {
    opts.url = '/user/realNameVerification'
    $http.post(opts)
  },
}