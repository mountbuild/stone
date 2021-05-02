
const parseStateNode = require('./parseStateNode')
const shared = require('../shared')

function parseFieldTopLevelNode(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const field = {
    field: 'field',
    brand,
    house: [],
    state: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'field':
        field.house.push({
          trace: shared.getBrandFromFirst(verse)
        })
        break
      case 'state':
        const state = parseField_state(sheet, verse)
        field.state.push(state)
        break
      case 'bound':
        const bound = parseField_bound(sheet, verse)
        field.state.push(bound)
        break
    }
  })
  return field
}

module.exports = parseFieldTopLevelNode

function parseField_state(sheet, verse) {
  return parseStateNode(sheet, verse)
}

function parseField_bound(sheet, verse) {
  let state = parseStateNode(sheet, verse)
  state.bound = true
  return state
}
