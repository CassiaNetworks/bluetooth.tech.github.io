require('!!file-loader?name=index.html!../../index.html');

module.exports = {
  js: {
    jquery: require('!!file-loader?name=static/js/[name].[ext]!jquery/dist/jquery.min.js'),
    Backbone:require('!!file-loader?name=static/js/[name].[ext]!backbone/backbone-min.js'),
    undersocre:require('!!file-loader?name=static/js/[name].[ext]!underscore/underscore-min.js')
  },
  images: {
    // 'login-bg': require('!!file-loader?name=static/images/[name].[ext]!../imgs/login-bg.jpg'),
  }
  // dll: {
  //   js: require('!!file-loader?name=dll/dll.js!../../dll/dll.js'),
  //   css: require('!file-loader?name=dll/dll.css!../../dll/dll.css'),
  // },
};
