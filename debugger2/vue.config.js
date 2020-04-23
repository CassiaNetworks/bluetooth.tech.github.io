
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Cassia 蓝牙调试工具'
    }
  },
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
      'echarts': 'echarts',
      'ECharts': 'vue-echarts',
      'XEUtils': 'xe-utils',
      'VXETable': 'vxe-table',
      'highlight.js': 'highlight.js',
      'bash': 'bash',
      'javascript': 'javascript',
      'VueHighlightJS': 'vue-highlight.js',
    }
  }
};