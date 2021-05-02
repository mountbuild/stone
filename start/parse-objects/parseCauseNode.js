
const parseStateFieldNode = require('./parseStateFieldNode')
const parseBuildValue = require('./parseBuildValue')
const shared = require('../shared')

function parseCauseNode(sheet, verse, type) {
  const brand = shared.getBrandFromFirst(verse)
  const cause = {
    field: type || `cause`,
    force: brand,
    mount: [],
    catch: {}
  }
  verse.verse.slice(1).forEach(verse => {
    let _catch
    switch (verse.brand) {
      case 'mount':
        const mount = parseCause_mount(sheet, verse)
        cause.mount.push(mount)
        break
      case 'chain':
        const chain = parseCause_chain(sheet, verse)
        cause.mount.push(chain)
        break
      case 'catch':
        _catch = parseCause_catch(sheet, verse)
        break
      case 'raise':
        _catch = parseCause_raise(sheet, verse)
        break
      case 'throw':
        _catch = parseCause_throw(sheet, verse)
        break
      case 'store':
        _catch = parseCause_store(sheet, verse)
        break
      case 'stack':
        _catch = parseCause_stack(sheet, verse)
        break
    }
    if (_catch) {
      cause.catch[_catch.brand] = cause.catch[_catch.brand] || []
      cause.catch[_catch.brand].push(_catch)
    }
  })
  return cause
}

module.exports = parseCauseNode

function parseCause_mount(sheet, verse) {
  const brand = shared.getPathFromFirst(verse)
  const build = parseBuildValue(sheet, verse.verse[1])
  const mount = {
    field: `cause-mount`,
    brand,
    build
  }
  return mount
}

function parseCause_chain(sheet, verse) {
  const brand = shared.getPathFromFirst(verse)
  const build = parseBuildValue(sheet, verse.verse[1])
  const mount = {
    field: `cause-mount`,
    brand,
    build
  }
  return mount
}

function parseCause_catch(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand,
    latch: null,
    start: [],
    cause: [],
    force: {}
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'latch':
        const latch = parseCause_catch_latch(sheet, verse)
        _catch.latch = latch
        break
      case 'store':
        const store = parseCause_catch_store(sheet, verse)
        _catch.cause.push(store)
        break
      case 'stack':
        const stack = parseCause_catch_stack(sheet, verse)
        _catch.cause.push(stack)
        break
      case 'throw':
        const _throw = parseCause_catch_throw(sheet, verse)
        _catch.cause.push(_throw)
        break
      case 'raise':
        const raise = parseCause_catch_raise(sheet, verse)
        _catch.cause.push(raise)
        break
      case 'cause':
        const cause = parseCauseNode(sheet, verse)
        _catch.cause.push(cause)
        break
      case 'start':
        const start = parseStateFieldNode(sheet, verse)
        _catch.start.push(start)
        break
      case 'force':
        const nestedForce = exports.parseForce_force(sheet, verse)
        _catch.force[nestedForce.brand] = nestedForce
        break
      case 'state':
        const state = parseCause_catch_state(sheet, verse)
        _catch.cause.push(state)
        break
      case 'write':
        const write = parseCause_catch_write(sheet, verse)
        _catch.cause.push(write)
        break
      case 'claim':
        const claim = parseCause_catch_claim(sheet, verse)
        _catch.cause.push(claim)
        break
      case 'stall':
        const stall = parseCause_catch_stall(sheet, verse)
        _catch.cause.push(stall)
        break
    }
  })
  return _catch
}

// raise x
function parseCause_raise(sheet, verse) {
  return parseRaiseThrow(sheet, `raise`, verse)
}

// throw x
function parseCause_throw(sheet, verse) {
  return parseRaiseThrow(sheet, `throw`, verse)
}

// store x/value[index]
function parseCause_store(sheet, verse) {
  return parseStoreStack(sheet, `store`, verse)
}

function parseCause_stack(sheet, verse) {
  return parseStoreStack(sheet, `stack`, verse)
}

function parseCause_catch_latch(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  return brand
}

function parseCause_catch_store(sheet, verse) {
  return shared.parseStateStoreStack(sheet, `store`, verse)
}

function parseCause_catch_state(sheet, verse) {
  return parseStateFieldNode(sheet, verse)
}

function parseCause_catch_raise(sheet, verse) {
  return shared.buildRaiseThrow(sheet, `raise`, verse)
}

function parseCause_catch_throw(sheet, verse) {
  return shared.buildRaiseThrow(sheet, `throw`, verse)
}

function parseCause_catch_stack(sheet, verse) {
  return shared.parseStateStoreStack(sheet, `stack`, verse)
}

function parseCause_catch_write(sheet, verse) {
  return shared.buildRaiseThrow(sheet, `write`, verse)
}

function parseCause_catch_claim(sheet, verse) {
  console.log(`todo: parseCause_catch_claim`)
}

function parseCause_catch_stall(sheet, verse) {
  const cause = {
    field: `cause`,
    force: `still`,
    mount: [],
    catch: {}
  }
  return cause
}

function parseRaiseThrow(sheet, field, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand: `build`,
    latch: null,
    start: [
      {
        field: `state-field`,
        brand: `build`
      }
    ],
    cause: [
      {
        field: `cause`,
        force: field,
        mount: [
          {
            field: `cause-mount`,
            brand: `brand`,
            build: {
              field: `share`,
              trace: brand,
              write: false,
              drive: null
            }
          },
          {
            field: `cause-mount`,
            brand: `build`,
            build: {
              field: `share`,
              trace: `build`,
              write: false,
              drive: null
            }
          }
        ]
      }
    ],
    force: {}
  }
  return _catch
}

function parseStoreStack(sheet, field, verse) {
  const trace = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand: `build`,
    latch: null,
    start: [
      {
        field: `state-field`,
        brand: `build`
      }
    ],
    cause: [
      {
        field: `cause`,
        force: field,
        mount: [
          {
            field: `cause-mount`,
            brand: `trace`,
            build: {
              field: `share`,
              trace: trace,
              write: false,
              drive: null
            }
          },
          {
            field: `cause-mount`,
            brand: `build`,
            build: {
              field: `share`,
              trace: `build`,
              write: false,
              drive: null
            }
          }
        ]
      }
    ],
    force: {}
  }
  return _catch
}
