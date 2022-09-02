// import Cookies from 'js-cookie'

const state = {
  shoukuanList: null,
  fukuanList: null
}

const mutations = {
  SET_FUKUANLIST: (state, list) => {
    // 判断日期相同则不再set
    const now = new Date().getDate()
    const todayTime = new Date(now).getTime()
    const dataTime = new Date(list[0].createtime).getTime()
    console.log(todayTime, dataTime)
    if (todayTime >= dataTime) {
      state.fukuanList = list
    }
  },
  SET_SHOUKUANLIST: (state, list) => {
    // 判断日期相同则不再set
    const now = new Date(Date.now()).toLocaleDateString()
    const todayTime = new Date(now).getTime()
    const dataTime = new Date(list[0].createtime).getTime()
    console.log(todayTime, dataTime)
    if (todayTime >= dataTime) {
      state.shoukuanList = list
    }
  }
}

const actions = {
  setShoukuanList({ commit }, list) {
    commit('SET_SHOUKUANLIST', list)
  },
  setFukuanList({ commit }, list) {
    commit('SET_FUKUANLIST', list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
