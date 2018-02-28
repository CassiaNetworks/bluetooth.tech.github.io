var webpack = require('webpack');
var pluginsConfig = require('./inherit/plugins.config.js');
var CleanWebpackPlugin = require('clean-webpack-plugin');

/* webpack1下，用了压缩插件会导致所有loader添加min配置，而autoprefixser也被定格到某个browers配置 */
pluginsConfig.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  sourceMap: false
}));

pluginsConfig.push(new webpack.DefinePlugin({
  IS_PRODUCTION: true
}));

pluginsConfig.push(new webpack.NoEmitOnErrorsPlugin()); // 配合CLI的--bail，一出error就终止webpack的编译进程

pluginsConfig.push(new webpack.LoaderOptionsPlugin({
  options: {
    postcss: require('./vendor/postcss.config.js'),
    eslint: require('./vendor/eslint.config.js')
  }
}));
//构建项目前清除build文件夹
pluginsConfig.push(
    new CleanWebpackPlugin(['build'], {
      root: process.cwd(),
      exclude: []
    })
)
    
  

module.exports = pluginsConfig;
