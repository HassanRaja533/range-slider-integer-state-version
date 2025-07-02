(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
// Import the STATE module and initialize the state database
const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools


module.exports = input_integer

let input_id = 0

async function input_integer (opts, protocol) {
    console.log('input_integer in index')
   // Get the sid and state database for this instance
   
    console.log (opts.sid) 
    const { id, sdb } = await get(opts.sid)
    //console.log('sid:', opts.sid, '→ resolved id:', id)

    const on = {
      style: inject
    }

    // Load config from drive/data/opts.json (fallback will provide defaults)
    const config = await sdb.drive.get('data/opts.json')
    //console.log(`Loaded config for "${id}":`, config)

    const { min = 0, max = 1000 } = config
    const name = `input-integr-${input_id++}`

    const notify = protocol({ from: name }, listen)

    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const input = document.createElement('input')
    input.type = 'number'
    input.min = min
    input.max = max

    input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
    input.onmouseleave = (e) => handle_onmouseleave_and_blur(e, input, min)
    input.onblur = (e) => handle_onmouseleave_and_blur(e, input, min)

    const css = await sdb.drive.get('style/theme.css')
    inject(css)
    
    shadow.append(input)

    // Move inject() inside to access shadow
    // function inject (data) {
    //   const sheet = new CSSStyleSheet()
    //   sheet.replaceSync(data)
    //   shadow.adoptedStyleSheets = [sheet]
    // }
    function inject(data) {
    console.log('Injecting style:', data)
    const sheet = new CSSStyleSheet()

    if (data?.raw) {
    sheet.replaceSync(data.raw || '') // ensure raw exists
    shadow.adoptedStyleSheets = [sheet]
    }
  }
    await sdb.watch(onbatch)

    return el

    function listen (message) {
      const { type, data } = message
      if (type === 'update') {
        input.value = data
      }
    }

    function handle_onkeyup (e, input, min, max) {
      const val = Number(e.target.value)
      const val_len = val.toString().length
      const min_len = min.toString().length

      if (val > max) {
        input.value = max
      } else if (val_len === min_len && val < min) {
        input.value = min
      }

      notify({ from: name, type: 'update', data: val })
    }

    function handle_onmouseleave_and_blur (e, input, min) {
      const val = Number(e.target.value)
      if (val < min) input.value = ''
    }

    function onbatch (batch) {
      for (const { type, data } of batch) {
        on[type] && on[type](data)
      }
    }

  } 

// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
  }

  function fallback_instance (opts) {
    console.log('make instance:', opts)
    return {
      drive: {
        'style/': {
          'theme.css': {
            raw: `
              :host {
                --b: 0, 0%;
                --color-white: var(--b), 100%;
                --color-black: var(--b), 0%;
                --color-grey: var(--b), 85%;
                --bg-color: var(--color-grey);
                --shadow-xy: 0 0;
                --shadow-blur: 8px;
                --shadow-color: var(--color-white);
                --shadow-opacity: 0;
                --shadow-opacity-focus: 0.65;
              }

              input {
                text-align: left;
                align-items: center;
                font-size: 1.4rem;
                font-weight: 200;
                color: hsla(var(--color-black), 1);
                background-color: hsla(var(--bg-color), 1);
                padding: 8px 12px;
                box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
                transition: font-size 0.3s, color 0.3s, background-color 0.3s, box-shadow 0.3s ease-in-out;
                outline: none;
                border: 1px solid hsla(var(--bg-color), 1);
                border-radius: 8px;
              }

              input:focus {
                --shadow-color: var(--color-black);
                --shadow-opacity: var(--shadow-opacity-focus);
                --shadow-xy: 4px 4px;
                box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
              }

              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none;
              }
            `
          }
        },

        'data/': {
          'opts.json': {
            raw: opts 
          }
        }
      }
    }
  }
}
// Returns the fallback structure for drive datasets like styles and data


}).call(this)}).call(this,"/node_modules/input-integer-state-version-hr/src/index.js")
},{"STATE":2}],2:[function(require,module,exports){
// // src/node_modules/STATE.js

// module.exports = function (filename) {
//   return function (fallback_module) {
//     return {
//       sdb: {
//         watch: async function () {
//           return []
//         }
//       },
//       get: async function () {
//         return {
//           id: Math.random().toString(36).substring(2),
//           sdb: {
//             watch: async function () {
//               return []
//             }
//           }
//         }
//       }
//     }
//   }
// }

},{}],3:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools

module.exports = range_slider

  let input_id = 0

async function range_slider(opts, protocol) {
   
  console.log('SID:', opts.sid)
   const { id, sdb } = await get(opts.sid)

  const on = {
    value: handleValue,
    style: inject
  }
   await sdb.watch(onbatch)
   const config = await sdb.drive.get('data/opts.json')
   const { min = 0, max = 1000 } = config
   const name = `range-slider-${input_id++}`
   const state = {}

 function protocol (message, notify) {
    const { from } = message
    state[from] = { value: 0, notify }
    return listen
 }

   const notify = protocol({ from: name }, listen)

  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
    fill.style.width = `${(data / max) * 100}%`
    input.focus()
  }


   const el = document.createElement('div')
   el.classList.add('container')
   const shadow = el.attachShadow({ mode: 'closed' })

   const input = document.createElement('input')
   input.type = 'range'
   input.min = min
   input.max = max
   input.value = min

   input.oninput = handle_input

   const bar = document.createElement('div')
   bar.classList.add('bar')

   const ruler = document.createElement('div')
   ruler.classList.add('ruler')

   fill = document.createElement('div') // make accessible
   fill.classList.add('fill')

  // Get and inject the CSS from virtual drive
   const css = await sdb.drive.get('style/theme.css')
   inject(css)

   bar.append(ruler, fill)

   shadow.append( input, bar)

  function inject(data) {
    console.log('Injecting style:', data)
    const sheet = new CSSStyleSheet()

    if (data?.raw) {
    sheet.replaceSync(data.raw || '') // ensure raw exists
    shadow.adoptedStyleSheets = [sheet]
    }
  }

  return el

  // handler
  function handle_input (e) {
    const val = Number(e.target.value)
    fill.style.width = `${(val / max) * 100}%`
    notify({ from: name, type: 'update', data: val })
  }

  function onbatch (batch) {
     for (const { type, data } of batch) {
       on[type] && on[type](data)
     }
  }

  function handleValue(data) {
    console.log(`✅ SID "${data.id}" value is now:`, data.value)
  }
}  

// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
  }

  function fallback_instance(opts) {
  console.log('make instance:', opts);
  return {
    drive: {
      'style/': {
        'theme.css': {
          raw: `
            :host {
              box-sizing: border-box;
              --white       : hsla(0, 0%, 100%, 1);
              --transparent : hsla(0, 0%, 0%, 0);
              --grey        : hsla(0, 0%, 90%, 1);
              --blue        : hsla(207, 88%, 66%, 1);
              position: relative;
              width: 100%;
              height: 16px;
            }

            *, *::before, *::after {
              box-sizing: inherit;
            }

            input {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              -webkit-appearance: none;
              outline: none;
              margin: 0;
              z-index: 2;
              background-color: var(--transparent);
            }

            .bar {
              position: absolute;
              top: 3px;
              left: 0;
              z-index: 0;
              height: 10px;
              width: 100%;
              border-radius: 8px;
              overflow: hidden;
              background-color: var(--grey);
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .ruler {
              position: absolute;
              height: 6px;
              width: 100%;
              transform: scale(-1, 1);
              background-size: 20px 8px;
              background-image: repeating-linear-gradient(
                to right,
                var(--grey) 0px,
                var(--grey) 17px,
                var(--white) 17px,
                var(--white) 20px
              );
            }

            .fill {
              position: absolute;
              height: 100%;
              width: 0%;
              background-color: var(--grey);
            }

            input:focus + .bar .fill,
            input:focus-within + .bar .fill,
            input:active + .bar .fill {
              background-color: var(--blue);
            }

            input::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-webkit-slider-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }

            input::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-moz-range-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }
          `
        }
      },

      'data/': {
        'opts.json': {
          raw: opts
        }
      }
    }
  };
 }
}





/*
const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools


module.exports = range_slider

  const style = document.createElement('style')
  let input_id = 0

async function  range_slider (opts, protocol) {

  console.log (opts.sid) 
  const { id, sdb } = await get(opts.sid)
    
 const on = {
  value: handleValue,
  style: inject
 }

  // Handle value updates
 function handleValue(data) {
  console.log(`✅ SID "${data.id}" value is now:`, data.value)
 }

  // Load config from drive/data/opts.json (fallback will provide defaults)
  const config = await sdb.drive.get('data/opts.json')
    
  const { min = 0, max = 1000 } = config
  const name = `range-slider-${input_id++}`
  const state = {}

 function protocol (message, notify) {
    const { from } = message
    state[from] = { value: 0, notify }
    return listen
 }

  const notify = protocol({ from: name }, listen)

  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
    fill.style.width = `${(data / max) * 100}%`
    input.focus()
  }

  const el = document.createElement('div')
  el.classList.add('container')
  const shadow = el.attachShadow({ mode: 'closed' })

  const input = document.createElement('input')
  input.type = 'range'
  input.min = min
  input.max = max
  input.value = min

  input.oninput = handle_input
  const bar = document.createElement('div')
  bar.classList.add('bar')

  const ruler = document.createElement('div')
  ruler.classList.add('ruler')

  const fill = document.createElement('div')
  fill.classList.add('fill')

  bar.append(ruler, fill)
  const style = document.createElement('style')
  // style.textContent = get_theme()

  shadow.append(style, input, bar)
  
  function inject (data) {
    console.log('Injecting style:', data)
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(data)
    shadow.adoptedStyleSheets = [sheet]
  }

  await sdb.watch(onbatch)

  return el

  // handler
  function handle_input (e) {
    const val = Number(e.target.value)
    fill.style.width = `${(val / max) * 100}%`
    notify({ from: name, type: 'update', data: val })
  }

  function onbatch (batch) {
     for (const { type, data } of batch) {
       on[type] && on[type](data)
     }
    }
}

// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
  }

  function fallback_instance(opts) {
  console.log('make instance:', opts);
  return {
    drive: {
      'style/': {
        'theme.css': {
          raw: `
            :host {
              box-sizing: border-box;
              --white       : hsla(0, 0%, 100%, 1);
              --transparent : hsla(0, 0%, 0%, 0);
              --grey        : hsla(0, 0%, 90%, 1);
              --blue        : hsla(207, 88%, 66%, 1);
              position: relative;
              width: 100%;
              height: 16px;
            }

            *, *::before, *::after {
              box-sizing: inherit;
            }

            input {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              -webkit-appearance: none;
              outline: none;
              margin: 0;
              z-index: 2;
              background-color: var(--transparent);
            }

            .bar {
              position: absolute;
              top: 3px;
              left: 0;
              z-index: 0;
              height: 10px;
              width: 100%;
              border-radius: 8px;
              overflow: hidden;
              background-color: var(--grey);
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .ruler {
              position: absolute;
              height: 6px;
              width: 100%;
              transform: scale(-1, 1);
              background-size: 20px 8px;
              background-image: repeating-linear-gradient(
                to right,
                var(--grey) 0px,
                var(--grey) 17px,
                var(--white) 17px,
                var(--white) 20px
              );
            }

            .fill {
              position: absolute;
              height: 100%;
              width: 0%;
              background-color: var(--grey);
            }

            input:focus + .bar .fill,
            input:focus-within + .bar .fill,
            input:active + .bar .fill {
              background-color: var(--blue);
            }

            input::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-webkit-slider-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }

            input::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-moz-range-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }
          `
        }
      },

      'data/': {
        'opts.json': {
          raw: opts
        }
      }
    }
  };
 }
}


*/
}).call(this)}).call(this,"/node_modules/range-slider-state-version-hr/src/index.js")
},{"STATE":4}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
(function (__filename){(function (){
 const STATE = require('STATE') // Import custom STATE module for managing local state and drive
 const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
 const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools

 
 const range = require('range-slider-state-version-hr')
 const integer = require('input-integer-state-version-hr')

 module.exports = range_slider_integer

async function range_slider_integer (opts) {

  console.log('SID:', opts.sid)
  const { id, sdb } = await get(opts.sid)

  const on = {
    value: handleValue,
    style: inject
  }
  
  await sdb.watch(onbatch)

  

  const state = {}
  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })

  const rsi = document.createElement('div')
  rsi.classList.add('rsi')

  const range_slider = await range({min: 0, max: 10}, protocol)
  const input_integer = await integer({min: 0, max: 10}, protocol)

  
  rsi.append(range_slider, input_integer)

  // const style = document.createElement('style')
  // style.textContent = get_theme()
  // Get and inject the CSS from virtual drive
   const css = await sdb.drive.get('style/theme.css')
   inject(css)

  shadow.append(rsi)//, style)

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


// Batch event dispatcher
function onbatch(batch) {
  console.log('📦 Watch triggered with batch:', batch)
  for (const { type, data } of batch) {
    if (on[type]) {
      on[type](data)
    }
  }
}


  function inject(data) {
    console.log('Injecting style:', data)
    const sheet = new CSSStyleSheet()

    if (data?.raw) {
    sheet.replaceSync(data.raw || '') // ensure raw exists
    shadow.adoptedStyleSheets = [sheet]
    }
  }


    function handleValue(data) {
    console.log(`✅ SID "${data.id}" value is now:`, data.value)
  }
 
}


// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
    
    _: {
      'range-slider-state-version-hr': {
        $: '', 
        // mapping: {
        //   style: 'style',
        //   data: 'data'
        // }
      },
      'input-integer-state-version-hr': {
        $: '',
        // mapping: {
        //   style: 'style',
        //   data: 'data'
        // }
      }
    }
  }

  function fallback_instance() {
  //console.log('make instance:', opts);
  return {
    drive: {
      'style/': {
        'theme.css': {
          raw: `
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
    }

  };
}

}
}).call(this)}).call(this,"/src/index.js")
},{"STATE":6,"input-integer-state-version-hr":1,"range-slider-state-version-hr":3}],6:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],7:[function(require,module,exports){
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

},{"./page":8}],8:[function(require,module,exports){
(function (__filename){(function (){
// page.js
const STATE = require('../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)


const range_slider_integer = require('..')

const opts = { min: 0, max: 10 }

async function main() {
  const subs = await sdb.watch(onbatch)
  const rsi = await range_slider_integer(subs[0])
  document.body.append(rsi)
}
main()

// Batch event dispatcher
function onbatch(batch) {
  console.log('📦 Watch triggered with batch:', batch)
  for (const { type, data } of batch) {
    if (on[type]) {
      on[type](data)
    }
  }
}


function fallback_module() {
  return {
    drive:{}
    ,
    _: {
     '..': {    
        $:'' ,
        0: { value: { min: 0, max: 10 }  },
        mapping: {
          style: 'style',
          data: 'data'
        }    
      }
    }
  };
}

}).call(this)}).call(this,"/web/page.js")
},{"..":5,"../src/node_modules/STATE":6}]},{},[7]);
