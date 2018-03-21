var dirVars = require('../base/dir-vars.config.js');

module.exports = {
  contentBase:  './build',
  host: 'localhost',
  port: 8088, // 默认8080
  inline: true, // 可以监控js变化
  hot: true, // 热启动
  compress: true,
  watchContentBase: true,
  publicPath:'/wristbandDemo/build/'
};
// console.log('*******',module.export.contentBase)