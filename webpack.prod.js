const { merge } = require('webpack-merge')    //merge需要用{}包裹
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),    //默认清空输出目录，也可以手动指定需要清空的目录，具体配置方法请参考代码所在仓库
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    devtool:'source-map'
})