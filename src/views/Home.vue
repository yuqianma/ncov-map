<template>
  <div class="home" :class="size">
    <div class="geo-map"><Map /></div>
    <div class="pane">
      <div class="handle" @click="toggleSize"></div>
      <Spinner v-if="loading" style="flex-grow: 1;"/>
      <TimeMinimap v-if="loaded" />
      <span class="update-time">update: {{updateTime}}</span>
      <div class="type-control">
        change to
        <button v-on:click="toggleMapType">{{changeType}}</button>
      </div>
    </div>
    <div class="point-info">
      <div>{{dataDate}} 累计确诊</div>
      <div>{{pointInfo}}</div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.point-info {
  position: fixed;
  padding: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #888;
}

.geo-map {
  height: calc(100% - 150px);
}
.large .geo-map {
  height: 50%;
}

.pane {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px 15px 15px;
  width: 100%;
  height: 150px;
  background: #fff;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.2);
}

.large .pane {
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

.small .handle::after {
  content: "▲";
}

.large .handle::after {
  content: "▼";
}

.update-time {
  position: fixed;
  bottom: 0;
  font-size: 10px;
  color: #888;
  align-self: start;
}

.type-control {
  position: absolute;
  top: -1.8em;
  left: 5px;
}

</style>

<script>
import { DateRange, LatestTime } from '../constants';
import { mapState, mapMutations } from 'vuex';
import Map from '../components/Map';
import Spinner from '../components/Spinner';
import TimeMinimap from '../components/TimeMinimap';

export default {
  name: 'home',
  components: {
    Map,
    Spinner,
    TimeMinimap
  },
  data: () => ({
    updateTime: dayjs(LatestTime).format('YYYY-MM-DD HH:mm'),
  }),
  computed: {
    ...mapState(['mapType', 'pickedName', 'dataTime']),
    ...mapState({ size: 'paneSize' }),
    loading() {
      return this.$store.state.loadState === 'loading';
    },
    loaded() {
      return this.$store.state.loadState === 'loaded';
    },
    changeType() {
      return this.mapType === 'circle' ? '3D' : 'circle';
    },
    dataDate() {
      return dayjs(this.dataTime).format('MM-DD');
    },
    pointInfo() {
      const { visiblePoints } = this.$store.getters;
      const point = this.pickedName && visiblePoints.find(p =>p.areaName === this.pickedName);
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
