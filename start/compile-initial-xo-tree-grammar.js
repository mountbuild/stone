
const parse = (verse) => {
  // given the hatch tree, compile into an object.
}

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
