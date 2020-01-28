<template>
  <div class="home">
    <div class="info info-time">{{formattedTime}}</div>
    <div class="info info-point">{{pointInfo}}</div>
  </div>
</template>

<style>
.info {
  position: fixed;
}
.info-point {
  top: 2em;
}
</style>

<script>
export default {
  name: 'home',
  computed: {
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
}
</script>
