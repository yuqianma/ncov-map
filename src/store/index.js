import Vue from 'vue';
import Vuex from 'vuex';
import { evalJsVar, getTimeFromAreaStatFileName } from '../util';
import { LatestTime, DateRange } from '../constants';
import { processAreaStat } from './processAreaStat';
import { formerData } from './processFormerData';

Vue.use(Vuex);

function fetchAllAreaStat() {
  return Promise.all(
    AreaStatIndex.map(filename => {
      return fetch(`${process.env.BASE_URL}dxy/${filename}`).then(res => res.text()).then(text => {
        const v = evalJsVar(text);
        v.time = getTimeFromAreaStatFileName(filename);
        return Object.freeze(v);
      });
    })
  );
}

const SEPARATE_DATE = new Date('2020-01-24');

const store = new Vuex.Store({
  state: {
    areaStats: [],
    pickedIdx: -1,
    dataTime: LatestTime,
    loaded: false,
  },
  getters: {
    visiblePoints({ areaStats, dataTime }) {
      if (dataTime === LatestTime) {
        // areaStats
        return processAreaStat(window.getAreaStat);
      } else if (dataTime > SEPARATE_DATE) {
        let idx = areaStats.findIndex(a => a.time > +dataTime);
        idx = Math.max(0, Math.min(idx - 1, areaStats.length));
        return processAreaStat(areaStats[idx]);
      } else {
        return formerData.getVisiblePointsByDate(dataTime);
      } 
    }
  },
  mutations: {
    setDataTime: (s, _) => {
      s.dataTime = _;
    },
    saveAllData: (s, areaStats) => {
      s.areaStats = areaStats;
      s.loaded = true;
    },
    setPickedIdx: (s, _) => s.pickedIdx = _,
  },
  actions: {
    async fetchAllData({ commit }) {
      console.time('load');
      await formerData.load();
      await fetchAllAreaStat().then(values => {
        commit('saveAllData', values);
        commit('setDataTime', DateRange[0]);
      });
      console.timeEnd('load');
    }
  },
  modules: {
  }
});

export default store;
