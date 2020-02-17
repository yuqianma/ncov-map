<template>
  <div class="home">
    <!-- <div class="title">确诊数量</div> -->
    <div class="point-info">{{pointInfo}}</div>
    <div class="pane" :class="size">
      <div class="handle" :class="size" @click="toggleSize"></div>
      <div class="time">{{formattedDataTime}}</div>
      <Spinner v-if="loading" style="flex-grow: 1;"/>
      <TimeMinimap v-if="loaded" />
      <span class="update-time">update: {{updateTime}}</span>
      <!-- <div class="control">
        change to
        <button v-on:click="toggleMapType">{{changeType}}</button>
      </div> -->
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
  padding: 10px 15px;
  width: 100%;
  height: 150px;
  background: #fff;
  /* border-radius: 20px 20px 0 0; */
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.2);
}

.pane.large {
  height: 50%;
}

.handle {
  position: absolute;
  top: -10px;
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  color: #888;
  /* outline: 1px solid #000; */
}

.handle.small::after {
  content: "▲";
}

.handle.large::after {
  content: "▼";
}

.pane .time {
  position: absolute;
  align-self: start;
  top: -25px;
}

.update-time {
  font-size: 10px;
  color: #888;
  align-self: start;
}

</style>

<script>
import { DateRange, LatestTime } from '../constants';
import { mapState, mapMutations } from 'vuex';
import Spinner from '../components/Spinner';
import TimeMinimap from '../components/TimeMinimap';

export default {
  name: 'home',
  components: {
    Spinner,
    TimeMinimap
  },
  data: () => ({
    updateTime: dayjs(LatestTime).format('YYYY-MM-DD HH:mm'),
  }),
  computed: {
    ...mapState({
      mapType: 'mapType',
      size: 'paneSize'
    }),
    loading() {
      return this.$store.state.loadState === 'loading';
    },
    loaded() {
      return this.$store.state.loadState === 'loaded';
    },
    changeType() {
      return this.mapType === 'circle' ? '3D' : 'circle';
    },
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
      return dayjs(this.$store.state.dataTime).format('MM-DD');
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
    toggleSize() {
      const nextSize = this.size === 'small' ? 'large' : 'small';
      this.$store.commit('setPaneSize', nextSize)
    },
    toggleMapType() {
      this.$store.commit('setMapType', this.changeType);
    }
  }
}
</script>
