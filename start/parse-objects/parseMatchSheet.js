
const parseFetchTopLevelNode = require('./parseFetchTopLevelNode')
const shared = require('../shared')

function parseMatchSheet(sheet) {
  sheet.match = []
  sheet.fetch = []
  sheet.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseMatch_fetch(stack, verse)
        stack.fetch.push(fetch)
        break
      case 'match':
        const match = parseMatch_match(sheet, verse)
        sheet.match.push(match)
        break
      case 'slate':
        // do something with this
        break
      default: shared.throwVerse(verse, sheet)
    }
  })
}

module.exports = parseMatchSheet

function parseMatch_fetch(stack, verse) {
  return parseFetchTopLevelNode(stack, verse)
}

function parseMatch_match(sheet, verse) {
  const trace = shared.getPathFromFirst(verse)
  const match = {
    trace,
    batch: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'batch':
        const batch = parseMatch_match_batch(sheet, verse)
        match.batch.push(batch)
        break
      default: shared.throwVerse(verse, sheet)
    }
  })
  return match
}

function parseMatch_match_batch(sheet, verse) {
  const trace = shared.getPathFromFirst(verse)
  const batch = {
    trace
  }
  return batch
}
