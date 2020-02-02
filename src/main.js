import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

if (process.env.NODE_ENV === 'development') {
  window.vm = vm;
  document.querySelector('title').textContent += ' DEV';
}
