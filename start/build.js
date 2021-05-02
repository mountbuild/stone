
const fs = require('fs')
const path = require('path')
const trace_sheet = require('../trace/verse')
const files = require('./files')
const shared = require('./shared')
const parseStackSheet = require('./parse-objects/parseStackSheet')
const parseMountSheet = require('./parse-objects/parseMountSheet')
const parseThemeSheet = require('./parse-objects/parseThemeSheet')
const parseHatchSheet = require('./parse-objects/parseHatchSheet')
const parseBuildSheet = require('./parse-objects/parseBuildSheet')
const parseMatchSheet = require('./parse-objects/parseMatchSheet')
const writeJSDriverSheet = require('./write-objects/writeJSDriverSheet')
const writeJSForces = require('./write-objects/writeJSForces')
const writeJSModules = require('./write-objects/writeJSModules')
const injectTheme = require('./compile-objects/injectTheme')

const mount = (src, publicPath, privatePath) => {
  return fetch(`@mount/${src}${publicPath}`, `../${src}${privatePath}`)
}

const fetch = (sheet, trace) => {
  const write = fs.readFileSync(trace, 'utf-8')
  const verse = trace_sheet(write)
  return {
    sheet,
    trace: path.resolve(trace),
    dir: path.dirname(path.resolve(trace)),
    verse
  }
}

const start = () => {
  const chain = files.map(x => mount(x.src, x.publicPath, x.privatePath))

  const mountStart = fetchBase(chain, '@mount/start')
  parseStackSheet(mountStart)
  const mounts = mountStart.stack.mount.map(verse => fetchByTrace(chain, verse))
  mounts.forEach(verse => parseMountSheet(verse, chain))

  // const mountWrite = fetchBase(chain, '@mount/write')
  // parseStackSheet(mountWrite)
  // const mountWrites = mountWrite.stack.mount.map(verse => fetchByTrace(chain, verse))
  // mountWrites.forEach(verse => parseMountSheet(verse, chain))

  const mountDrive = fetchBase(chain, '@mount/drive-js')
  parseStackSheet(mountDrive)
  const mountDrives = mountDrive.stack.mount.map(verse => fetchByTrace(chain, verse))
  mountDrives.forEach(verse => parseMountSheet(verse, chain))

  const mountStone = fetchBase(chain, '@mount/stone')
  parseStackSheet(mountStone)
  const mountStones = mountStone.stack.mount.map(verse => fetchByTrace(chain, verse))
  mountStones.forEach(verse => parseMountSheet(verse, chain))

  // const traces = shared.fetchMatchBase(chain, /\/write\/\w+\/trace/)
  // traces.forEach(parseTraceSheet)
  const themes = shared.fetchMatchBase(chain, /@mount\/start\/theme/)
  themes.forEach(parseThemeSheet)
  const hatches = shared.fetchMatchBase(chain, /@mount\/start\/hatch\//)
  hatches.forEach(parseHatchSheet)
  const drivers = shared.fetchMatchBase(chain, /@mount\/drive/)
    .filter(x => !x.trace.match('mapping'))
  mounts.forEach(applyThemes)
  mountDrives.forEach(applyThemes)
  mountStones.forEach(applyThemes)

  function applyThemes(verse) {
    Object.keys(verse.theme).forEach(trace => {
      const themeSheet = shared.fetchMatchBase(chain, new RegExp(`@mount/start/theme/${trace}`))[0] || shared.fetchMatchBase(chain, new RegExp(`@mount/start/theme/force/${trace}`))[0]
      if (!themeSheet || !themeSheet.theme) throw `${trace} - @mount/start/theme/${trace}`
      verse.theme[trace].forEach(trace2 => {
        const sheet = fetchByTrace(chain, trace2)
        injectTheme(themeSheet.theme[trace], sheet)
      })
    })
  }

  // const mappings = shared.fetchMatchBase(chain, /mapping/)
  // mappings.forEach(parseDriveMountSheet)
  const forces = []
  forces.push(...shared.fetchMatchBase(chain, /@mount\/start\/force/))
  forces.push(...shared.fetchMatchBase(chain, /@mount\/stone\/check/))

  const builds = []
  builds.push(...shared.fetchMatchBase(chain, /@mount\/start\/field/))
  builds.push(...shared.fetchMatchBase(chain, /@mount\/start\/force/))
  builds.push(...shared.fetchMatchBase(chain, /@mount\/start\/check/))
  builds.push(...shared.fetchMatchBase(chain, /@mount\/start\/mount/))
  builds.push(...shared.fetchMatchBase(chain, /@mount\/stone\/check/))
  builds.push(...shared.fetchMatchBase(chain, /@mount\/drive-(js|node)$/))
  builds.push(...drivers)
  builds.forEach(parseBuildSheet)
  const matches = shared.fetchMatchBase(chain, /@mount\/start\/match/)
  matches.forEach(parseMatchSheet)
  const jsBody = drivers.map(writeJSDriverSheet).join('')
  const jsBody2 = forces.map(writeJSForces).join('\n')
  const jsHeader = writeJSDriverSheet.writeHeader([], jsBody + jsBody2).join('')
  const js = [jsHeader].join('')
  fs.writeFileSync(`build/build.js`, js)
}

function buildCloud(chain) {
  let cloud = {}
  chain.forEach(sheet => {
    let parts = sheet.sheet.split('/')
    let houseTrace = parts.shift().replace(/@/, '')
    let stackTrace = parts.shift()
    let house = cloud[houseTrace] = cloud[houseTrace] || { brand: houseTrace, stack: {} }
    let stack = house.stack[stackTrace] = house.stack[stackTrace] || { brand: stackTrace, store: {} }
    let i = 0
    let node = stack
    while (i < parts.length) {
      let part = parts[i++]
      node.store = node.store || {}
      node = node.store[part] = node.store[part] || {}
    }
    node.sheet = sheet
  })
  return { house: cloud }
}

const fetchBase = (chain, trace) => {
  for (let i = 0, n = chain.length; i < n; i++) {
    let block = chain[i]
    if (block.sheet === trace) {
      return block
    }
  }
}

const fetchByTrace = (chain, trace) => {
  for (let i = 0, n = chain.length; i < n; i++) {
    let block = chain[i]
    if (block.trace === trace) {
      return block
    }
  }
}

function check(earth) {
  // fs.writeFileSync('build/earth.json', JSON.stringify(earth, null, 2))
}

start()
