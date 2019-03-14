
const parseBuildValue = require('./parse-objects/parseBuildValue')

function getBrand(verse) {
  return verse.verse[0].brand
}

function getPathFromFirst(verse) {
  return verse.verse[0].brand.trim()
}

function getBrandFromFirst(verse) {
  return verse.verse[0].brand.trim()
}

function getString(verse) {
  return verse.brand.trim().substr(1, verse.brand.trim().length - 2)
}

function getStringFromFirst(verse) {
  return getString(verse.verse[0])
}

function throwVerse(verse, sheet) {
  throw verse.brand + ' - ' + sheet.trace
}

const fetchMatchTrace = (chain, trace) => {
  const matches = []
  for (let i = 0, n = chain.length; i < n; i++) {
    let block = chain[i]
    if (block.trace.match(trace)) {
      matches.push(block)
    }
  }
  return matches
}

const fetchMatchBase = (chain, trace) => {
  const matches = []
  for (let i = 0, n = chain.length; i < n; i++) {
    let block = chain[i]
    if (block.sheet.match(trace)) {
      matches.push(block)
    }
  }
  return matches
}

function buildRaiseThrow(sheet, field, verse) {
  if (verse.verse.length == 1) {
    const build = verse.verse[0] && parseBuildValue(sheet, verse.verse[0])
    const cause = {
      field: `cause`,
      force: field,
      mount: [
        {
          field: `cause-mount`,
          brand: `brand`,
          build: `build`
        },
        {
          field: `cause-mount`,
          brand: `build`,
          build: build
        }
      ]
    }
    return cause
  } else {
    const brand = getBrandFromFirst(verse)
    const build = verse.verse[1] && parseBuildValue(sheet, verse.verse[1])
    const cause = {
      field: `cause`,
      force: field,
      mount: [
        {
          field: `cause-mount`,
          brand: `brand`,
          build: brand
        },
        {
          field: `cause-mount`,
          brand: `build`,
          build: build
        }
      ]
    }
    return cause
  }
}

function parseStateStoreStack(sheet, field, verse) {
  const start = getPathFromFirst(verse)
  const build = verse.verse[1] && parseBuildValue(sheet, verse.verse[1])
  const cause = {
    field: `cause`,
    force: field,
    mount: [
      {
        field: `cause-mount`,
        brand: `start`,
        build: {
          field: `share`,
          trace: start,
          write: true,
          drive: null
        }
      },
      {
        field: `cause-mount`,
        brand: `front`,
        build: build
      }
    ]
  }
  return cause
}

module.exports = {
  getBrand,
  getString,
  getStringFromFirst,
  getPathFromFirst,
  throwVerse,
  getBrandFromFirst,
  fetchMatchTrace,
  fetchMatchBase,
  buildRaiseThrow,
  parseStateStoreStack
}
