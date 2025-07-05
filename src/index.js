 const STATE = require('STATE') // Import custom STATE module for managing local state and drive
 const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
 const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools

 
 const range = require('range-slider-state-version-hr')
 const integer = require('input-integer-state-version-hr')

 module.exports = range_slider_integer

 async function range_slider_integer (opts) {
   console.log(' range_slider_integer received opts:', opts)
   console.log('SID:', opts.sid)
   const { id, sdb } = await get(opts.sid)

  const on = {
    value: handleValue,
    style: inject
  }
  
   // await sdb.watch(onbatch)
   
  //const config = await sdb.drive.get('data/opts.json')

    const state = {}
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const rsi = document.createElement('div')
    rsi.classList.add('rsi')
    const subs = await sdb.watch(onbatch)
    console.log(subs)
    const range_slider = await range(subs[0], protocol)
    const input_integer = await integer(subs[1], protocol)
    
  
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

  function fallback_instance(opts) {
  //console.log('make instance:', opts);
  return {
    _: {
      'range-slider-state-version-hr': {
         0: { value: { min: 0, max: 10 }  },
      },

      'input-integer-state-version-hr': {
         0: { value: { min: 0, max: 10 }  },
      },
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
      },
      'data/': {
          'opts.json': {
            raw: opts 
          }
        }
    }
  }
  };
}

}