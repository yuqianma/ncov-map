<template>
  <div class="home">
    <div class="info-card">{{info}}</div>
  </div>
</template>

<style>
.info-card {
  position: fixed;
}
</style>

<script>
export default {
  name: 'home',
  computed: {
    info() {
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
