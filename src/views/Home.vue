<template>
  <div class="home">
    <div class="info info-point">{{pointInfo}}</div>
    <div class="pane">
      <div class="time">{{formattedDataTime}}</div>
      <Spinner v-if="loading" />
      <div v-if="!loaded && !loading" class="load" v-on:click="load">加载全部数据</div>
      <input v-if="loaded" type="range" :min="dateMin" :max="dateMax" v-model="dataTime" />
      <div class="range">
        {{formattedDateMin}}
        ~
        {{formattedDateMax}}
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  position: fixed;
}

.pane {
  box-sizing: border-box;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  bottom: 0;
  padding: 10px 20px;
  width: 100%;
  height: 150px;
  background: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.2);
}

.pane .time {
  padding: 10px;
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
    formattedDateMin() {
      return dayjs(this.dateMin).format('MM-DD');
    },
    formattedDateMax() {
      return dayjs(this.dateMax).format('MM-DD');
    },
    dataTime: {
      get () {
        return +this.$store.state.dataTime;
      },
      set (v) {
        this.$store.commit('setDataTime', +v);
      }
    },
    formattedDataTime() {
      return dayjs(this.$store.state.dataTime).format('YYYY-MM-DD HH:mm');
    },
    pointInfo() {
      const point = this.$store.getters.visiblePoints[this.$store.state.pickedIdx];
      if (!point) {
        return '';
      }
      let data = point[3];
      if (data.length) {
        data = data[0];
        return `${data.loc.city}: ${point[2]}`;
      }
      return `${data.cityName || data.provinceName}: ${point[2]}`;
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
