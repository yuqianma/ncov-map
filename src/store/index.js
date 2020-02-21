import Vue from 'vue';
import Vuex from 'vuex';
import { evalJsVar, getTimeFromAreaStatFileName } from '../util';
import { LatestTime, SeparateDate, DateRange } from '../constants';
import { processAreaStat } from './processAreaStat';
import { formerData } from './processFormerData';
import { getIncrementalData } from './getIncrementalData';
// import { aggregateData } from './aggregateData';

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

const store = new Vuex.Store({
  state: {
    mapType: 'circle',
    areaStats: [],
    pickedName: null, 
    dataTime: LatestTime,
    loadState: null,
    paneSize: 'small',
  },
  getters: {
    visiblePoints({ areaStats, dataTime }) {
      if (dataTime >= LatestTime) {
        // areaStats
        return processAreaStat(window.getAreaStat);
      } else if (dataTime > SeparateDate) {
        let idx = areaStats.findIndex(a => a.time > +dataTime);
        idx = Math.max(0, Math.min(idx - 1, areaStats.length));
        return processAreaStat(areaStats[idx]);
      } else {
        return formerData.getVisiblePointsByDate(dataTime);
      } 
    },
    // timeSeriesData({ areaStats }) {
    //   return aggregateData({ formerData, areaStats });
    // },
    incrementalData({ areaStats }) {
      if (!areaStats.length) {
        return null;
      }
      return getIncrementalData({ dateFrom: DateRange[0], formerData, areaStats });
    },
  },
  mutations: {
    setLoading: (s) => {
      s.loadState = 'loading';
    },
    setDataTime: (s, v) => {
      s.dataTime = v >= LatestTime ? LatestTime : v;
    },
    saveAllData: (s, areaStats) => {
      s.areaStats = areaStats;
      s.loadState = 'loaded';
    },
    setPickedName: (s, _) => s.pickedName = _,
    setMapType: (s, _) => s.mapType = _,
    setPaneSize: (s, _) => s.paneSize = _,
  },
  actions: {
    async fetchAllData({ state, commit }) {
      if (state.loadState) {
        return;
      }
      commit('setLoading');
      console.time('load');
      await formerData.load();
      await fetchAllAreaStat().then(values => {
        console.timeEnd('load');
        commit('saveAllData', values);
        // commit('setDataTime', DateRange[0]);
      });
    }
  },
  modules: {
  }
});

store.dispatch('fetchAllData').then(() => {
  // console.log(store.getters.incrementalData);
});

export default store;
