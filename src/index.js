import { createReadStream, existsSync } from 'fs'
import { resolve } from 'path'

import probe from 'probe-image-size'
import interpolate from 'interpolate'
import easyimage from 'easyimage'
import invariant from 'invariant'

import { calculateTiles } from './utils'

async function convert({ source, target, rows = 3, columns = 3, margin = '25%', cwd = process.cwd() }) {
  invariant(typeof source === 'string', '"source" need to be a path')
  invariant(typeof rows === 'number', '"rows" need to be a number')
  invariant(typeof columns === 'number', '"columns" need to be a number')
  invariant(target.indexOf('{row}') >= 0, '"{row}" is required in target')
  invariant(target.indexOf('{column}') >= 0, '"{column}" is required in target')

  source = resolve(cwd, source)

  invariant(existsSync(source), 'source needs to exist')

  const input = createReadStream(source)

  const { width, height } = await probe(input)

  const tiles = calculateTiles({
    width, height, columns, rows, margin
  })

  await Promise.all(tiles.map(tile => {
    const tilePath = resolve(cwd, interpolate(target, { column: tile.column, row: tile.row }))

    const params = {
      src: source,
      dst: tilePath,
      cropwidth: tile.width,
      cropheight: tile.height,
      x: tile.left,
      y: tile.top,
      gravity: 'NorthWest'
    }

    return easyimage.crop(params);
  }))

  return
}

export default convert
