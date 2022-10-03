import _ from 'lodash'

function getComponent() {
  var element = document.createElement('div')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  var button = document.createElement('button');
  button.innerHTML = 'Click me and look at the console!';
  var br = document.createElement('br');
  element.appendChild(br)
  element.appendChild(button)

  button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    var print = module.default;
    //注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，
    //因为它才是 promise 被处理后返回的实际的 module 对象。
    print();
  })

  return element;
}

let element = getComponent()
document.body.appendChild(element)
