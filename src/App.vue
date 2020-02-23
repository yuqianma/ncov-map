<template>
  <div id="app">
    <router-view class="blur-box" :class="showAbout ? 'blur' : 'no-blur'"/>
    <div v-if="showAbout" class="about" @click="showAbout = false">
      <About class="content" />
    </div>
  </div>
</template>

<style>
html, body, #app {
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

<style scoped>
.blur-box {
  transition: filter 0.3s;
}

.blur {
  filter: blur(2px) contrast(50%);
}

.no-blur {
  filter: blur(0);
}

.about {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about .content {
  width: 80%;
  height: 80%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: auto;
}
</style>

<script>
import About from './components/About';

export default {
  components: {
    About
  },
  computed: {
    showAbout: {
      get () {
        return this.$store.state.showAbout;
      },
      set (v) {
        this.$store.commit('setShowAbout', v);
      }
    }
  }
}
</script>
