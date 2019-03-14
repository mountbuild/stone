
const parseStateFieldNode = require('./parseStateFieldNode')
const parseBuildValue = require('./parseBuildValue')
const parseCauseNode = require('./parseCauseNode')
const shared = require('../shared')

function parseCheckNode(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const check = {
    field: `check`,
    force: brand,
    cause: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'cause':
        const cause = parseCauseNode(sheet, verse)
        check.cause.push(cause)
        break
    }
  })
  return check
}

module.exports = parseCheckNode
