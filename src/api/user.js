import request from '@/utils/request'

let baseURL= process.env.VUE_APP_BASE_API; // url = base url + request url

export function login(data) {
  return request({
    baseURL: baseURL,
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    baseURL: baseURL,
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    baseURL: baseURL,
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
