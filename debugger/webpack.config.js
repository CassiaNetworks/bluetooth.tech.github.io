var webpack = require('webpack');

var path = require('path');

//清空特定目录
var CleanPlugin = require('clean-webpack-plugin');

//把指定文件夹下的文件复制到指定的目录
var TransferWebpackPlugin = require('transfer-webpack-plugin');

//引入系统命令
// var exec = require('child_process').exec, child;

// 引入css 单独打包插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// 生产环境先清空生成目录,设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
var plugins = [new CleanPlugin('dist'), new ExtractTextPlugin('./css/[name].css'),
    new TransferWebpackPlugin([{
        from: 'lib',
        to: 'lib'
    }], path.resolve(__dirname, "src"))
]

module.exports = {
    entry: {
        index: './index.js'
            // vendor: ['jquery']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "./js/[name].js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, {
            test: /\.scss$/,
            loader: "style!css!sass"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    postcss: [
        require('autoprefixer') //调用autoprefixer插件
    ],
    plugins: plugins
}



// // 判断生产&&测试环境
// var isProduction = function () {
//     return process.env.NODE_ENV === 'production';
//     var getEnvironment = function() {
//     switch (process.env.NODE_ENV) {
//         case 'hotdev':
//             return '/hot/';
//         case 'production':
//             return '/dist/';
//         default:
//             return '/dev/';
//     }
// };
// };

// // 判断开发(热加载)环境
// var isHot = function () {
//     return process.env.NODE_ENV === 'hotdev';
// };