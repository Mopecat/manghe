import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import manghe from './modules/manghe'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storeage: window.localStorage
    })
  ],
  modules: {
    app,
    settings,
    user,
    manghe
  },
  getters
})

export default store
