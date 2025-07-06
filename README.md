# range-slider-integer-state-version

## Usage

```js
const range_slider_integer = require('range-slider-integer-state-version')

const opts = { min: 0, max: 10 }

async function main() {
  const input = await range_slider_integer(opts)
  document.body.append(input)
}

main()