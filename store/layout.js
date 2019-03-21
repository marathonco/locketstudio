import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = () => ({
  menuIsActive: false
})

const getters = {
  menuIsActive(state) {
    return state.menuIsActive
  }
}

const mutations = {
  TOGGLE_MENU(state) {
    state.menuIsActive = !state.menuIsActive
  },
  CLOSE_MENU(state) {
    state.menuIsActive = false
  }
}

const actions = {
  toggleMenu({
    commit
  }) {
    commit('TOGGLE_MENU')
  },
  closeMenu({
    commit
  }) {
    commit('CLOSE_MENU')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
