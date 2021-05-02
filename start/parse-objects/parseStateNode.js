
const shared = require('../shared')

function parseStateNode(sheet, verse) {
  const brand = shared.getPathFromFirst(verse)
  const state = {
    field: `state-field`,
    brand
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        state.match = parseState_match(sheet, verse)
        break
      case 'field':
        state.match = parseState_field(sheet, verse)
        break
      case 'crown':
        state.match = parseState_crown(sheet, verse)
        break
      case 'chain':
        state.match = parseState_chain(sheet, verse)
        break
      case 'weave':
        state.match = parseState_weave(sheet, verse)
        break
      case 'state':
        state.state = parseState_state(sheet, verse)
        break
    }
  })
  return state
}

module.exports = parseStateNode

function parseState_match(sheet, verse) {

}

function parseState_field(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const match = {
    field: `match-field`,
    matchField: brand
  }
  return match
}

function parseState_crown(sheet, verse) {

}

function parseState_chain(sheet, verse) {
  const chainBrand = shared.getBrandFromFirst(verse)
  const chain = {
    field: `match-chain`,
    match: {
      field: `match-field`,
      matchField: chainBrand
    }
  }
  return chain
}

function parseState_state(sheet, verse) {

}

function parseState_weave(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const match = {
    field: `match-weave`,
    matchWeave: brand,
    match: undefined
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'chain':
        const chainBrand = shared.getBrandFromFirst(verse)
        const chain = {
          field: `match-chain`,
          match: {
            field: `match-field`,
            matchField: chainBrand
          }
        }
        match.match = chain
        break
      case 'field':
        const fieldBrand = shared.getBrandFromFirst(verse)
        const field = {
          field: `match-field`,
          matchField: fieldBrand
        }
        match.match = field
        break
    }
  })
  return match
}
