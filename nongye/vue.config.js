/*
 * @Author: huangl
 * @Date: 2022-09-13 20:10:31
 * @LastEditors: huangl
 * @LastEditTime: 2022-09-17 12:35:33
 * @Description: file content
 * @FilePath: \money-datav\vue-dataV\vue.config.js
 */
const path = require('path')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      .set('_c', resolve('src/components')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('@', resolve('src'))


    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.module
      .rule("fonts")
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 100000,
        fallback: {
          loader: "file-loader",
          options: {
            name: `/assets/fonts/[name].[ext]`
          }
        }
      })

  },
  devServer: {
    proxy: { // 配置跨域
      '/api': {
        target: `http://cloud1-3gb8kc9hee10782c-1365771753.ap-shanghai.app.tcloudbase.com/`,
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': '' // 重写请求
        }
      }
    }
  },
  configureWebpack:{
    plugins: [
      new FileManagerPlugin(
        {
          events: {
            onEnd: {
              delete: ['./dist.zip'],
              archive: [{
                source: path.join(__dirname, './dist'),
                destination: path.join(__dirname, './dist.zip')
              }]
            }
          }
        }
      )
    ]
  }
}