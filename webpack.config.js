const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode:'production',
    entry:{
        app:'./src/index.js',
        print:'./src/print.js'
    },
    output:{
        filename:'[name].bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:'管理输出'        //指定生成的index.html的标题
        })
    ]
}