
const parseReach = require('./parseReach')

function parseBuildValue(sheet, verse) {
  if (verse.brand.match(/\|/)) {
    let string = verse.brand.trim().substr(1, verse.brand.trim().length - 2)
    return {
      field: 'write',
      build: string
    }
  } else if (verse.brand.match(/^\-?\d+/)) {
    let count = parseInt(verse.brand, 10)
    return {
      field: 'count',
      build: count
    }
  } else {
    switch (verse.brand) {
      case 'share': return parseReach(sheet, verse)
      case 'shift': return parseReach(sheet, verse)
      case 'clone': return parseReach(sheet, verse)
      case 'black':
        return {
          field: 'shift',
          build: false
        }
      case 'white':
        return {
          field: 'shift',
          build: true
        }
      case 'blank':
        return {
          field: 'blank'
        }
      default:
        return {
          field: `brand`,
          write: verse.brand
        }
    }
  }
}

module.exports = parseBuildValue
