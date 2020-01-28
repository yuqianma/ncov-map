import Vue from 'vue';
import Vuex from 'vuex';
import { evalJsVar } from '../util';
import { processAreaStat } from './processAreaStat';

Vue.use(Vuex);

const AreaStatIndex = window.AreaStatIndex;
AreaStatIndex.shift();

function getTimeFromAreaStatFileName(filename) {
  return +filename.replace(/[^\d]/g, '');
}

export default new Vuex.Store({
  state: {
    cityPoints: processAreaStat(window.getAreaStat),
    pickedIdx: -1,
    dataTime: getTimeFromAreaStatFileName(AreaStatIndex.slice(-1)[0]),
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
          const time = dayjs(d.time).format('YYYY-MM-DD HH:mm');
          const num = d.reduce((n, p) => n + p.confirmedCount, 0);
          console.log(time, num);

          setTimeout(() => {
            commit('updateCityPoints', d);
          }, 100 * i);
        });
      });
    }
  },
  modules: {
  }
})
