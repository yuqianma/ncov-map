<template>
  <div class="home">
    <div class="info info-time">{{formattedTime}}</div>
    <div class="info info-point">{{pointInfo}}</div>
    <div class="pane">
      <Spinner v-if="loading" />
      <div v-if="!loaded && !loading" class="load" v-on:click="load">加载全部数据</div>
      <input v-if="loaded" type="range" :min="dateMin" :max="dateMax" v-model="dataTime" />
    </div>
  </div>
</template>

<style scoped>
.info {
  position: fixed;
}
.info-point {
  top: 2em;
}

.pane {
  box-sizing: border-box;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  padding: 40px 5px;
  width: 100%;
  height: 150px;
  background: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.2);
}

.pane input[type="range"] {
  width: 100%;
}

.pane .load {
  margin: 0 auto;
  background: #0b9;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
}
</style>

<script>
import { DateRange } from '../constants';
import { mapState } from 'vuex';
import Spinner from '../components/Spinner';

export default {
  name: 'home',
  components: {
    Spinner
  },
  data: () => ({
    dateMin: +DateRange[0],
    dateMax: +DateRange[1],
    loading: false,
  }),
  computed: {
    ...mapState(['loaded']),
    dataTime: {
      get () {
        return +this.$store.state.dataTime;
      },
      set (v) {
        this.$store.commit('setDataTime', +v);
      }
    },
    formattedTime() {
      return dayjs(this.$store.state.dataTime).format('YYYY-MM-DD HH:mm');
    },
    pointInfo() {
      const point = this.$store.getters.visiblePoints[this.$store.state.pickedIdx];
      if (!point) {
        return '';
      }
      const data = point[3];
      console.log(data);
      return `${data.cityName || data.provinceName}: ${data.confirmedCount}`;
    }
  },
  methods: {
    async load() {
      this.loading = true;
      await this.$store.dispatch('fetchAllData');
      this.loading = false;
    }
  }
}
</script>
