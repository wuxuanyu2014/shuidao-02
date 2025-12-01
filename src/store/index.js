import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scale: {
      width: '1',
      height: '1',
    }
  },
  mutations: {
    scaleChange(state, scale) {
      state.scale = scale
    }
  },
  actions: {
  },
  modules: {
  }
})
