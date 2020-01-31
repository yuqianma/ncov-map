<template>
  <div id="app">
    <Map />
    <router-view/>
  </div>
</template>

<style>
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>

<script>
import Map from './components/Map';

export default {
  components: {
    Map,
  }
}

</script>
