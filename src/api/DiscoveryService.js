import request from '@/utils/request'

let baseURL = `${process.env.VUE_APP_DISCOVERY_SERVICE}`;

export function getActiveUEs() {
    return request({
        baseURL: baseURL,
        url: '/UE',
        method: 'get'
    })
}