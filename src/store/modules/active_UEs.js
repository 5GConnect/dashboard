import Vue from 'vue'
import { getActiveUEs } from "@/api/DiscoveryService";
import {
    getGNBConnectionState,
    getSubscriptionInfo,
    getPDUsession,
} from "@/api/UEDigitalEntity";

async function fetchPDUSessions(ueUrl) {
    return await getPDUsession(ueUrl);
}

async function fetchSubscriptionInfo(ueUrl) {
    return await getSubscriptionInfo(ueUrl);
}

async function fetchGNBConnectionState(ueUrl) {
    return await getGNBConnectionState(ueUrl);
}

const state = {
    data: Object.create(null)
}

const mutations = {
    SET_ACTIVE_UEs(state, activeUEs) {
        Vue.set(state, 'data', activeUEs)
    },
    SET_GNB_CONNECTION_INFO(state, { ueSupi, gnbConnected, gnbCampedCell }) {
        Vue.set(state.data[ueSupi], 'gnbConnected', gnbConnected)
        Vue.set(state.data[ueSupi], 'gnbCampedCell', gnbCampedCell)
    },
    SET_PDU_SESSIONS(state, { ueSupi, pduSessions }) {
        Vue.set(state.data[ueSupi], 'PDUs', pduSessions)
    }
}

const actions = {
    async getUEs({ commit, dispatch }) {
        try {
            let activeUEs = await getActiveUEs()
            let activeUEsInformation = await Promise.all(activeUEs.map(async(supiIpAndPort) => {
                let ueUrl = `http://${supiIpAndPort.ip.ipv4Addr}:${supiIpAndPort.port}`
                var ws = new WebSocket(ueUrl.replace("http", "ws"));
                let ueSupi = supiIpAndPort.supi
                ws.onmessage = (event) => {
                    let gnbConnectionData = JSON.parse(event.data)
                    dispatch('updateGnbConnectionInfo', { gnbConnectionData, ueSupi })
                }
                let gnbConnectionStatus = await fetchGNBConnectionState(ueUrl);
                let pdus = await fetchPDUSessions(ueUrl)
                let subscriptionInfo = await fetchSubscriptionInfo(ueUrl)
                return [ueSupi, {
                    url: ueUrl,
                    PDUs: pdus,
                    subscriptionInfo: subscriptionInfo,
                    gnbConnected: gnbConnectionStatus.status === "CM-CONNECTED" ? true : false,
                    gnbCampedCell: gnbConnectionStatus["camped-cell"]
                }]
            }))
            commit('SET_ACTIVE_UEs', Object.fromEntries(activeUEsInformation))
        } catch (errorObject) {
            console.log(errorObject.message);
        }
    },
    updateGnbConnectionInfo({ commit }, { gnbConnectionData, ueSupi }) {
        let gnbConnectionStatus = gnbConnectionData.status === "CM-CONNECTED" ? true : false
        let gnbCampedCell = gnbConnectionData["camped-cell"]
        commit('SET_GNB_CONNECTION_INFO', { ueSupi, gnbConnectionStatus, gnbCampedCell })
    },
    async updatePduSessions({ commit }, ueSupi) {
        let pduSessions = await fetchPDUSessions(state.data[ueSupi].url)
        commit('SET_PDU_SESSIONS', { ueSupi, pduSessions })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}