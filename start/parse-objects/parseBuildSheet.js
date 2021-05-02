
const parseFetchTopLevelNode = require('./parseFetchTopLevelNode')
const parseFieldTopLevelNode = require('./parseFieldTopLevelNode')
const parseForceTopLevelNode = require('./parseForceTopLevelNode')
const parseCauseNode = require('./parseCauseNode')
const parseCheckNode = require('./parseCheckNode')

function parseBuildSheet(sheet) {
  sheet.sheetField = sheet.sheetField || {}
  sheet.sheetForce = sheet.sheetForce || {}
  sheet.sheetFetch = sheet.sheetFetch || []
  sheet.sheetCause = sheet.sheetCause || []
  sheet.sheetCheck = sheet.sheetCheck || []
  sheet.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseFetchTopLevelNode(sheet, verse)
        sheet.sheetFetch.push(fetch)
        break
      case 'field':
        const field = parseFieldTopLevelNode(sheet, verse)
        sheet.sheetField[field.brand] = field
        break
      case 'force':
        parseForceTopLevelNode(sheet, verse)
        break
      case 'state':

        break
      case 'cause':
        const cause = parseCauseNode(sheet, verse)
        sheet.sheetCause.push(cause)
        break
      case 'check':
        const check = parseCheckNode(sheet, verse)
        sheet.sheetCheck.push(check)
        break
    }
  })
}

module.exports = parseBuildSheet
