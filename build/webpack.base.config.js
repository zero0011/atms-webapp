const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // 解决You are using the runtime-only build of Vue where the template compiler is not available
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js',
      '@':path.join(__dirname,'./src')
    }
  },
  entry: {
    main: './src/main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
        use: ['style-loader', 'css-loader']
        // use: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      //解析scss 并添加浏览器前缀
      {
        test:/\.scss$/,
        use:['style-loader', 'css-loader',{
          loader:'postcss-loader',
          options:{
            plugin:[require('autoprefixer')]
          }
        },'sass-loader']
      },
      {
        test: /\.(jpg|png|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: { // 配置参数
            // 这种配置语法叫做：占位符
            name: 'img/[name]_[hash].[ext]', // 使用图片的名字，并使用图片的后缀
            limit: 20*1024,
            esModule:false
          }        
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[chunkhash].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      favicon: path.resolve(__dirname, '../favicon.ico'),
      filename: 'index.html'
    }),
    new VueLoaderPlugin(),
    // new ExtractTextPlugin("styles.css")
    // new MiniCssExtractPlugin({
    //   filename: 'css/[name].[chunkhash].css'
    // })
  ]
}