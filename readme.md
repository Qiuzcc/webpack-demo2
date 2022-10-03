# webpack指南 实践

## 指南链接

[指南 | webpack 中文网 (webpackjs.com)](https://www.webpackjs.com/guides/)



## 目录

- 起步
- 管理资源
- 管理输出



## 起步

安装webpack和webpack-cli，`npm init`初始化项目，去除`package.json`的`main`入口，防止意外发布你的代码。创建项目目录

```
  webpack-demo2
  |- package.json
  |- /dist
   |- index.html
  |- /src
    |- index.js
```

`npx webpack`运行webpack打包（直接用`webpack`命令是没用的，命令行找不到对应的脚本。Node 8.2+ 版本提供的 `npx` 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件）

执行 `npx webpack`，会将我们的脚本作为入口起点，然后 输出为 `main.js`

**使用配置文件**

```javascript
//webpack.config.js
const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    }
}
```

如果 `webpack.config.js` 存在，则`webpack` 命令将默认选择使用它，也可以通过`--config`选项来选择不同的配置文件

**NPM脚本**

使用 npm 的 `scripts`，我们可以像使用 `npx` 那样通过模块名引用本地安装的 npm 包。这是大多数基于 npm 的项目遵循的标准，因为它允许所有贡献者使用同一组通用脚本



## 管理资源

**加载css**

使用loader加载器，先安装，然后再`webpack.config.js`中配置`module`属性

```javascript
//webpack.config.js，module->rules是loader加载器的配置
module.exports = {
	...
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}
```

此时css被内嵌到html的`<head>`标签内，是作为内联css

**加载图片**

使用`file-loader`处理图标、图片、字体等资源

**加载数据**

json数据是NodeJS内置了加载实现，但是csv、xml、tsv的导入需要用加载器，如`csv-loader`、`xml-loader`



## 管理输出

在上面的操作中，我们是靠手动在生成的index.html中引入所有资源，当应用程序增长之后，这样的操作将变得不现实，所以我们需要使用插件去自动完成这件事情。

HtmlWebpackPlugin插件可以帮助我们在每次构建时，创建一个新的文件，并把所有的bundle自动添加进去。

**使用插件**

首先安装插件，然后再webpack.config.js文件中进行配置

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    ...
    plugins:[
        new HtmlWebpackPlugin({
            title:'管理输出'        //指定生成的index.html的标题
        })
    ]
}
```

