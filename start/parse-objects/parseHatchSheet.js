
const parseFetch = require('./parseFetchTopLevelNode')
const parseBuildNode = require('./parseBuildNode')
const shared = require('../shared')

function parseHatch(sheet) {
  sheet.fetch = []
  sheet.hatch = {}
  sheet.match = {}
  sheet.catch = {}
  sheet.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        parseHatch_fetch(sheet, verse)
        break
      case 'hatch':
        parseHatch_hatch(sheet, verse)
        break
      case 'match':
        parseHatch_match(sheet, verse)
        break
      case 'catch':
        parseHatch_catch(sheet, verse)
        break
      default: shared.throwVerse(verse, sheet)
    }
  })

  require('fs').writeFileSync(`build/hatch-${sheet.sheet.replace(/\//g, '-')}.json`, JSON.stringify(sheet, null, 2))

  if (!Object.keys(sheet.hatch).length) {
    throw sheet.trace
  }
}

module.exports = parseHatch

function parseHatch_fetch(sheet, verse) {
  const fetch = parseFetch(sheet, verse)
  sheet.fetch.push(fetch)
}

function parseHatch_hatch(sheet, verse) {
  const string = shared.getBrandFromFirst(verse)
  sheet.hatch[string] = true
}

function parseHatch_match(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const match = {
    field: `@mount/start/field/hatch/match`,
    brand,
    match: []
  }
  sheet.match[brand] = match
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        let match_match = parseHatch_match_match(sheet, verse)
        match.match.push(match_match)
        break
      case 'throw':
        match.throw = shared.getBrandFromFirst(verse)
        break
      default: shared.throwVerse(verse, sheet)
    }
  })
}

function parseHatch_match_match(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  switch (brand) {
    case 'crown': return parseHatch_match_match_crown(sheet, verse)
    case 'chain': return parseHatch_match_match_chain(sheet, verse)
    case 'brand': return parseHatch_match_match_brand(sheet, verse)
    case 'sieve': return parseHatch_match_match_sieve(sheet, verse)
    case 'weave': return parseHatch_match_match_weave(sheet, verse)
    case 'write': return parseHatch_match_match_write(sheet, verse)
    case 'field': return parseHatch_match_match_field(sheet, verse)
    default: shared.throwVerse(verse.verse[0], sheet)
  }
}

function parseHatch_match_match_crown(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/crown`,
    match: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        const child = parseHatch_match_match(sheet, verse)
        match.match.push(child)
        break
    }
  })
  return match
}

function parseHatch_match_match_chain(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/chain`,
    match: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        const child = parseHatch_match_match(sheet, verse)
        match.match.push(child)
        break
    }
  })
  return match
}

function parseHatch_match_match_sieve(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/sieve`,
    match: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        const child = parseHatch_match_match(sheet, verse)
        match.match.push(child)
        break
    }
  })
  return match
}

function parseHatch_match_match_weave(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/weave`,
    match: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        const child = parseHatch_match_match(sheet, verse)
        match.match.push(child)
        break
    }
  })
  return match
}

function parseHatch_match_match_write(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/write`
  }
  let write
  let throwing
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'write':
        write = shared.getBrandFromFirst(verse)
        break
      case 'throw':
        throwing = shared.getBrandFromFirst(verse)
        break
    }
    if (verse.brand.match(/\|/)) {
      write = verse.brand
    }
  })
  match.write = write
  match.throw = throwing
  return match
}

function parseHatch_match_match_field(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/field`
  }
  let matchField
  let throwing
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'field':
        matchField = shared.getBrandFromFirst(verse)
        break
      case 'throw':
        throwing = shared.getBrandFromFirst(verse)
        break
    }
  })
  match.matchField = matchField
  match.throw = throwing
  return match
}

function parseHatch_match_match_brand(sheet, verse) {
  const match = {
    field: `@mount/start/field/hatch/match/brand`,
    match: []
  }
  let matchBrand
  let throwing
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'brand':
        matchBrand = shared.getBrandFromFirst(verse)
        break
      case 'match':
        const child = parseHatch_match_match(sheet, verse)
        match.match.push(child)
        break
      case 'throw':
        throwing = shared.getBrandFromFirst(verse)
        break
    }
  })
  match.brand = matchBrand
  match.throw = throwing
  return match
}

function parseHatch_catch(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `@mount/start/field/hatch/catch`,
    brand,
    catch: [],
    build: null
  }
  sheet.catch[brand] = _catch
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'catch':
        let catch_catch = parseHatch_catch_catch(sheet, verse)
        _catch.catch.push(catch_catch)
        break
      case 'build':
        _catch.build = parseHatch_catch_build(sheet, verse)
        break
      default: shared.throwVerse(verse, sheet)
    }
  })
}

function parseHatch_catch_catch(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `@mount/start/field/hatch/catch/catch`,
    brand,
    catchField: undefined,
    catch: [],
    cause: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'catch':
        let catch_catch = parseHatch_catch_catch(sheet, verse)
        _catch.catch.push(catch_catch)
        break
      case 'store':
        let store = parseHatch_catch_store(sheet, verse)
        _catch.cause.push(store)
        break
      case 'stack':
        let stack = parseHatch_catch_stack(sheet, verse)
        _catch.cause.push(stack)
        break
      case 'field':
        let field = shared.getBrandFromFirst(verse)
        _catch.catchField = field
        break
      case 'build':
        _catch.build = parseHatch_catch_build(sheet, verse)
        break
      default: shared.throwVerse(verse, sheet)
    }
  })
  return _catch
}

function parseHatch_catch_store(sheet, verse) {
  const trace = shared.getPathFromFirst(verse)
  const cause = {
    field: `@mount/start/field/cause`,
    brand: `store`,
    mount: [
      {
        field: `mount`,
        brand: `start`,
        build: trace,
      },
      {
        field: `mount`,
        brand: `front`,
        build: {
          field: `share`,
          trace: `build`
        }
      }
    ]
  }
  return cause
}

function parseHatch_catch_stack(sheet, verse) {
  const trace = shared.getPathFromFirst(verse)
  const cause = {
    field: `cause`,
    brand: `stack`,
    mount: [
      {
        field: `mount`,
        brand: `start`,
        build: trace,
      },
      {
        field: `mount`,
        brand: `front`,
        build: {
          field: `share`,
          trace: `build`
        }
      }
    ]
  }
  return cause
}

function parseHatch_catch_build(sheet, verse) {
  return parseBuildNode(sheet, verse)
}
