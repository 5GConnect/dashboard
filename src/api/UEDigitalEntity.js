import request from '@/utils/request'

let baseURL = `${process.env.VUE_APP_DIGITAL_ENTITY_UE}`;

export function getRequirements() {
    return request({
        baseURL: baseURL,
        url: '/requirements',
        method: 'get'
    })
}

export function patchRequirements(params) {
    return request({
        baseURL: baseURL,
        url: '/requirements',
        method: 'patch',
        params: params
    })
}

export function postRequirements(params) {
    return request({
        baseURL: baseURL,
        url: '/requirements',
        method: 'post',
        params: params
    })
}

export function getGNBConnectionState() {
    return request({
        baseURL: baseURL,
        url: '/gnb-connection-state',
        method: 'get'
    })
}

export function getSubscriptionInfo() {
    return request({
        baseURL: baseURL,
        url: '/subscription-info',
        method: 'get'
    })
}

export function getPDUsession() {
    return request({
        baseURL: baseURL,
        url: '/pdu-session',
        method: 'get'
    })
}

export function postPDUsession(params) {
    return request({
        baseURL: baseURL,
        url: '/pdu-session',
        method: 'post',
        data: params
    })
}

export function deletePDUsession(pdu_id) {
    return request({
        baseURL: baseURL,
        url: `/pdu-session/${pdu_id}`,
        method: 'delete',
    })
}