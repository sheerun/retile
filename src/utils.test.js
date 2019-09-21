const { calculateTiles: originalCalculateTiles } = require('./utils')

function calculateTiles (params) {
  const tiles = originalCalculateTiles(params)

  tiles.forEach(tile => {
    delete tile.row
    delete tile.column
  })

  return tiles
}

test('can extract just single tile', () => {
  const result = calculateTiles({
    width: 20,
    height: 20,
    columns: 1,
    rows: 1
  })

  expect(result).toEqual([{ left: 0, top: 0, width: 20, height: 20 }])
})

test('can perform simple division without overlap', () => {
  const result = calculateTiles({
    width: 40,
    height: 20,
    columns: 2,
    rows: 2
  })

  expect(result).toEqual([
    { left: 0, top: 0, width: 20, height: 10 },
    { left: 20, top: 0, width: 20, height: 10 },
    { left: 0, top: 10, width: 20, height: 10 },
    { left: 20, top: 10, width: 20, height: 10 }
  ])
})

test('properly rounds on uneven divide', () => {
  const result = calculateTiles({
    width: 8,
    height: 8,
    columns: 3,
    rows: 3
  })

  expect(result).toEqual([
    { left: 0, top: 0, width: 3, height: 3 },
    { left: 3, top: 0, width: 2, height: 3 },
    { left: 5, top: 0, width: 3, height: 3 },
    { left: 0, top: 3, width: 3, height: 2 },
    { left: 3, top: 3, width: 2, height: 2 },
    { left: 5, top: 3, width: 3, height: 2 },
    { left: 0, top: 5, width: 3, height: 3 },
    { left: 3, top: 5, width: 2, height: 3 },
    { left: 5, top: 5, width: 3, height: 3 }
  ])
})

test('can perform simple division with margin in percents', () => {
  const result = calculateTiles({
    width: 40,
    height: 20,
    columns: 2,
    rows: 2,
    margin: '50%'
  })

  expect(result).toEqual([
    { left: 0, top: 0, width: 30, height: 15 },
    { left: 10, top: 0, width: 30, height: 15 },
    { left: 0, top: 5, width: 30, height: 15 },
    { left: 10, top: 5, width: 30, height: 15 }
  ])
})

test('properly rounds on uneven divide with overlap', () => {
  const result = calculateTiles({
    width: 60,
    height: 90,
    columns: 3,
    rows: 3,
    margin: '50%'
  })

  expect(result).toEqual([
    { left: 0, top: 0, width: 30, height: 45 },
    { left: 15, top: 0, width: 30, height: 45 },
    { left: 30, top: 0, width: 30, height: 45 },
    { left: 0, top: 22, width: 30, height: 45 },
    { left: 15, top: 22, width: 30, height: 45 },
    { left: 30, top: 22, width: 30, height: 45 },
    { left: 0, top: 45, width: 30, height: 45 },
    { left: 15, top: 45, width: 30, height: 45 },
    { left: 30, top: 45, width: 30, height: 45 }
  ])
})
