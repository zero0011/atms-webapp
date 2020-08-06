// const path = require( 'path')
// const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // new UglifyJsPlugin({
    //   sourceMap: true
    // })
    // new webpack.DefinePlugin({
    //   'process.env.MODE_ENV': JSON.stringify('production')
    // })
  ],
  output: {
    // publicPath: './static'
  }
  // optimization: {
  //   minimizer: [new UglifyJsPlugin({
  //     parallel: true,
  //     sourceMap :true 
  //   })]
  // }
})