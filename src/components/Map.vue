<template>
  <div ref="container"></div>
</template>

<style scoped>
div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ccc;
}
</style>

<script>
import { mapGetters } from 'vuex';

const DISTANCE = 30e3;

export default {
  name: 'Map',
  mounted () {
    const map = new maptalks.Map(this.$refs.container, {
      center: [104.299012 + 4, 34.781634],
      zoom: 4,
      minZoom: 3,
      zoomControl: {
        'position'  : 'top-right',
        'slider'    : false,
        'zoomLevel' : false
      },
      // scaleControl: {
      //   'position'  : 'bottom-right',
      //   'maxWidth': 100,
      //   'metric': true
      // },
      attribution: {
        // content: ''
      },
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy;<a href="http://osm.org">OSM</a>, &copy;<a href="https://carto.com/">CARTO</a>'
      }),
    });
    map.setMaxExtent([73.502355, 16, 135.09567, 53.563269]);
    this.map = map;

    window._map = map;

    this.eventLayer = new maptalks.VectorLayer('v').addTo(map);

    const pixel = this.map.distanceToPixel(DISTANCE).width | 0;

    const ColorMap = [
      [       0,          9,        99,       499,      999,      1000],
      ["#ffffff", "#fca589", "#fb7f60", "#f6573f", "#e13128", "#c1181b"]
    ];
    this.heatLayer = new maptalks.HeatLayer(
      'heat',
      this.visiblePoints,
      {
        radius: pixel,
        blur: pixel,
        gradient: ColorMap[0].reduce((o, v, i) => { o[v / 1000] = ColorMap[1][i]; return o; }, {}),
      }
    ).addTo(map);

    map.on('zooming zoomend', ({ to }) => {
      const pixel = this.map.distanceToPixel(DISTANCE).width | 0;
      this.heatLayer.config({
        radius: pixel,
        blur: pixel,
      });
    });

    this.appendEventCircles(this.visiblePoints);
  },
  computed: {
    ...mapGetters(['visiblePoints'])
  },
  watch: {
  },
  methods: {
    appendEventCircles(points) {
      const pick = (e) => {
        this.$store.commit('setPickedIdx', e.target.options.idx);
      }
      this.eventLayer.addGeometry(points.map((p, i) => {
        const circle = new maptalks.Circle([p[0], p[1]], DISTANCE, {
            idx: i,
            symbol: {
              lineWidth: 0,
              // opacity: 0
            }
        });
        circle.on('click', pick);
        return circle;
      }));
    }
  }
}
</script>
