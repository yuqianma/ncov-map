<template>
<div v-html="compiledMarkdown">
</div>
</template>

<script>
const k = Date.now();
export default {
  data: () => ({
    readme: "#waiting..."
  }),
  created() {
    fetch('https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@master/README.md?_=' + k)
    .then(res => res.text()).then(t => this.readme = t);
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.readme);
    }
  },
}
</script>
