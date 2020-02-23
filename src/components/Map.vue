<template>
  <div class="map">
    <div id="map-container" ref="container" :class="{ 'show-label': showLabel }"></div>
    <MapLegend class="map-legend" :zoom="zoom" :style="{opacity: (3 - zoom)}" />
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
#map-container {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>

<style>
#map-container .mapboxgl-marker {
  display: none;
}

#map-container.show-label .mapboxgl-marker {
  display: initial;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';
import { VisMap } from '../constants';
import MapLegend from '../components/MapLegend';

export default {
  name: 'Map',
  components: {
    MapLegend
  },
  data: () => ({
    showLabel: false,
    zoom: 2,
  }),
  mounted () {
    this.mapbox();
  },
  computed: {
    ...mapState(['mapType', 'paneSize']),
    ...mapGetters(['visiblePoints'])
  },
  watch: {
    paneSize() {
      this.map && this.$nextTick(() => this.map.resize());
    },
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
              areaName: p.areaName
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
              areaName: p.areaName
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
        minZoom: 2,
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

      map.on('zoom', (e) => {
        this.zoom = e.target.getZoom();
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
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                // 2,
                // ['interpolate', ['linear'], ['ln', ['+', ['get', 'count'], 1]],
                //   1, 1,
                //   9.21, 15
                // ],
                2,
                ['interpolate', ['linear'], ['get', 'count'],
                  ...VisMap.Domains.reduce((arr, d, i) => {
                    arr.push(d, VisMap.Radii[i]);
                    return arr;
                  }, [])
                ],
                10,
                ['interpolate', ['linear'], ['get', 'count'],
                  ...VisMap.Domains.reduce((arr, d, i) => {
                    arr.push(d, VisMap.Radii[i] * 4);
                    return arr;
                  }, [])
                ]
              ],
              'circle-color': [
                'interpolate-hcl',
                ['linear'],
                ['get', 'count'],
                ...VisMap.Domains.reduce((arr, d, i) => {
                  arr.push(d, VisMap.Colors[i]);
                  return arr;
                }, [])
              ],
              'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2, 0.8,
                6, 1
              ],
              'circle-stroke-width': 0.1,
              'circle-stroke-color': '#fff',
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
              ...VisMap.Domains.reduce((arr, d, i) => {
                arr.push(d, VisMap.Colors[i]);
                return arr;
              }, [])
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
          this.$store.commit('setPickedName', features[0].properties.areaName);
        } else {
          this.$store.commit('setPickedName', null);
        }
      });
    },
  }
}
</script>
