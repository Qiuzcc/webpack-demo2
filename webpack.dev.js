const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')   //设置web服务器寻找文件的地址
        },
        port: 8080,   //服务器端口，不能省略，否则无法正常运行
        hot: true
    }
})