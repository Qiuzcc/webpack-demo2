const path = require('path')

module.exports = {
    mode:'production',
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },{
                test:/\.(png|jpg|svg|gif|ico)$/,
                use:['file-loader']
            },{
                test:/\.(csv|tsv)$/,
                use:['csv-loader']
            },{
                test:/\.xml$/,
                use:['xml-loader']
            }
        ]
    }
}