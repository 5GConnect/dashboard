import request from '@/utils/request'
let baseURL = 'http://localhost:8080';

export function getActiveComponents() {
    return request({
        baseURL: baseURL,
        url: '/components',
        method: 'get'
    })
}
