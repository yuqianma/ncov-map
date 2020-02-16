<template>
  <div id="map-container" ref="container" :class="{ 'show-label': showLabel }"></div>
</template>

<style>
#map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 150px);
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
      if (this.mapType === 'circle') {
        this.map.getSource('points').setData(this.dataToPointFeature(points));
      } else {
        this.map.getSource('polygons').setData(this.dataToPolygonFeature(points));
      }
    },
    mapType(type) {
      const map = this.map;
      if (type === 'circle') {
        map.getSource('points').setData(this.dataToPointFeature(this.visiblePoints));
        map.setLayoutProperty('ncov-circle', 'visibility', 'visible');
        map.setLayoutProperty('ncov-3d', 'visibility', 'none');
        map.easeTo({
          pitch: 0
        });
      } else {
        map.getSource('polygons').setData(this.dataToPolygonFeature(this.visiblePoints));
        map.setLayoutProperty('ncov-3d', 'visibility', 'visible');
        map.setLayoutProperty('ncov-circle', 'visibility', 'none');
        map.easeTo({
          pitch: 60
        });
      }
    }
  },
  methods: {
    dataToPointFeature(points) {
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
    dataToPolygonFeature(points) {
      const halfSize = 0.15;
      return {
        "type": "FeatureCollection",
        "features": points.map((p, i) => {
          const [x, y] = p.coordinates;
          return {
            type: 'Feature',
            properties: {
              count: p.confirmedCount,
              areaName: p.areaName,
              idx: i
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [x - halfSize, y + halfSize],
                [x - halfSize, y - halfSize],
                [x + halfSize, y - halfSize],
                [x + halfSize, y + halfSize],
                [x - halfSize, y + halfSize]
              ]]
            }
          }
        })
      }
    },
    mapbox() {
      const map = new mapboxgl.Map({
        container: this.$refs.container,
        center: [104.299012, 34.781634], // starting position
        zoom: 2, // starting zoom
        antialias: true,
        style: {
          'version': 8,
          'sources': {
            'raster-tiles': {
              'type': 'raster',
              'tiles': [
                'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
              ],
              'tileSize': 256
            },
            'raster-boundaries': {
              'type': 'raster',
              'tiles': [
                'https://map.geoq.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/tile/{z}/{y}/{x}'
              ],
              'tileSize': 128
            },
            points: {
              type: 'geojson',
              data: this.dataToPointFeature(this.visiblePoints)
            },
            polygons: {
              type: 'geojson',
              data: this.dataToPolygonFeature(this.visiblePoints)
            }
          },
          'layers': [
            {
              'id': 'tiles',
              'type': 'raster',
              'source': 'raster-tiles',
              'minzoom': 0,
              'maxzoom': 10,
              'paint': {
                'raster-saturation': -1,
                'raster-brightness-min': 0.3,
                'raster-contrast': 0.2,
                'raster-opacity': 0.5
              }
            },
            {
              'id': 'boundaries',
              'type': 'raster',
              'source': 'raster-boundaries',
              'maxzoom': 4,
              'paint': {
                'raster-saturation': -1,
                'raster-brightness-min': 0.5,
                // 'raster-contrast': 0.5
              }
            }
          ]
        },
      });

      window._map = map;
      this.map = map;

      map.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true
      }), 'bottom-right');

      map.on('load', () => {
        map.addLayer(
          {
            'id': 'ncov-circle',
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
              // 'circle-opacity': [
              //   'interpolate',
              //   ['linear'],
              //   ['zoom'],
              //   4, 0,
              //   6, 1
              // ],
              'circle-stroke-width': 0.1,
              'circle-stroke-color': '#888',
              // 'circle-stroke-opacity': [
              //   'interpolate',
              //   ['linear'],
              //   ['zoom'],
              //   4, 0,
              //   6, 1
              // ]
            }
          }
        );

        map.addLayer({
          id: 'ncov-3d',
          type: 'fill-extrusion',
          source: 'polygons',
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'count'],
              1,
              'rgb(253,219,199)',
              // 50,
              // 'rgb(209,229,240)',
              // 100,
              // 'rgb(253,219,199)',
              // 500,
              // 'rgb(239,138,98)',
              1000,
              'rgb(178,24,43)'
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-height': [
              '*',
              ['get', 'count'],
              1e6 / 1000
            ]
          }
        });

        map.setLayoutProperty('ncov-3d', 'visibility', 'none');

      });

      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point);

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
