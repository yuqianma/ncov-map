module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/'
    : '',
  productionSourceMap: false,
  devServer: {
    hot: false
  }
}
