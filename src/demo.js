
const vm = window.vm;
const view = window._view;
const map = window._map;

const delay = timeout => new Promise(res => setTimeout(res, timeout));

window.demo = async function () {
  vm.$store.state.mapType = '3D';

  // await new Promise(res => {
  //   map.on('moveend', function handler() {
  //     res();
  //     map.off(handler);
  //   });
  // });

  map.jumpTo({
    bearing: 30,
    zoom: 3,
    pitch: 60,
    center: [114.305392, 30.593098]
  });

  setTimeout(() => {
    map.easeTo({
      bearing: -30,
      duration: 20000,
      easing(t) {
        return t;
      }
    });
  
    vm.$store.state.playing = true;
  });
  
}
