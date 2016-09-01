import invariant from 'invariant'
import percent from 'percent'
import computeLayout from 'css-layout'
import merge from 'lodash.merge'

export function calculateTiles(options = {}) {
  invariant(typeof options.width === 'number', 'Must provide numeric width to calculateTiles')
  invariant(typeof options.height === 'number', 'Must provide numeric height to calculateTiles')
  invariant(options.rows !== undefined, 'Must provide rows to calculateTiles')
  invariant(options.columns !== undefined, 'Must provide columns to calculateTiles')

  const { width, height, rows: rowsCount, columns: columnsCount } = options

  const rowStyle = () => ({ flex: 1 })
  const columnStyle = () => ({ flex: 1 })

  const treeNode = {
    style: {
      width,
      height,
      flexWrap: 'nowrap',
      flexDirection: 'column'
    },
    children: []
  }

  for (let y = 0; y < rowsCount; y++) {
    const columnNodes = []

    for (let x = 0; x < columnsCount; x++) {
      columnNodes.push({
        style: columnStyle(merge({}, options, { row: y, column: y }))
      })
    }

    treeNode.children.push({
      style: merge(
        {
          flexDirection: 'row',
          flexWrap: 'nowrap'
        },
        rowStyle(merge({}, options, { row: y }))
      ),
      children: columnNodes
    })
  }

  computeLayout(treeNode)

  const result = []

  for (let y = 0; y < rowsCount; y++) {
    const row = treeNode.children[y]

    for (let x = 0; x < columnsCount; x++) {
      const column = row.children[x]

      result.push({
        row: y,
        column: x,
        left: Math.round(column.layout.left),
        top: Math.round(row.layout.top),
        right: Math.round(column.layout.left + column.layout.width),
        bottom: Math.round(row.layout.top + row.layout.height)
      })
    }
  }

  const margin = options.margin || 0

  result.forEach(tile => {
    const tileWidth = tile.right - tile.left
    const tileHeight = tile.bottom - tile.top

    let marginVertical
    let marginHorizontal

    if (percent.valid(margin)) {
      marginVertical = percent.convert(margin) / 100 * tileHeight
      marginHorizontal = percent.convert(margin) / 100 * tileWidth
    } else {
      marginVertical = marginHorizontal = margin
    }

    if (columnsCount > 1) {
      const marginLeft = Math.round(tile.column * marginHorizontal / (columnsCount - 1))
      const marginRight = marginHorizontal - marginLeft
      tile.left = Math.max(0, tile.left - marginLeft)
      tile.right = Math.min(width, tile.right + marginRight)
    }

    if (rowsCount > 1) {
      const marginTop = Math.round(tile.row * marginVertical / (rowsCount - 1))
      const marginBottom = marginVertical - marginTop
      tile.top = Math.max(0, tile.top - marginTop)
      tile.bottom = Math.min(height, tile.bottom + marginBottom)
    }
  })

  result.forEach(tile => {
    tile.width = tile.right - tile.left
    tile.height = tile.bottom - tile.top
    delete tile.right
    delete tile.bottom
  })

  return result
}
