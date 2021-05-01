
const parseCauseNode = require('./parseCauseNode')
const parseBuildValue = require('./parseBuildValue')
const parseStateFieldNode = require('./parseStateFieldNode')
const shared = require('../shared')

parseCauseNode.parseForce_force = parseForce_force

function parseForce(sheet, verse) {
  const force = parseForce_force(sheet, verse)
  sheet.sheetForce[force.brand] = force
}

function parseForce_force(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const force = {
    field: 'force',
    brand,
    start: [], // "state field" inputs
    cause: [],
    force: {}
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'force':
        const nestedForce = parseForce_force(sheet, verse)
        force.force[nestedForce.brand] = nestedForce
        break
      case 'start':
        const start = parseForce_start(sheet, verse)
        force.start.push(start)
        break
      case 'state':
        const state = parseForce_state(sheet, verse)
        force.cause.push(state)
        break
      case 'raise':
        const raise = parseForce_raise(sheet, verse)
        force.cause.push(raise)
        break
      case 'throw':
        const _throw = parseForce_throw(sheet, verse)
        force.cause.push(_throw)
        break
      case 'store':
        const store = parseForce_store(sheet, verse)
        force.cause.push(store)
        break
      case 'stack':
        const stack = parseForce_stack(sheet, verse)
        force.cause.push(stack)
        break
      case 'write':
        const write = parseForce_write(sheet, verse)
        force.cause.push(write)
        break
      case 'claim':
        const claim = parseForce_claim(sheet, verse)
        force.cause.push(claim)
        break
      case 'stall':
        const stall = parseForce_stall(sheet, verse)
        force.cause.push(stall)
        break
      case 'build':
        parseForce_build(sheet, force, verse)
        break
      case 'cause':
        const cause = parseForce_cause(sheet, verse)
        force.cause.push(cause)
        break
    }
  })
  return force
}

module.exports = parseForce

function parseForce_start(sheet, verse) {
  return parseStateFieldNode(sheet, verse)
}

// state foo/bar, 10
// state foo/bar, share x
function parseForce_state(sheet, verse) {
  return shared.parseStateStoreStack(sheet, `store`, verse)
}

// raise
// raise share path/nested[index]
// raise 10
// raise event
// raise event, share path/nested[index]
// raise event, 10
function parseForce_raise(sheet, verse) {
  return shared.buildRaiseThrow(sheet, `raise`, verse)
}

// throw
// throw share path/nested[index]
// throw 10
// throw event
// throw event, share path/nested[index]
// throw event, 10
function parseForce_throw(sheet, verse) {
  return shared.buildRaiseThrow(sheet, `throw`, verse)
}

function parseForce_store(sheet, verse) {
  return shared.parseStateStoreStack(sheet, `store`, verse)
}

function parseForce_stack(sheet, verse) {
  return shared.parseStateStoreStack(sheet, `stack`, verse)
}

function parseForce_write(sheet, verse) {
  return parseCauseNode(sheet, verse, 'write')
}

function parseForce_claim(sheet, verse) {
  console.log('todo: parseForce_claim')
}

function parseForce_stall(sheet, verse) {
  const cause = {
    field: `cause`,
    force: `still`,
    mount: []
  }
  return cause
}

function parseForce_build(sheet, force, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const cause = {
    field: `cause`,
    force: `build`,
    mount: [
      {
        field: `cause-mount`,
        brand: `build-field`,
        build: brand
      }
    ],
    catch: {
      build: [

      ]
    }
  }
  force.cause.push(cause)
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'raise':
        const raise = parseForce_build_raise(sheet, verse)
        cause.catch.build.push(raise)
        break
      case 'throw':
        const _throw = parseForce_build_throw(sheet, verse)
        cause.catch.build.push(_throw)
        break
      case 'store':
        const store = parseForce_build_store(sheet, verse)
        cause.catch.build.push(store)
        break
      case 'stack':
        const stack = parseForce_build_stack(sheet, verse)
        cause.catch.build.push(stack)
        break
    }
  })
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseForce_build_mount(sheet, verse)
        force.cause.push(mount)
        break
    }
  })
}

function parseForce_build_mount(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const cause = {
    field: `cause`,
    force: `store`,
    mount: [
      {
        field: `cause-mount`,
        brand: `start`,
        build: brand
      },
      {
        field: `cause-mount`,
        brand: `front`,
        build: verse.verse[1] && parseBuildValue(sheet, verse.verse[1])
      }
    ]
  }
  return cause
}

function parseForce_build_raise(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand: `build`,
    start: [
      {
        field: `state-field`,
        brand: `build`
      }
    ],
    cause: [
      {
        field: `cause`,
        force: `raise`,
        mount: [
          {
            field: `cause-mount`,
            brand: `brand`,
            build: brand
          },
          {
            field: `cause-mount`,
            brand: `build`,
            build: {
              field: `share`,
              trace: `build`
            }
          },
        ]
      }
    ],
    force: {}
  }
  return _catch
}

function parseForce_build_throw(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand: `build`,
    start: [
      {
        field: `state-field`,
        brand: `build`
      }
    ],
    cause: [
      {
        field: `cause`,
        force: `throw`,
        mount: [
          {
            field: `cause-mount`,
            brand: `brand`,
            build: brand
          },
          {
            field: `cause-mount`,
            brand: `build`,
            build: {
              field: `share`,
              trace: `build`
            }
          },
        ]
      }
    ],
    force: {}
  }
  return _catch
}

function parseForce_build_store(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand: `build`,
    start: [
      {
        field: `state-field`,
        brand: `build`
      }
    ],
    cause: [
      {
        field: `cause`,
        force: `store`,
        mount: [
          {
            field: `cause-mount`,
            brand: `trace`,
            build: brand
          },
          {
            field: `cause-mount`,
            brand: `build`,
            build: {
              field: `share`,
              trace: `build`
            }
          },
        ]
      }
    ],
    force: {}
  }
  return _catch
}

function parseForce_build_stack(sheet, verse) {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = {
    field: `cause-catch`,
    brand: `build`,
    start: [
      {
        field: `state-field`,
        brand: `build`
      }
    ],
    cause: [
      {
        field: `cause`,
        force: `stack`,
        mount: [
          {
            field: `cause-mount`,
            brand: `trace`,
            build: brand
          },
          {
            field: `cause-mount`,
            brand: `build`,
            build: {
              field: `share`,
              trace: `build`
            }
          },
        ]
      }
    ],
    force: {}
  }
  return _catch
}

function parseForce_cause(sheet, verse) {
  return parseCauseNode(sheet, verse)
}
