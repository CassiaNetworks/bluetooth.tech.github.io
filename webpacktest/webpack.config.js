const HtmlWebpackPlugin = require('html-webpack-plugin'); //引入插件html-webpack-plugin
const CleanWebpackPlugin = require('clean-webpack-plugin'); //引入清除文件插件
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//把指定文件夹下的文件复制到指定的目录
const TransferWebpackPlugin = require('transfer-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
      },
      hash: true,
    }),
    new CleanWebpackPlugin(['dist']),
    new TransferWebpackPlugin([{
        from: 'lib',
        to: 'lib'
    }], path.resolve(__dirname, "src"))// run build 先清除
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }],
      }
    ]
  }
};