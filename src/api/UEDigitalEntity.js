import request from '@/utils/request'

export function getRequirements(ueUrl) {
    return request({
        baseURL: ueUrl,
        url: '/requirements',
        method: 'get'
    })
}

export function patchRequirements(ueUrl, params) {
    return request({
        baseURL: ueUrl,
        url: '/requirements',
        method: 'patch',
        params: params
    })
}

export function postRequirements(ueUrl, params) {
    return request({
        baseURL: ueUrl,
        url: '/requirements',
        method: 'post',
        params: params
    })
}

export function getGNBConnectionState(ueUrl) {
    return request({
        baseURL: ueUrl,
        url: '/gnb-connection-state',
        method: 'get'
    })
}

export function getSubscriptionInfo(ueUrl) {
    return request({
        baseURL: ueUrl,
        url: '/subscription-info',
        method: 'get'
    })
}

export function getPDUsession(ueUrl) {
    return request({
        baseURL: ueUrl,
        url: '/pdu-session',
        method: 'get'
    })
}

export function postPDUsession(ueUrl, params) {
    return request({
        baseURL: ueUrl,
        url: '/pdu-session',
        method: 'post',
        data: params
    })
}

export function deletePDUsession(ueUrl, pdu_id) {
    return request({
        baseURL: ueUrl,
        url: `/pdu-session/${pdu_id}`,
        method: 'delete',
    })
}

export function getPDUSessionByRequirement(ueUrl, requirement, endPointIp, endPointPort) {
    return request({
        baseURL: ueUrl,
        url: `/pdu-session/${requirement}?endPointIp=${endPointIp}&endPointPort=${endPointPort}`,
        method: 'get'
    })
}