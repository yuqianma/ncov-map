
const vm = window.vm;
const view = window._view;
const map = window._map;

const delay = timeout => new Promise(res => setTimeout(res, timeout));

function reset() {
  vm.$store.state.mapType = '3D';

  // await new Promise(res => {
  //   map.on('moveend', function handler() {
  //     res();
  //     map.off(handler);
  //   });
  // });

  map.jumpTo({
    bearing: 30,
    zoom: 3.5,
    pitch: 60,
    center: [114.305392, 30.593098]
  });
}

async function run() {  
  setTimeout(() => {
    map.easeTo({
      bearing: -70,
      duration: 14000,
      easing(t) {
        return t;
      }
    });
  
    vm.$store.state.playing = true;
  });
}

window.demo = { reset, run };
