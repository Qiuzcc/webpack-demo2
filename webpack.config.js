const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')  //引入时需要加一个{}包裹，与指南不同，请注意！

module.exports = {
    mode:'development',
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '管理输出'        //指定生成的index.html的标题
        }),
        new CleanWebpackPlugin()    //默认清空输出目录，也可以手动指定需要清空的目录，具体配置方法请参考代码所在仓库
    ],
    devtool:'inline-source-map',
    devServer:{
        static:{
            directory: path.resolve(__dirname,'dist')   //设置web服务器寻找文件的地址
        },
        port:8080   //服务器端口，不能省略，否则无法正常运行
    }
}