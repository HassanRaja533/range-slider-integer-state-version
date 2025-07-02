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
