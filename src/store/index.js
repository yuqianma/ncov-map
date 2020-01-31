import Vue from 'vue';
import Vuex from 'vuex';
import { evalJsVar } from '../util';
import { processAreaStat } from './processAreaStat';

Vue.use(Vuex);

const AreaStatIndex = window.AreaStatIndex;

function getTimeFromAreaStatFileName(filename) {
  return +filename.replace(/[^\d]/g, '');
}

const LatestTime = getTimeFromAreaStatFileName(AreaStatIndex[AreaStatIndex.length - 1]);

const store = new Vuex.Store({
  state: {
    cityPoints: [],
    pickedIdx: -1,
    dataTime: null,
  },
  getters: {
    visiblePoints({ cityPoints }) {
      return cityPoints;
    }
  },
  mutations: {
    updateCityPoints: (s, areaStat) => {
      try {
        s.cityPoints = processAreaStat(areaStat);
      } catch (e) {
        console.log(areaStat);
      }
      s.dataTime = areaStat.time;
    },
    setPickedIdx: (s, _) => (s.pickedIdx = _),
  },
  actions: {
    fetchAllAreaStat({ commit }) {
      Promise.all(
        AreaStatIndex.map(filename => {
          return fetch(`dxy/${filename}`).then(res => res.text()).then(text => {
            const v = evalJsVar(text);
            v.time = getTimeFromAreaStatFileName(filename);
            return v;
          });
        })
      ).then(res => {
        res.forEach((d, i) => {
          // const time = dayjs(d.time).format('YYYY-MM-DD HH:mm');
          // const num = d.reduce((n, p) => n + p.confirmedCount, 0);
          // console.log(time, num);

          setTimeout(() => {
            commit('updateCityPoints', d);
          }, 100 * i);
        });
      });
    }
  },
  modules: {
  }
});

(() => {
  const d = window.getAreaStat;
  d.time = LatestTime;
  store.commit('updateCityPoints', d);
})();

export default store;
