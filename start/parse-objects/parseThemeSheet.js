
const parseForceTopLevelNode = require('./parseForceTopLevelNode')
const parseFieldTopLevelNode = require('./parseFieldTopLevelNode')
const parseFetchTopLevelNode = require('./parseFetchTopLevelNode')
const parseCauseNode = require('./parseCauseNode')
const parseStateNode = require('./parseStateNode')
const shared = require('../shared')

function parseTheme(stack) {
  stack.theme = {}
  stack.fetch = stack.fetch || []
  stack.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseTheme_fetch(stack, verse)
        stack.fetch.push(fetch)
        break
      case 'theme':
        const theme = parseTheme_theme(stack, verse)
        stack.theme[theme.brand] = theme
        break
      default: shared.throwVerse(verse, stack)
    }
  })
}

module.exports = parseTheme

function parseTheme_fetch(stack, verse) {
  return parseFetchTopLevelNode(stack, verse)
}

function parseTheme_theme(stack, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const theme = {
    brand,
    hatch: [],
    block: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'fetch':
        const fetch = parseFetchTopLevelNode(stack, verse)
        theme.block.push(fetch)
        break
      case 'hatch':
        // const hatch = parseTheme_theme_hatch(stack, verse)
        // theme.block.push(hatch)
        break
      case 'state':
        const state = parseTheme_theme_state(stack, verse)
        theme.block.push(state)
        break
      case 'cause':
        const cause = parseTheme_theme_cause(stack, verse)
        theme.block.push(cause)
        break
      case 'force':
        const force = parseTheme_theme_force(stack, verse)
        theme.block.push(force)
        break
      case 'field':
        const field = parseTheme_theme_field(stack, verse)
        theme.block.push(field)
        break
    }
  })

  return theme
}

function parseTheme_theme_hatch(sheet, verse) {

}

function parseTheme_theme_state(stack, verse) {
  return parseStateNode(stack, verse)
}

function parseTheme_theme_cause(stack, verse) {
  return parseCauseNode(stack, verse)
}

function parseTheme_theme_force(stack, verse) {
  return parseForceTopLevelNode(stack, verse)
}

function parseTheme_theme_field(stack, verse) {
  return parseFieldTopLevelNode(stack, verse)
}

