import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = () => {
  return new Vuex.Store()
}

export const state = () => ({})
