
const shared = require('../shared')

function parseFetchTopLevelNode(sheet, verse) {
  const trace = shared.getPathFromFirst(verse)
  // just parse it into complete fetch tree just in case.
  const fetch = {
    field: 'fetch',
    trace,
    fetch: [],
    catch: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const nestedFetch = parseFetchTopLevelNode(sheet, verse)
        fetch.fetch.push(nestedFetch)
        break
      case 'catch':
        const _catch = parseFetch_catch(sheet, verse)
        fetch.catch.push(_catch)
        break
    }
  })
  return fetch
}

module.exports = parseFetchTopLevelNode

function parseFetch_catch(sheet, verse) {
  const _catch = {
    field: 'fetch-catch',
    catchField: verse.verse[0].brand,
    catchBrand: verse.verse[0].verse[0].brand,
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'store':
        const store = verse.verse[0]
        _catch.state = {
          field: store.brand,
          brand: store.verse[0].brand
        }
        break
      case 'stack':
        const stack = verse.verse[0]
        _catch.state = {
          field: stack.brand,
          brand: stack.verse[0].brand,
          chain: true
        }
        break
      case 'weave':
        const weave = verse.verse[0]
        _catch.state = {
          field: weave.brand,
          brand: weave.verse[0].brand,
          weave: true
        }
        break
    }
  })
  return _catch
}
