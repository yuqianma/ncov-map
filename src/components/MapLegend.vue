<template>
  <div ref="container"></div>
</template>

<style scoped>
div {
  pointer-events: none;
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
  "width": 150,
  "height": 150,
  "padding": 0,
  // "autosize": "none",

  "data": [
    {
      "name": "domains",
      "values": VisMap.Domains
    },
    {
      "name": "radius",
      "values": VisMap.Radii,
      "transform": [
        {"type": "formula", "as": "area", "expr": "pow(scale('zoom', zoom) * datum.data * 2, 2)"}
      ]
    },
    {
      "name": "colors",
      "values": VisMap.Colors
    }
  ],

  "signals": [
    {
      "name": "zoom",
      "value": 2
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
  "legends": [
    {
      "orient": "bottom-left",
      "type": "symbol",
      "size": "size",
      "fill": "color",
      "rowPadding": 0,
      "padding": -18,
      // "clipHeight": 20,
      "values": {"signal": "domain('_size')"},
      "encode": {
        "labels": {
          "update": {
            "text": {"signal": "datum.index === 5 ? '≥' + datum.label : datum.label "}
          }
        }
      }
    }
  ]
}

}
</script>
