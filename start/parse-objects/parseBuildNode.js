
const shared = require('../shared')
const parseBuildValue = require('./parseBuildValue')

function parseBuildNode(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const build = {
    field: brand,
    mount: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'mount':
        let mount = parseBuild_mount(sheet, verse)
        build.mount.push(mount)
        break
      case 'throw':
        build.throw = shared.getBrandFromFirst(verse)
        break
      case 'stack':
        break
      case 'store':
        break
      case 'state':
        break
      case 'still':
        break
      default: shared.throwVerse(verse, sheet)
    }
  })
  return build
}

module.exports = parseBuildNode

function parseBuild_mount(sheet, verse) {
  const trace = shared.getPathFromFirst(verse)
  const mount = {
    trace,
    build: verse.verse[1] && parseBuildValue(sheet, verse.verse[1])
  }
  return mount
}
