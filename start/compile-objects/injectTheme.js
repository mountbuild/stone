
function injectTheme(theme, sheet) {
  theme.block.forEach(block => {
    switch (block.field) {
      case 'force':
        sheet.houseForce = sheet.houseForce || {}
        sheet.houseForce[block.brand] = block
        break
      case 'field':
        sheet.houseField = sheet.houseField || {}
        sheet.houseField[block.brand] = block
        break
      case 'state':
        sheet.houseState = sheet.houseState || {}
        sheet.houseState[block.brand] = block
        break
      case 'fetch':
        sheet.sheetFetch = sheet.sheetFetch || []
        sheet.sheetFetch.push(block)
        break
    }
  })
}

module.exports = injectTheme
