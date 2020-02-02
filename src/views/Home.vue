<template>
  <div class="home">
    <div class="title">确诊数量</div>
    <div class="point-info">{{pointInfo}}</div>
    <div class="pane">
      <div class="time">{{formattedDataTime}}</div>
      <Spinner v-if="loading" />
      <div v-if="!loaded && !loading" class="load" v-on:click="load">
        查看 {{formattedDateMin}}~{{formattedDateMax}} 数据
      </div>
      <input v-if="loaded" type="range" :min="dateMin" :max="dateMax" v-model="dataTime" />
      <div v-if='loaded' class="range">
        {{formattedDateMin}}
        ~
        {{formattedDateMax}}
      </div>
      <div class="control">
        <button v-on:click="toggleMapType">{{mapType}}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  position: fixed;
  top: 5px;
  right: 0;
  padding: 5px;
  background: #2c3e50;
  color: #ccc;
  border-radius: 5px 0 0 5px;
}

.point-info {
  position: fixed;
  padding: 5px;
  font-weight: bolder;
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
    ...mapState(['mapType', 'loaded']),
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
      return `${point.areaName}: ${point.confirmedCount}`;
    }
  },
  methods: {
    async load() {
      this.loading = true;
      await this.$store.dispatch('fetchAllData');
      this.loading = false;
    },
    toggleMapType() {
      if (this.mapType === 'heatmap') {
        this.$store.commit('setMapType', 'circle');
      } else {
        this.$store.commit('setMapType', 'heatmap');
      }
    }
  }
}
</script>
