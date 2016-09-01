#!/usr/bin/env node

import meow from 'meow'
import convert from './index'

const cli = meow(`
  Usage
    $ retile <input> <output>

  Options
    --rows, -r     Number of rows to divide image into (default: 3)
    --columns, -c  Number of columns to divide image into (default: 3)
    --margin, -m   Margin for each tile in pixels or percent (default: 25%)

  Examples
    $ retile input.png output/{row}_{column}.png
`, {
  inferType: true,
  alias: {
    columns: 'c',
    rows: 'r',
    margin: 'm'
  }
})

function exit() {
  console.log(cli.help)
  process.exit(1)
}

async function main() {
  const source = cli.input[0]
  const target = cli.input[1]

  if (!source || !target) {
    exit()
  }

  await convert({
    source,
    target,
    rows: cli.flags.rows,
    columns: cli.flags.columns,
    margin: cli.flags.margin
  })
}

main()
