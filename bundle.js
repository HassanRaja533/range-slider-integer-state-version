(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const range = require('range-slider-hr')
// const integer = require('input-integer-ui-hassan_raja')

module.exports = range_slider_integer

function range_slider_integer (opts) {
  const state = {}
  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })

  const rsi = document.createElement('div')
  rsi.classList.add('rsi')

  const range_slider = range(opts, protocol)
  const input_integer = integer(opts, protocol)

  rsi.append(range_slider, input_integer)

  const style = document.createElement('style')
  style.textContent = get_theme()

  shadow.append(rsi, style)

  return el

  function protocol (message, notify) {
    const { from } = message
    state[from] = { value: 0, notify }
    return listen
  }

  // handler
  function listen (message) {
    const { from, type, data } = message
    state[from].value = data
    if (type === 'update') {
      let notify
      if (from === 'range-slider-0') notify = state['input-integr-0'].notify
      else if (from === 'input-integr-0') notify = state['range-slider-0'].notify

      notify({ type, data })
    }
  }

  function get_theme () {
    return `
      .rsi {
        padding: 5%;
        display: grid;
        grid-template-columns: 8fr 1fr;
        align-items: center;
        justify-items: center;
      }
    `
  }
}

},{}],2:[function(require,module,exports){
const prefix = 'https://raw.githubusercontent.com/alyhxn/playproject/main/'
const init_url = prefix + 'src/node_modules/init.js'

fetch(init_url, { cache: 'no-store' }).then(res => res.text()).then(async source => {
  const module = { exports: {} }
  const f = new Function('module', 'require', source)
  f(module, require)
  const init = module.exports
  await init(arguments, prefix)
  require('./page') // or whatever is otherwise the main entry of our project
})

},{"./page":3}],3:[function(require,module,exports){
const range_slider_integer = require('..')

const opts = { min: 0, max: 10 }
const rsi = range_slider_integer(opts)

document.body.append(rsi)

},{"..":1}]},{},[2]);
