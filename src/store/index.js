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
    playing: false,
    showAbout: false,
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
      s.dataTime = Math.max(DateRange[0], Math.min(v, DateRange[1]));
    },
    saveAllData: (s, areaStats) => {
      s.areaStats = areaStats;
      s.loadState = 'loaded';
    },
    setPickedName: (s, _) => s.pickedName = _,
    setMapType: (s, _) => s.mapType = _,
    setPaneSize: (s, _) => s.paneSize = _,
    togglePlay: (s, _) => s.playing = !s.playing,
    setShowAbout: (s, _) => s.showAbout = _,
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
      });
    },
    // TODO
    // refactor store & vega link
    shiftDataDay({ state, commit }, v) {
      store.commit('togglePlay');
      commit('setDataTime', dayjs(state.dataTime).add(v, 'day').endOf('day'));
      Vue.nextTick(() => store.commit('togglePlay'));
    },
  },
  modules: {
  }
});

let timerId = -1;
store.watch(s => s.playing, (v) => {
  if (v) {
    let date = store.state.dataTime;
    const endDate = dayjs(DateRange[1]).endOf('day');
    if (endDate.isSame(date, 'date')) {
      date = DateRange[0];
    }
    date = dayjs(date).endOf('day');
    store.commit('setDataTime', date);
    timerId = setInterval(() => {
      date = date.add(1, 'day').endOf('day');
      if (date <= endDate && store.state.playing) {
        store.commit('setDataTime', date);
      } else {
        clearInterval(timerId);
        store.commit('togglePlay');
      }
    }, 100);
  } else {
    clearInterval(timerId);
  }
});

store.dispatch('fetchAllData').then(() => {
  // console.log(store.getters.incrementalData);
});

export default store;
