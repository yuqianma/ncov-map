<template>
  <div class="home" :class="[size, playing ? 'disable-interaction' : '']">
    <div class="geo-map"><Map /></div>
    <div class="pane">
      <div class="handle" @click="toggleSize"></div>
      <Spinner v-if="loading"/>
      <div v-if="loaded" class="control">
        <div class="type-control">
          Map type:
          <input type="radio" id="circle" name="mapType" value="circle" v-model="mapType"/>
          <label for="circle">circle</label>
          <input type="radio" id="3D" name="mapType" value="3D" v-model="mapType"/>
          <label for="3D">3D</label>
        </div>
        <div class="player">
          <span class="prev">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/><path d="M0 0h24v24H0V0z" fill="none"/></svg>
          </span>
          <span class="play" @click="togglePlay">
            <svg v-if="!playing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
            <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </span>
          <span class="next">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path d="M0 0h24v24H0V0z" fill="none"/></svg>
          </span>
        </div>
      </div>
      <TimeMinimap v-if="loaded" />
      <span class="update-time">update: {{updateTime}}</span>
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

.disable-interaction {
  pointer-events: none;
}

.point-info {
  position: fixed;
  padding: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #888;
}

.geo-map {
  position: relative;
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
  font-size: 10px;
  color: #888;
  /* outline: 1px solid #000; */
}

.small .handle::after {
  content: "▲";
}

.large .handle::after {
  content: "▼";
}

.control {
  /* height: 34px; */
  width: 100%;
  /* outline: 1px solid #e99; */
  display: flex;
  justify-content: space-between;
}

.type-control {
  font-size: 14px;
  vertical-align: middle;
  line-height: 22px;
}
.type-control input[type="radio"] {
  width: 10px;
  height: 10px;
}

.player span {
  box-sizing: border-box;
  display: inline-block;
  margin-left: 5px;
  width: 22px;
  height: 22px;
  background: transparent;
  border: 1px solid #888;
  border-radius: 3px;
}

.player span svg {
  fill: #333;
  width: 20px;
  height: 20px;
}

.player .play {
  pointer-events: all;
}

.disable-interaction .player span.prev svg {
  fill: #ccc;
}

.disable-interaction .player span.next svg {
  fill: #ccc;
}

.update-time {
  position: fixed;
  bottom: 0;
  font-size: 10px;
  color: #888;
  align-self: start;
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
    ...mapState(['pickedName', 'dataTime', 'playing']),
    ...mapState({ size: 'paneSize' }),
    loading() {
      return this.$store.state.loadState === 'loading';
    },
    loaded() {
      return this.$store.state.loadState === 'loaded';
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
    },
    mapType: {
      get () {
        return this.$store.state.mapType;
      },
      set (v) {
        this.$store.commit('setMapType', v);
      }
    }
  },
  methods: {
    toggleSize() {
      const nextSize = this.size === 'small' ? 'large' : 'small';
      this.$store.commit('setPaneSize', nextSize)
    },
    togglePlay() {
      this.$store.commit('togglePlay');
    }
  }
}
</script>
