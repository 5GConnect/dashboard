import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import activeUEs from './modules/active_UEs'
import coreComponents from './modules/core_components'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        settings,
        user,
        activeUEs,
        coreComponents
    },
    getters
})

export default store
