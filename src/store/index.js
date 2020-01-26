import Vue from 'vue';
import Vuex from 'vuex';
import { processAreaStat } from './processAreaStat';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cityPoints: processAreaStat(window.getAreaStat),
    pickedIdx: -1,
  },
  getters: {
    visiblePoints({ cityPoints }) {
      return cityPoints;
    }
  },
  mutations: {
    setPickedIdx: (s, _) => (s.pickedIdx = _),
  },
  actions: {
  },
  modules: {
  }
})
