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
    this.mapbox();
  },
  computed: {
    ...mapGetters(['visiblePoints'])
  },
  watch: {
    visiblePoints(points) {
      const data = this.pointsToGeoJSON(points);
      this.mapboxglLayer.getGlMap().getSource('points').setData(data);
    }
  },
  methods: {
    pointsToGeoJSON(points) {
      return {
        "type": "FeatureCollection",
        "features": points.map((p, i) => {
          return {
            type: 'Feature',
            properties: {
              num: p[2],
              idx: i,
            },
            geometry: {
              type: 'Point',
              coordinates: [p[0], p[1]]
            }
          }
        })
      }
    },
    mapbox() {
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

      this.mapboxglLayer = new maptalks.MapboxglLayer('heatmap', {
        container: 'front',
        glOptions: {
          interactive: false,
          style: {
            version: 8,
            sources: {
              points: {
                type: 'geojson',
                data: this.pointsToGeoJSON(this.visiblePoints)
              }
            },
            layers: [{
                'id': 'ncov-heat',
                'type': 'heatmap',
                'source': 'points',
                'maxzoom': 9,
                'paint': {
                  // Increase the heatmap weight based on property num
                  'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'num'],
                    // num is 0 (or less) -> 0
                    1, 0.1,
                    // num is 100 (or greater) -> 1
                    100, 1
                  ],
                  // Increase the heatmap color weight weight by zoom level
                  // heatmap-intensity is a multiplier on top of heatmap-weight
                  'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 1,
                    9, 3
                  ],
                  // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                  // Begin color ramp at 0-stop with a 0-transparancy color
                  // to create a blur-like effect.
                  'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(33,102,172,0)',
                    0.2,
                    'rgb(103,169,207)',
                    0.4,
                    'rgb(209,229,240)',
                    0.6,
                    'rgb(253,219,199)',
                    0.8,
                    'rgb(239,138,98)',
                    1,
                    'rgb(178,24,43)'
                  ],
                  // Adjust the heatmap radius by zoom level
                  'heatmap-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    1, 2,
                    9, 30
                  ],
                  // Transition from heatmap to circle layer by zoom level
                  'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7, 1,
                    9, 0
                  ]
                }
            }]
          }
        }
      }).addTo(map);

      this.glmap = this.mapboxglLayer.getGlMap();

      window.glmap = this.glmap;

      glmap.on('load', () => {
        glmap.addLayer(
            {
                'id': 'ncov-point',
                'type': 'circle',
                'source': 'points',
                // 'minzoom': 7,
                'paint': {
                    // Size circle radius by earthquake magnitude and zoom level
                    'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      7,
                      ['interpolate', ['linear'], ['get', 'num'],
                        1, 2,
                        100, 10
                      ],
                      10,
                      ['interpolate', ['linear'], ['get', 'num'],
                        1, 10,
                        100, 50
                      ]
                    ],
                    // Color circle by earthquake magnitude
                    'circle-color': [
                      'interpolate',
                      ['linear'],
                      ['get', 'num'],
                      1,
                      'rgba(33,102,172,0)',
                      10,
                      'rgb(103,169,207)',
                      50,
                      'rgb(209,229,240)',
                      100,
                      'rgb(253,219,199)',
                      500,
                      'rgb(239,138,98)',
                      1000,
                      'rgb(178,24,43)'
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'circle-opacity': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      7, 0,
                      8, 1
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'black',
                    'circle-stroke-opacity': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      7, 0,
                      8, 1
                    ]
                }
            }
        );

        // glmap.setLayoutProperty('ncov-point', 'visibility', 'none');
      });

      map.on('click', (e) => {
        const { containerPoint } = e;
        const { x, y } = containerPoint;
        const features = glmap.queryRenderedFeatures([x, y]);

        if (features[0]) {
          this.$store.commit('setPickedIdx', features[0].properties.idx);
        }
      });

    },
  }
}
</script>
