
const parseFetchTopLevelNode = require('./parseFetchTopLevelNode')
const shared = require('../shared')
const path = require('path')
const glob = require('glob')

function parseMountSheet(stack, chain) {
  stack.match = stack.match || []
  stack.theme = stack.theme || {}
  stack.fetch = stack.fetch || []
  stack.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseMount_fetch(stack, verse)
        stack.fetch.push(fetch)
        break
      case 'mount':
        parseVerse_mount(stack, verse)
        break
    }
  })
  const traces = chain.map(x => x.trace)
  stack.match.forEach(match => {
    match.match.forEach(verse => {
      stack.theme[match.theme] = stack.theme[match.theme] || []
      if (traces.includes(verse)) {
        stack.theme[match.theme].push(verse)
      }
    })
  })
}

module.exports = parseMountSheet

function parseMount_fetch(stack, verse) {
  return parseFetchTopLevelNode(stack, verse)
}

function parseVerse_mount(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'match':
        const v = parseVerse_theme_match(path.dirname(sheet.trace), verse)
        sheet.match.push({
          theme: brand,
          match: v
        })
        break
    }
  })
}

function parseVerse_theme_match(trace, verse) {
  const v = glob.sync(path.join(trace, shared.getPathFromFirst(verse)))
  return v
}
