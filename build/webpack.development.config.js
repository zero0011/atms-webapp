const path = require( 'path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    // host: '10.64.36.174',
    port: '8090',
    // 假如请求/api/user/aaa会被代理到http://localhost:1000/user/aaa
    // proxyTable: {
    //   '/open/atms': {
    //     target: 'http://10.64.152.17:16666',
    //     changeOrigin: true
    //   }
    // }
  },
  devtool: 'inline-source-map'
})