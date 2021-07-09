import Vue from 'vue'
import { getActiveComponents } from "@/api/CoreComponents";

const state = {
    data: Object.create(null)
}

const mutations = {
    SET_ACTIVE_COMPONENTS(state, activeCoreComponents) {
        Vue.set(state, 'data', activeCoreComponents)
    }
}

const actions = {
    async getComponents({ commit }) {
        try {
            let coreComponents = await getActiveComponents();
            commit('SET_ACTIVE_COMPONENTS', coreComponents)
        } catch (errorObject) {
            console.log(errorObject.message);
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
