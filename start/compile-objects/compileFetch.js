
const shared = require('../shared')
const path = require('path')

function compileFetch(chain) {
  chain.forEach(sheet => {
    if (!sheet.sheetFetch) return
    sheet.sheetFetch.forEach(fetch => {
      let trace = getFetchTrace(fetch.trace, sheet.dir)
      compileOneFetch(trace, fetch, sheet, chain)
    })
  })
}

module.exports = compileFetch

function compileOneFetch(trace, fetch, sheet, chain) {
  if (fetch.catch) {
    let fetchedSheet = shared.fetchMatchTrace(chain, `${trace}/verse.xo`)[0]
    fetch.catch.forEach(_catch => {
      // find the match
      let KEY = _catch.catchField
      let KEY2 = _catch.catchBrand
      if (KEY == 'trace') KEY = 'traceWrite'
      if (KEY == 'fetch') KEY = 'sheetFetch'
      if (KEY == 'field') KEY = 'sheetField'
      if (KEY == 'force') KEY = 'sheetForce'
      if (!fetchedSheet) throw `${KEY}:${KEY2} ${sheet.trace} - ${trace}`
      if (!fetchedSheet[KEY]) throw `${KEY}:${KEY2} ${sheet.trace} - ${trace}`
      if (!fetchedSheet[KEY][KEY2]) throw `${KEY}:${KEY2} ${sheet.trace} - ${trace}`
      let found = fetchedSheet[KEY][KEY2]
      let key
      sheet.houseForce = sheet.houseForce || {}
      sheet.houseField = sheet.houseField || {}
      sheet.houseState = sheet.houseState || {}
      sheet.houseHatch = sheet.houseHatch || {}
      sheet.houseMatch = sheet.houseMatch || {}
      sheet.houseCatch = sheet.houseCatch || {}
      sheet.houseTheme = sheet.houseTheme || {}
      sheet.houseTraceWrite = sheet.houseTraceWrite || {}
      switch (KEY) {
        case 'sheetField':
          key = 'houseField'
          break
        case 'sheetForce':
          key = 'houseForce'
          break
        case 'state':
          key = 'houseState'
          break
        case 'hatch':
          key = 'houseHatch'
          break
        case 'match':
          key = 'houseMatch'
          break
        case 'catch':
          key = 'houseCatch'
          break
        case 'theme':
          key = 'houseTheme'
          break
        case 'traceWrite':
          key = 'houseTraceWrite'
          break
      }

      // let key = _catch.state ? _catch.state.field : _catch.catchField
      let key2 = _catch.state ? _catch.state.brand : _catch.catchBrand
      sheet[key][key2] = found
    })
  }
  if (fetch.fetch) {
    fetch.fetch.forEach(f => {
      let t = getFetchTrace(trace, f.trace)
      compileOneFetch(t, f, sheet, chain)
    })
  }
}

function getFetchTrace(trace, dir) {
  if (trace.match(/@mount/)) {
    let parts = trace.split('/')
    parts.shift()
    parts.splice(1, 0, 'stack')
    return path.resolve(`../${parts.join('/')}`)
  } else if (trace.match(/^\./)) {
    return path.resolve(dir, trace)
  } else {
    return `${trace}${dir}`
  }
}
