<template>
  <div id="map-container" ref="container" :class="{ 'show-label': showLabel }"></div>
</template>

<style>
#map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#map-container .mapboxgl-marker {
  display: none;
}

#map-container.show-label .mapboxgl-marker {
  display: initial;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

const DISTANCE = 50e3;

export default {
  name: 'Map',
  data: () => ({
    showLabel: false,
  }),
  mounted () {
    this.mapbox();
  },
  computed: {
    ...mapState(['mapType']),
    ...mapGetters(['visiblePoints'])
  },
  watch: {
    visiblePoints(points) {
      const data = this.pointsToGeoJSON(points);
      this.mapboxglLayer.getGlMap().getSource('points').setData(data);
    },
    mapType(type) {
      if (type === 'heatmap') {
        glmap.setLayoutProperty('ncov-heat', 'visibility', 'visible');
        glmap.setPaintProperty(
          'ncov-point',
          'circle-opacity',
          [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 0,
            6, 1
          ]
        );

        glmap.setPaintProperty(
          'ncov-point',
          'circle-stroke-opacity',
          [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 0,
            6, 1
          ]
        );

      } else {
        glmap.setLayoutProperty('ncov-heat', 'visibility', 'none');
        glmap.setPaintProperty('ncov-point', 'circle-opacity', 1);
        glmap.setPaintProperty('ncov-point', 'circle-stroke-opacity', 1);
      }
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
              count: p.confirmedCount,
              areaName: p.areaName,
              idx: i
            },
            geometry: {
              type: 'Point',
              coordinates: p.coordinates
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
        touchRotate: false,
        touchPitch: false,
        zoomControl: {
          'position'  : {
            bottom: 170,
            right: 20
          },
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
                'maxzoom': 6,
                'paint': {
                  // Increase the heatmap weight based on property count
                  'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'count'],
                    // count is 0 (or less) -> 0
                    1, 0.1,
                    // count is 100 (or greater) -> 1
                    100, 1
                  ],
                  // Increase the heatmap color weight weight by zoom level
                  // heatmap-intensity is a multiplier on top of heatmap-weight
                  'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 1,
                    6, 3
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
                    6, 20
                  ],
                  // Transition from heatmap to circle layer by zoom level
                  'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    4, 1,
                    6, 0
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
                4,
                ['interpolate', ['linear'], ['get', 'count'],
                  1, 2,
                  1000, 20
                ],
                10,
                ['interpolate', ['linear'], ['get', 'count'],
                  1, 5,
                  1000, 100
                ]
              ],
              // Color circle by earthquake magnitude
              'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
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
                4, 0,
                6, 1
              ],
              'circle-stroke-width': 0.1,
              'circle-stroke-color': '#888',
              'circle-stroke-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 0,
                6, 1
              ]
            }
          }
        );

        function createLabel(props) {
          var el = document.createElement('div');
          el.innerHTML = `${props.count}`;
          return el;
        }

        // objects for caching and keeping track of HTML marker objects (for performance)
        var markers = {};
        var markersOnScreen = {};

        function updateMarkers(e) {
          if (glmap.getZoom() > 6) {
            showLabel();
          } else {
            hideLabel();
          }
          
          var newMarkers = {};
          var features = glmap.querySourceFeatures('points');

          // for every feature on the screen, create an HTML marker for it (if we didn't yet),
          // and add it to the map if it's not there already
          for (var i = 0; i < features.length; i++) {
            var coords = features[i].geometry.coordinates;
            var props = features[i].properties;
            var id = props.areaName;

            var marker = markers[id];
            if (!marker) {
              var el = createLabel(props);
              marker = markers[id] = new mapboxgl.Marker({
                  element: el
              }).setLngLat(coords);
            }
            newMarkers[id] = marker;

            if (!markersOnScreen[id]) marker.addTo(glmap);
          }
          // for every marker we've added previously, remove those that are no longer visible
          for (id in markersOnScreen) {
            if (!newMarkers[id]) markersOnScreen[id].remove();
          }
          markersOnScreen = newMarkers;
        }

        const hideLabel = () => this.showLabel = false;

        const showLabel = () => this.showLabel = true;

        // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
        // glmap.on('data', function(e) {
        //     if (e.sourceId !== 'points' || !e.isSourceLoaded) return;

        //     // glmap.on('move', hideLabel);
        //     glmap.on('moveend', updateMarkers);
        //     updateMarkers(e);
        // });
      });

      map.on('click', (e) => {
        const { containerPoint } = e;
        const { x, y } = containerPoint;
        const features = glmap.queryRenderedFeatures([x, y]);

        if (features[0]) {
          this.$store.commit('setPickedIdx', features[0].properties.idx);
        } else {
          this.$store.commit('setPickedIdx', -1);
        }
      });

    },
  }
}
</script>
