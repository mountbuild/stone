
const parseFetchTopLevelNode = require('./parseFetchTopLevelNode')

function parseDriveMountSheet(sheet) {
  sheet.sheetMount = sheet.sheetMount || []
  sheet.sheetFetch = sheet.sheetFetch || []

  sheet.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseFetchTopLevelNode(sheet, verse)
        sheet.sheetFetch.push(fetch)
        break
      case 'mount':
        const mount = parseMount(sheet, verse)
        sheet.sheetMount.push(mount)
        break
    }
  })
}

module.exports = parseDriveMountSheet

function parseMount(sheet, verse) {
  const start = verse.verse[0].brand
  const front = verse.verse[1] && verse.verse[1].brand
  return {
    field: `drive-mount`,
    start,
    front
  }
}
