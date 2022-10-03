# webpack指南 实践

## 指南链接

[指南 | webpack 中文网 (webpackjs.com)](https://www.webpackjs.com/guides/)



## 目录

- 起步
- 管理资源
- 管理输出
- 开发
- 搭建生产环境
- 代码分离
- 懒加载（分支与”代码分离“放置在一起）
- 缓存



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



## 五、搭建生产环境

参照《指南》，仅仅是根据不同开发模式拆分了webpack配置文件，其余的代码压缩、css分离都因为依赖项与webpack最新版本不兼容而无法实现。



## 六、代码分离

常用的代码分离方法：

- 入口起点，使用[`entry`](https://www.webpackjs.com/configuration/entry-context) 配置手动地分离代码，一个入口对应一个bundle.js文件。缺点：不灵活，不能实现动态拆分，不同入口之间还可能包含重复模块，重复打包。
- 防止重复，使用 [`CommonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin) 去重和分离 chunk，提取公用依赖，生成单独的bundle
- 动态导入，通过模块的内联函数调用来分离代码，类似于vue路由懒加载的原理

指南中第二点提到的[`CommonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin) 插件已经被弃用了，所以按照教程第二点操作会出错，参考：[请看CommonsChunkPlugin VS SplitChunksPlugin-CSDN博客](https://blog.csdn.net/yusirxiaer/article/details/82917144)。[`CommonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin) 插件的弊端在于只能将公用模块统一抽取到父模块中，极易造成父模块过大。

**SplitChunksPlugin插件**的好处在于：1、可以抽离出懒加载模块之间的公用模块，2、不会抽取到父级而是形成一个单独的模块，与首次用到的懒加载模块并行加载，解决了入口文件过大的问题。

但是具体怎么使用SplitChunksPlugin插件没有提到，所以这一节没有再尝试

指南第三点动态导入，导入后的loadsh是一个Module类型，但是无法获取到它的join方法，所以也就无法调用实现预定效果，页面为空白；然而在浏览器控制台又能获取到它的join方法，这是很奇怪的一点，它的表现并不像正常的Promise对象。最后无法实现出指南预期的结果。解决：

```javascript
//index.js
function getComponent() {

  return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
    var element = document.createElement('div')
    element.innerHTML = _.default.join(['Hello', 'webpack'], ' ')
    // 注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，
    // 因为它才是 promise 被处理后返回的实际的 module 对象。

    return element

  }).catch(error => 'An error occurred while loading the component')
}
getComponent().then(component => {
  document.body.appendChild(component)
})
```



## 七、懒加载

或者叫按需加载，是指在需要用到某个模块的时候再加载它，带来的最大好处是：节省了初始化文件的大小，加快了应用的初始加载速度。

在上一节《代码分离》中，已经将一些代码分离出来打包，但是加载这个包却并没有依赖于用户的交互，只要页面一加载就会同步加载它，所以并没有太大帮助，甚至造成负面影响（增加了http请求数量）。下面我们将增加一个交互，只有当用户交互发生时，才加载对应的代码块。

具体看代码



## 八、缓存

将`/dist`目录中的内容部署到服务器上，浏览器就可以通过请求资源获得到服务页面。浏览器为了提高资源利用率、减少请求次数，使用了缓存技术，如果命中缓存，将不再重复请求相同的资源。但是这给我们更新代码内容带来了困扰，如果文件名并未改变，浏览器可能会认为它并没有更新，而使用它的缓存旧版本。

**修改输出文件名**

指南提出的解决办法是在输出文件名中使用`hash`字段。

```javascript
//webpack.common.js
module.exports = {
    ...
    output: {
        filename: '[name].[chunkhash].js',
    }
}
```

**提取公用模板**

我们在更新代码时，并不一定是更换所有代码，也许只是修改几个bug，只更改少量代码，这时去替换整个资源不是最优的选择。为了解决这个问题，可以将一些修改可能性很低的公用部分（比如某个依赖）单独提取出来。
