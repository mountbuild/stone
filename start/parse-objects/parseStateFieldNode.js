
const shared = require('../shared')

function parseMountNode(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const mount = {
    field: `state-field`,
    brand,
    match: undefined,
    start: undefined
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        mount.match = parseMount_match(sheet, verse)
        break
      case 'field':
        mount.match = parseMount_field(sheet, verse)
        break
      case 'crown':
        mount.match = parseMount_crown(sheet, verse)
        break
      case 'chain':
        mount.match = parseMount_chain(sheet, verse)
        break
      case 'weave':

        break
      case 'state':
        mount.state = parseMount_state(sheet, verse)
        break
    }
  })
  return mount
}

module.exports = parseMountNode

function parseMount_match(sheet, verse) {

}

function parseMount_field(sheet, verse) {
  const trace = shared.getBrandFromFirst(verse)
  return {
    field: `match-field`,
    trace
  }
}

function parseMount_crown(sheet, verse) {

}

function parseMount_chain(sheet, verse) {
  const trace = shared.getBrandFromFirst(verse)
  return {
    field: `match-chain`,
    match: [
      {
        field: `match-field`,
        trace
      }
    ]
  }
}

function parseMount_state(sheet, verse) {

}
