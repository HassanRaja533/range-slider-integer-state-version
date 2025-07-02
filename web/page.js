// page.js
const STATE = require('../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)


const range_slider_integer = require('..')

const opts = { min: 0, max: 10 }

async function main() {
  const subs = await sdb.watch(onbatch)
  const rsi = await range_slider_integer(opts)
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

      }}
  };
}
