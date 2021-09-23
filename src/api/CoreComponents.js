import request from '@/utils/request'
let baseURL = `${process.env.VUE_APP_DISCOVERY_5GS_DE}`;

export function getActiveComponents() {
    return request({
        baseURL: baseURL,
        url: '/components',
        method: 'get'
    })
}