[![Unix CI](https://img.shields.io/travis/sheerun/retile/master.svg?maxAge=2592000)](https://travis-ci.org/sheerun/retile)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/retile/master.svg)](https://ci.appveyor.com/project/sheerun/retile)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/retile)

> Split image into overlaping tiles with similar dimensions

## Installation

```
npm install -g retile
```

## CLI usage

```
Usage
  $ retile <input> <output>

Options
  --rows, -r     Number of rows to divide image into (default: 3)
  --columns, -c  Number of columns to divide image into (default: 3)
  --margin, -m   Margin for each tile in pixels or percent (default: 25%)

Examples
  $ retile input.png output/{row}_{column}.pn
```

## Programmatic usage

```node
var convert = require('retile')

convert({
  source: 'input.png',
  target: 'output-{column}-{row}.png',
  rows: 3,
  columns: 3,
  margin: '25%'
}).then(() => {
  console.log('Tiled successfully!')
})
```

## License

MIT
