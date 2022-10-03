# webpack指南 实践

## 指南链接

[指南 | webpack 中文网 (webpackjs.com)](https://www.webpackjs.com/guides/)



## 目录

- 起步
- 管理资源
- 管理输出
- 开发



## 一、起步

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



## 二、管理资源

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



## 三、管理输出

在上面的操作中，我们是靠手动在生成的index.html中引入所有资源，当应用程序增长之后，这样的操作将变得不现实，所以我们需要使用插件去自动完成这件事情。

HtmlWebpackPlugin插件可以帮助我们在每次构建时，创建一个新的文件，并把所有的bundle自动添加进去（**向 HTML 动态添加 bundle**）

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

**自动清空/dist文件夹**

使用[`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin)插件，在每次构建前自动清空输出目录



## 四、开发

搭建一个高效的开发环境

**source map**

追踪错误来源，如果不设置source map，出错代码只能追踪到bundle.js文件中，但是bundle.js可能是由多个js源文件组成的，不利于定位出错代码位置。使用source map可以将出错代码定位到源js文件。使用方法：

```javascript
//webpack.config.js
module.exports = {
    ...
    devtool:'inline-source-map'
}
```

**开发工具**

在开发环境下，如果我们每次修改都需要 `npm run build` 将显得很麻烦，所以webpack提供了几种不同的做法，可以在代码变化后自动编译代码

- 使用观察模式
- 使用webpack-dev-server
- 使用webpack-dev-middleware

下面依次展开每种的用法和对应的效果

**观察模式**

本质是在webpack构建时，加入`--watch`选项

```json
//package.json
{
    "scripts":{
        "watch":"webpack --watch"
    }
}
```

运行`npm run watch`，命令行不会退出，因为还在观察代码变化。当修改文件后，**需要手动刷新页面，才能看到变化**

**web-dev-server**

是一个一个简单的 web 服务器，并且能够实时重新加载(live reloading)，需要先安装依赖

```javascript
//webpack.config.js
module.exports = {
    ...
    devServer:{
        static:{
            directory: path.resolve(__dirname,'dist')   //设置web服务器寻找文件的地址
        },
        port:8080   //服务器端口，不能省略，否则无法正常运行
    }
}
```

```json
//package.json
{
    "scripts":{
        "start":"webpack-dev-server --open"
    }
}
```

效果：运行`npm start`，自动打开浏览器页面，同时保持监听，修改文件后，**程序自动刷新页面同步修改后的变化**

**web-dev-middleware**

`webpack-dev-middleware` 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)，在《指南》的例子中还搭配了一个express服务器使用。

在`webpack.config.js`输出配置中，增加了一个`publicPath: '/'`，确保服务器脚本能够正确获取到文件资源。然后添加了一个`server.js`，创建了一个express服务器

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

最后运行`node server.js`

效果：建立起了一个web服务器，但是**需要手动输入网址打开浏览器网页**，修改文件后，**需要手动刷新才能同步变化**



## 五、模块热替换

模块热替换就是在运行时更新各种模块，而不用完全刷新全部模块。

**启用热更新**

更新[webpack-dev-server](https://github.com/webpack/webpack-dev-server) 的配置，以及使用 webpack 内置的 HMR 插件

```javascript
//webpack.config.js
const webpack = require('webpack')
module.exports = {
    ...
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer:{
        ...
        hot:true
    }
}
```

在`index.js`文件中也要相应改变

```javascript
//index.js
...
// document.body.appendChild(component())
let element = component()
document.body.appendChild(element)

if (module.hot) {
  module.hot.accept('./print.js', function () {
    console.log('Accepting the updated printMe module!');
    printMe();
    document.body.removeChild(element)	//原来视图中的事件仍绑定在旧事件中，所以需要重新建立新的视图
    element = component()
    document.body.appendChild(element)
  })
}
```

**css热更新**

style-loader和css-loader汇总已经内置了热更新功能，loader在后台使用`module.hot.accept` 来修补(patch) `<style>` 标签，所以只需要使用对应的loader就可以了。
