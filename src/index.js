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

  const range_slider = range(opts, protocol)
  const input_integer = integer(opts, protocol)

  
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
    },

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
  };
}

}