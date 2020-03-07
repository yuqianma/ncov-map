<template>
  <div ref="container"></div>
</template>

<style scoped>
div {
  pointer-events: none;
  margin-left: 5px;
}
</style>

<script>
import { VisMap } from '../constants';

export default {
  name: 'MapLegend',
  props: ['zoom'],
  mounted () {
    this.initChart();
  },
  watch: {
    zoom(v) {
      this.view && this.view.signal('zoom', v).runAsync();
    }
  },
  methods: {
    initChart() {
      const container = this.$refs.container;
      if (this.view || !container) {
        return;
      }

      const spec = genSpec();
      const view = new vega.View(vega.parse(spec), {
        renderer: 'svg',
        container,
        hover: true
      });
      // view.logLevel(vega.Info);
      view.runAsync();

      this.view = view;

      window._legend = view;
    }
  }
}

function genSpec() {
return {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 200,
  "height": 200,
  "padding": 0,
  "data": [
    {
      "name": "domains",
      "values": [1, 10, 100, 500, 5000, 10000],
      "transform": [
        {"type": "identifier", "as": "id"}
      ]
    },
    {"name": "r_domains", "values": [10000, 5000, 500, 100, 10, 1]},
    {
      "name": "radius",
      "values": [1, 2, 4, 8, 10, 15],
      "transform": [
        {
          "type": "formula",
          "as": "area",
          "expr": "pow(scale('zoom', zoom) * datum.data * 2, 2)"
        }
      ]
    },
    {
      "name": "colors",
      "values": [
        "#b1e5eb",
        "#90dbfc",
        "#e170c4",
        "#eb1d78",
        "#ae1233",
        "#550000"
      ]
    }
  ],
  "signals": [
    {
      "name": "zoom", "value": 2
    },
    {
      "name": "max_diameter",
      "update": "sqrt(peek(range('size')))"
    }
  ],
  "scales": [
    {
      "name": "zoom",
      "domain": [2, 10],
      "range": [1, 4],
      "zero": false,
      "nice": false
    },
    {
      "name": "_size",
      "type": "ordinal",
      "domain": {"data": "domains", "field": "data"},
      "range": {"data": "radius", "field": "area"}
    },
    {
      "name": "size",
      "type": "linear",
      "domain": {"signal": "domain('_size')"},
      "range": {"signal": "range('_size')"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "domains", "field": "data"},
      "range": {"data": "colors", "field": "data"}
    }
  ],

  "marks": [
    {
      "type": "group",
      "encode": {
        "update": {
          "y2": {"value": 200},
          "height": {"signal": "max_diameter"}
        }
      },
      "marks": [
        {
          "type": "symbol",
          "from": {
            "data": "r_domains"
          },
          "clip": {
            "path": "M-15 0 L15 0 L15 200 L-15 200Z"
          },
          "encode": {
            "update": {
              "size": {"scale": "size", "field": "data"},
              "y": {"signal": "sqrt(scale('size', datum.data)) / 2"},
              "fill": {"scale": "color", "field": "data"},
              "stroke": {"value": "#000"},
              "strokeWidth": {"value": 0.1}
            }
          }
        },
        {
          "type": "rule",
          "name": "line",
          "from": {
            "data": "domains"
          },
          "encode": {
            "update": {
              "x2": {"signal": "zoom > 5 ? 30  : datum.id * 20"},
              "y": {"signal": "sqrt(scale('size', datum.data))"},
              "strokeWidth": {"value": 0.5},
              "strokeDash": {"value": [3, 2]},
              "stroke": {"value": "#aaa"}
            }
          }
        },
        {
          "type": "text",
          "from": {
            "data": "line"
          },
          "encode": {
            "update": {
              "x": {"field": "x2"},
              "y": {"field": "y"},
              "baseline": {"signal": "datum.datum.data == 1 ? 'bottom' : 'middle'"},
              "text": {"field": "datum.data"},
              "fill": {"value": "#888"}
            }
          }
        }
      ]
    }
  ]
}

}
</script>
