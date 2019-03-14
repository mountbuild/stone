
function parseReach(sheet, verse) {
  const path = verse.verse[0].brand.trim()
  const { brand } = verse
  let write = false
  let drive
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'write':
        let writeBrand = verse.verse[0].brand.trim()
        switch (writeBrand) {
          case 'white':
            write = true
            break
          case 'black':
            write = false
            break
        }
        break
      case 'drive':

        break
    }
  })
  return {
    field: brand,
    trace: path,
    write,
    drive
  }
}

module.exports = parseReach
