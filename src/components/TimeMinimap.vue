<template>
  <div ref="wrapper" class="wrapper">
    <div ref="container" class="container"></div>
    <label class="include-hubei">
      <input type="checkbox" v-model="includeHubei"/>
      包含湖北省
    </label>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  /* background: #eee; */
}

.include-hubei {
  position: absolute;
  bottom: 40px;
  left: 20px;
  font-size: 12px;
  vertical-align: middle;
  background: #fff;
}

.include-hubei input {
  margin: 0;
  width: 12px;
  height: 12px;
  vertical-align: middle;
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
    ...mapState(['paneSize']),
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
      // "format": {"type": "json", "parse": {"date": "date"}},
    },
    {
      "name": "dateCount",
      "source": "source",
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
        },
        {
          "type": "aggregate",
          "groupby": ["yearmonth_date"],
          "ops": ["sum"],
          "fields": ["confirmedCountInc"],
          "as": ["sum_count"]
        }
      ]
    },
    {
      "name": "table",
      "source": "source",
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
        },
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
    }
  ],
  "signals": [
    {
      "name": "includeHubei",
      "value": true
    },
    {
      "name": "indexDate",
      "on": [
        {
          "events": "mousemove, touchmove",
          "update": "invert('x', clamp(x(), 0, width))"
        }
      ]
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
          "width": {"field": {"group": "width"}},
          "height": {"field": {"group": "height"}}
        }
      },
      "marks": [
        {
          "name": "marks",
          "type": "area",
          "style": ["area"],
          "sort": {"field": "datum[\"yearmonth_date\"]"},
          "from": {"data": "faceted_path_main"},
          "encode": {
            "update": {
              "interpolate": {"value": "monotone"},
              "orient": {"value": "vertical"},
              "fill": {"scale": "color", "field": "provinceName"},
              "x": {"scale": "x", "field": "yearmonth_date"},
              "y": {"scale": "y", "field": "sum_count_end"},
              "y2": {"scale": "y", "field": "sum_count_start"},
              "defined": {
                "signal": "isValid(datum[\"yearmonth_date\"]) && isFinite(+datum[\"yearmonth_date\"]) && isValid(datum[\"sum_count\"]) && isFinite(+datum[\"sum_count\"])"
              }
            }
          }
        },
        {
          "type": "rule",
          "encode": {
            "update": {
              "x": {"scale": "x", "signal": "indexDate", "offset": 0.5},
              // "y": {"value": 24},
              "y2": {"field": {"group": "height"}},
              "stroke": {"value": "firebrick"}
            }
          }
        },
        // {
        //   "type": "rect",
        //   "encode": {
        //     "update": {
        //       "xc": {"scale": "x", "signal": "indexDate"},
        //       "width": {"value": 40},
        //       "height": {"value": 12},
        //       "fill": {"value": "#ccc"}
        //     }
        //   }
        // },
        {
          "type": "text",
          "encode": {
            "update": {
              "x": {"scale": "x", "signal": "indexDate", "offset": -2},
              "baseline": {"value": "top"},
              "align": {"value": "right"},
              "text": {"signal": "indexDate ? '↑ ' + scale('count', datetime(year(indexDate), month(indexDate), date(indexDate)) ) : '' "},
              "fill": {"value": "firebrick"},
              "fontWeight": {"value": "bolder"},
              "stroke": {"value": "rgba(255,255,255,0.3)"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "update": {
              "x": {"scale": "x", "signal": "indexDate", "offset": -2},
              // "y2": {"field": {"group": "height"}, "offset": 0},
              "y": {"value": 12},
              "baseline": {"value": "top"},
              "align": {"value": "right"},
              "text": {"signal": "indexDate ? timeFormat(indexDate, '%m-%d') : '' "},
              "fill": {"value": "firebrick"},
              "fontWeight": {"value": "bolder"},
              "stroke": {"value": "rgba(255,255,255,0.3)"}
            }
          }
        },
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "time",
      "domain": {"data": "table", "field": "yearmonth_date"},
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
    },
    {
      "name": "count",
      "type": "ordinal",
      "domain": {"data": "dateCount", "field": "yearmonth_date"},
      "range": {"data": "dateCount", "field": "sum_count"}
    }
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "gridScale": "y",
      "grid": true,
      // "tickCount": {"signal": "ceil(width/40)"},
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
      "grid": false,
      "domain": false,
      "tickSize": 0,
      "labelFlush": true,
      "labelOverlap": true,
      "tickCount": {"signal": "ceil(width/40)"},
      "encode": {
        "labels": {
          "update": {"text": {"signal": "timeFormat(datum.value, '%m-%d')"}}
        }
      },
      "zindex": 0
    }
  ],
  // "legends": [{"fill": "color", "symbolType": "circle", "title": "series"}]
};

}
</script>
