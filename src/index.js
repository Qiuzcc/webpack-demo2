import _ from 'lodash'
import printMe from './print.js'
import './style.css'

function component() {
  var element = document.createElement('div')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  var btn = document.createElement('button')
  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = printMe
  element.appendChild(btn)

  return element;
}

// document.body.appendChild(component())
let element = component()
document.body.appendChild(element)

if (module.hot) {
  module.hot.accept('./print.js', function () {
    console.log('Accepting the updated printMe module!');
    printMe();
    document.body.removeChild(element)
    element = component()
    document.body.appendChild(element)
  })
}