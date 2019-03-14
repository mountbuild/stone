
const Block = require('./block')

function buildChain(sheet, map, id, array) {
  const chain = getBlock(map, id)
  chain.store('weave', getBlock(map, sheet.houseField[`shard-4`].id))
  chain.store('field', getBlock(map, sheet.houseField.chain.id))

  let start
  let startBlock
  let front
  let frontBlock

  let i = 1

  start = array[i++]
  startBlock = new Block
  startBlock.store('weave', getBlock(map, sheet.houseField['chain-chair'].id))
  startBlock.store('block', start)
  startBlock.store('start', null)
  chain.store('start', startBlock)

  while (i < array.length) {
    front = array[i]
    frontBlock = new Block
    frontBlock.store('weave', getBlock(map, sheet.houseField['chain-chair'].id))
    frontBlock.store('block', front)
    frontBlock.store('start', startBlock)
    startBlock.store('front', frontBlock)
    startBlock = frontBlock
    i++
  }

  startBlock.store('front', null)
  chain.store('front', startBlock)

  return chain
}

function getBlock(map, id, scale) {
  return map[id] = map[id] || new Block(scale)
}

module.exports = {
  buildChain,
  getBlock
}
