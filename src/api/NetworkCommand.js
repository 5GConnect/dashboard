import request from '@/utils/request'

export function executePing(ueUrl, params) {
    return request({
        baseURL: ueUrl,
        url: '/ping-task',
        method: 'post',
        data: params
    })
}