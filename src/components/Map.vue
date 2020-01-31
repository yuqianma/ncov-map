<template>
  <div ref="container"></div>
</template>

<style scoped>
div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<script>
import { mapGetters } from 'vuex';

const DISTANCE = 50e3;

// const DXYColorMap = [
//   [       0,          9,        99,       499,      999,      1000],
//   ["#ffffff", "#fca589", "#fb7f60", "#f6573f", "#e13128", "#c1181b"]
// ];
// const DXYGradient = ColorMap[0].reduce((o, v, i) => { o[v / 1000] = ColorMap[1][i]; return o; }, {})

export default {
  name: 'Map',
  mounted () {
    const map = new maptalks.Map(this.$refs.container, {
      center: [104.299012, 34.781634],
      // center: [114.305392, 30.593098],
      zoom: 3,
      minZoom: 3,
      maxZoom: 10,
      zoomControl: {
        'position'  : 'top-right',
        'slider'    : false,
        'zoomLevel' : false
      },
      layers: [
        // new maptalks.TileLayer('carto', {
        //   urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        //   subdomains: ['a','b','c','d'],
        //   attribution: '&copy;<a href="http://osm.org">OSM</a>, &copy;<a href="https://carto.com/">CARTO</a>',
        // }),
        // new maptalks.TileLayer('amap', {
        //   urlTemplate: 'http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
        //   subdomains: ['1', '2', '3', '4'],
        //   attribution: '&copy;Amap',
        //   cssFilter: 'sepia(100%) grayscale(100%)'
        // }),
        new maptalks.TileLayer('tile', {
          urlTemplate: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
          maxAvailableZoom: 10,
          cssFilter: 'sepia(100%) grayscale(100%)',
          // cssFilter: 'invert(90%)',
          opacity: 0.5,
        }),
        new maptalks.TileLayer('boudaries', {
          urlTemplate: 'https://map.geoq.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/tile/{z}/{y}/{x}',
          maxAvailableZoom: 8,
          cssFilter: 'grayscale(100%)',
          opacity: 0.5,
        }),
      ]
    });
    map.setMaxExtent([73.502355, 16, 135.09567, 53.563269]);
    this.map = map;

    window._map = map;

    this.eventLayer = new maptalks.VectorLayer('v').addTo(map);

    const pixel = this.map.distanceToPixel(DISTANCE).width;

    this.heatLayer = new maptalks.HeatLayer(
      'heat',
      this.visiblePoints,
      {
        radius: pixel,
        blur: pixel,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        },
        // gradient: {
        //   0.5: 'blue',
        //   1.0: 'magenta'
        // },
        // gradient: {
        //   // ["#5d01a6", "#9c179e", "#cb4779", "#ed7953", "#fdb32f"]
        //   0.4: "#5d01a6",
        //   0.6: "#9c179e",
        //   0.7: "#cb4779",
        //   0.8: "#ed7953",
        //   1.0: "#fdb32f"
        // }
      }
    ).addTo(map);

    map.on('zoomend', ({ to }) => {
      const pixel = this.map.distanceToPixel(DISTANCE).width;
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
    visiblePoints(points) {
      this.heatLayer.setData(points);
    }
  },
  methods: {
    appendEventCircles(points) {
      let lastTarget = null;
      const pick = (e) => {
        lastTarget && lastTarget.updateSymbol({
          lineWidth: 0
        });
        e.target.updateSymbol({
          lineWidth: 2
        });
        lastTarget = e.target;
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
