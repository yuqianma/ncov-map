<template>
  <div ref="wrapper" class="wrapper">
    <div ref="container" class="container"></div>
    <label class="include-hubei">
      新增确诊<br>
      包含湖北省
      <input type="checkbox" v-model="includeHubei"/>
    </label>
  </div>
</template>

<style scoped>
.wrapper {
  user-select: none;
  width: 100%;
  height: 100%;
  /* background: #eee; */
}

.include-hubei {
  position: absolute;
  bottom: 35px;
  left: 15px;
  font-size: 10px;
  vertical-align: middle;
  /* background: #fff; */
}

.include-hubei input {
  margin: 0;
  width: 12px;
  height: 12px;
  vertical-align: middle;
}
</style>

<style>
.container .mark-text.role-mark{
  paint-order: stroke;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'TimeMinimap',
  data: () => ({
    includeHubei: true,
  }),
  mounted () {
    this.initChart();
  },
  computed: {
    ...mapState(['paneSize', 'dataTime', 'playing']),
    ...mapGetters(['incrementalData']),
  },
  watch: {
    includeHubei(v) {
      this.view && this.view.signal('includeHubei', v).runAsync();
    },
    paneSize() {
      this.$refs.container.style.display = 'none';
      const { width, height } = this.getContainerSize();
      this.$refs.container.style.display = '';
      this.view && this.view
        .width(width)
        .height(height)
        .runAsync()
    },
    incrementalData(values) {
      this.initChart();
    },
    dataTime(v) {
      if (this.playing) {
        this.view && this.view.signal('indexDate', v).runAsync();
      }
    }
  },
  methods: {
    getContainerSize() {
      const container = this.$refs.wrapper;

      const width = container.clientWidth;
      const height = container.clientHeight;
      return { width, height };
    },
    initChart() {
      // init it after dom and data ready
      const container = this.$refs.container;
      if (this.view || !container || !this.incrementalData) {
        return;
      }
      
      const spec = genSpec({
        ...this.getContainerSize(),
        values: this.incrementalData
      });
      const view = new vega.View(vega.parse(spec), {
        renderer: 'svg',
        container,
        hover: true
      });
      // view.logLevel(vega.Info);
      view.runAsync();

      this.view = view;
      window._view = view;

      view.addSignalListener('indexDate', (name, v) => {
        const time = dayjs(v).endOf('date');
        this.$store.commit('setDataTime', +time);
      });
    }
  }
}

function genSpec({ width, height, values }) {

  return {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  // "background": "#ccc",
  "padding": 0,
  "width": width,
  "height": height,
  "autosize": "fit",
  "data": [
    {
      "name": "source",
      "values": values,
      "transform": [
        {
          "type": "filter",
          "expr": " includeHubei ? true : datum.provinceName != '湖北省' "
        },
        {
          "field": "date",
          "type": "timeunit",
          "units": ["year", "month", "date"],
          "as": ["yearmonth_date", "yearmonth_date_end"]
        }
      ]
    },
    {
      "name": "dateCountMap",
      "source": "source",
      "transform": [
        {
          "type": "aggregate",
          "groupby": ["yearmonth_date"],
          "ops": ["sum"],
          "fields": ["confirmedCountInc"],
          "as": ["sum_count"]
        },
        {
          "type": "impute",
          "field": "sum_count",
          "key": "yearmonth_date",
          "method": "value",
          "value": 0
        },
        {
          "type": "pivot",
          "field": "yearmonth_date",
          "value": "sum_count"
        }
      ]
    },
    {
      "name": "table",
      "source": "source",
      "transform": [
        {
          "type": "aggregate",
          "groupby": ["yearmonth_date", "provinceName"],
          "ops": ["sum"],
          "fields": ["confirmedCountInc"],
          "as": ["sum_count"]
        },
        {
          "type": "impute",
          "field": "sum_count",
          "groupby": ["provinceName"],
          "key": "yearmonth_date",
          "method": "value",
          "value": 0
        },
        {
          "type": "stack",
          "groupby": ["yearmonth_date"],
          "field": "sum_count",
          "sort": {"field": ["provinceName"], "order": ["descending"]},
          "as": ["sum_count_start", "sum_count_end"],
          "offset": "center"
        }
      ]
    },
    {
      "name": "textSeries",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "groupby": ["provinceName"],
          "ops": ["argmax"],
          "fields": ["sum_count"],
          "as": ["argmax"]
        },
        {
          "type": "filter",
          "expr": "datum.argmax.sum_count > (includeHubei ? 1000 : 50)"
        },
      ]
    }
  ],
  "signals": [
    {
      "name": "includeHubei",
      "value": true
    },
    {
      "name": "indexDate",
      "value": values[values.length - 1].date,
      "on": [
        {
          "events": "[mousedown, window:mouseup] > window:mousemove!, touchmove",
          "update": "invert('x', clamp(x(), 0, width))"
        }
      ]
    },
    {
      "name": "dateCount",
      "update": "data('dateCountMap')[0][datetime(year(indexDate), month(indexDate), date(indexDate))]"
    }
  ],
  "marks": [
    {
      "name": "pathgroup",
      "type": "group",
      "from": {
        "facet": {
          "name": "faceted_path_main",
          "data": "table",
          "groupby": ["provinceName"]
        }
      },
      "encode": {
        "update": {
          "width": {"scale": "x", "signal": "indexDate"},
          "height": {"field": {"group": "height"}},
          "clip": {"value": "true"}
        }
      },
      "marks": [
        {
          "name": "marks",
          "type": "area",
          "sort": {"field": "datum[\"yearmonth_date\"]"},
          "from": {"data": "faceted_path_main"},
          "encode": {
            "update": {
              "interpolate": {"value": "monotone"},
              "orient": {"value": "vertical"},
              "fill": {"scale": "color", "field": "provinceName"},
              "fillOpacity": {"value": 1},
              "x": {"scale": "x", "field": "yearmonth_date"},
              "y": {"scale": "y", "field": "sum_count_end"},
              "y2": {"scale": "y", "field": "sum_count_start"},
              "defined": {
                "signal": "isValid(datum[\"yearmonth_date\"]) && isFinite(+datum[\"yearmonth_date\"]) && isValid(datum[\"sum_count\"]) && isFinite(+datum[\"sum_count\"])"
              }
            },
            "hover": {
              "fillOpacity": {"value": 0.5},
            }
          }
        }
      ]
    },
    {
      "type": "text",
      "from": {"data": "textSeries"},
      "interactive": false,
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "argmax.yearmonth_date"},
          "y": {"signal": "scale('y', 0.5 * (datum.argmax.sum_count_start + datum.argmax.sum_count_end))"},
          "align": {"signal": "width - scale('x', datum.argmax.yearmonth_date) < 40 ? 'right' : 'center' "},
          "baseline": {"value": "middle"},
          // "fontSize": {"scale": "font", "field": "argmax.perc", "offset": 5},
          "fontSize": {"value": 10},
          "fontWeight": {"value": "bolder"},
          "text": {"field": "provinceName"},
          "fill": {"scale": "color", "field": "provinceName"},
          "stroke": {"value": "#fff"},
          "opacity": {"signal": "scale('x', indexDate) - scale('x', datum.argmax.yearmonth_date)"}
        }
      }
    },
    {
      "type": "rule",
      "interactive": false,
      "encode": {
        "update": {
          "x": {"scale": "x", "signal": "indexDate", "offset": 0.5},
          // "y": {"value": 24},
          "y2": {"field": {"group": "height"}},
          "stroke": {"value": "firebrick"}
        }
      }
    },
    {
      "type": "text",
      "interactive": false,
      "encode": {
        "update": {
          "x": {"scale": "x", "signal": "indexDate", "offset": -2},
          "baseline": {"value": "top"},
          "align": {"signal": " scale('x', indexDate) < 40 ? 'left' : 'right' "},
          "text": {"signal": "[dateCount ? '↑' + dateCount : '',  indexDate ? timeFormat(indexDate, '%m-%d') : '' ]"},
          "fill": {"value": "firebrick"},
          "fontWeight": {"value": "bolder"},
          "stroke": {"value": "#fff"}
        }
      }
    }
  ],
  "scales": [
    {
      "name": "_x",
      "type": "time",
      "domain": {"data": "table", "field": "yearmonth_date"}
    },
    {
      "name": "x",
      "type": "time",
      "domain": {"signal": "[domain('_x')[0], timeOffset('date', domain('_x')[1]) - 1]"},
      "range": [0, {"signal": "width"}]
    },
    {
      "name": "y",
      "type": "linear",
      "domain": {
        "data": "table",
        "fields": ["sum_count_start", "sum_count_end"]
      },
      "range": [{"signal": "height"}, 0],
      "nice": true,
      "zero": true
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "table", "field": "provinceName", "sort": true},
      "range": {"scheme": "category20b"}
    }
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "gridScale": "y",
      "grid": true,
      "tickCount": "day",
      "domain": false,
      "labels": false,
      "maxExtent": 0,
      "minExtent": 0,
      "ticks": false,
      "zindex": 0
    },
    {
      "scale": "x",
      "orient": "bottom",
      "grid": true,
      "gridColor": "#aaa",
      "domain": false,
      "ticks": false,
      "labelFlush": true,
      "labelOverlap": true,
      "tickCount": {"signal": "ceil(width/40)"},
      "format": "%m-%d",
      "zindex": 0
    }
  ]
};

}
</script>
