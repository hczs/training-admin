import request from '@/utils/request'
import { removeToken } from '@/utils/auth'

export function login(username, password) {
  return request({
    url: '/ucenter/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/ucenter/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  removeToken()
  // return request({
  //   url: '/ucenter/admin/logout',
  //   method: 'post'
  // })
}
