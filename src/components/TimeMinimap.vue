<template>
  <div ref="container"></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TimeMinimap',
  data: () => ({}),
  mounted () {
    this.initChart();
  },
  computed: {
    ...mapGetters(['timeSeriesData'])
  },
  methods: {
    initChart() {
      const container = this.$refs.container;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const spec = {};

      view = new vega.View(vega.parse(spec), {
        renderer:  'svg',
        container,
        hover:     true
      });
      view.runAsync();

      this.view = view;
    }
  }
}
</script>
