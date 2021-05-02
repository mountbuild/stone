
const parseFetchTopLevelNode = require('./parseFetchTopLevelNode')
const shared = require('../shared')

function parseTraceSheet(sheet) {
  sheet.traceWrite = sheet.traceWrite || {}
  sheet.fetch = sheet.fetch || []
  sheet.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseFetchTopLevelNode(sheet, verse)
        sheet.fetch.push(fetch)
        break
      case 'trace':
        const trace = parseTrace_trace(sheet, verse)
        sheet.traceWrite[trace.brand] = trace
        break
    }
  })
}

module.exports = parseTraceSheet

function parseTrace_trace(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const trace = {
    brand,
    trace: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'trace':

        break
    }
  })
  return trace
}
