
const shared = require('../shared')
const path = require('path')

// these IDs are used by the javascript writer
let FORCE_ID = 1
function compileTypes(chain) {
  let startSheet
  chain.forEach(sheet => {
    sheet.id = FORCE_ID++
    if (sheet.trace.match(/node\/verse.xo/)) {
      startSheet = sheet
    }
  })
  let houses = {}
  chain.forEach(sheet => {
    houses[sheet.id] = sheet
    if (sheet.sheetCheck) {
      sheet.sheetCheck.forEach(check => {
        compileCheck(houses, sheet, check)
      })
    }
    if (sheet.sheetForce) {
      Object.keys(sheet.sheetForce).forEach(brand => {
        const force = sheet.sheetForce[brand]
        compileForce(houses, startSheet, sheet, force)
      })
    }
    if (sheet.trace.match(/binding/)) return
    if (sheet.sheetField) {
      Object.keys(sheet.sheetField).forEach(brand => {
        const field = sheet.sheetField[brand]
        compileField(startSheet, sheet, field)
      })
    }
    if (sheet.state) {
      Object.keys(sheet.state).forEach(brand => {
        const state = sheet.state[brand]
        compileState(startSheet, sheet, state)
      })
    }
  })
  return houses
}

module.exports = compileTypes

function compileCheck(houses, sheet, check) {
  check.id = FORCE_ID++
  const house = houses[check.id] = {
    count: 0,
    state: {}
  }
  check.cause.forEach(cause => {
    cause.force = sheet.houseForce[cause.force] || sheet.sheetForce[cause.force]

    cause.mount.forEach(mount => {
      if (mount.build) {
        if (mount.build.field === 'share') {
          let { trace } = mount.build
          house.state[trace] = house.state.hasOwnProperty(trace)
            ? house.state[trace]
            : house.count++
          mount.build.trace = house.state[trace]
        } else if (mount.build.field === 'count') {

        }
      }
    })
  })
}

function compileForceStart(startSheet, sheet, start) {
  start.forEach(mount => {
    mount.shard = sheet.houseField['shard-32-6']
    mount.field = sheet.houseField[`state-field`]
    if (mount.match) {
      switch (mount.match.field) {
        case `match-field`:
          compileForce_mount_matchField(sheet, mount.match)
          break
        case `match-chain`:
          compileForce_mount_matchChain(sheet, mount.match)
          break
      }
    }
  })
}

function compileCause(startSheet, sheet, cause) {
  cause.forEach(cause => {
    cause.shard = sheet.houseField['shard-32-6']
    cause.field = sheet.houseField.cause
    const f = sheet.houseForce[cause.force] || sheet.sheetForce[cause.force]
    if (!f) {
      throw `${sheet.sheet} - ${cause.force}`
    }
    cause.force = f

    for (let brand in cause.catch) {
      const _catch = cause.catch[brand]
      _catch.forEach(_catch => {
        _catch.id = FORCE_ID++
        _catch.shard = sheet.houseField['shard-32-6']
        _catch.field = sheet.houseField['cause-catch']
        compileForceStart(startSheet, sheet, _catch.start)
        compileCause(startSheet, sheet, _catch.cause)
        for (let forceBrand in _catch.force) {
          let catchForce = _catch.force[forceBrand]
          compileForce(startSheet, sheet, catchForce)
        }
      })
    }
  })
}

function compileForce(houses, startSheet, sheet, force) {
  force.id = FORCE_ID++
  if (sheet.trace.match(/binding/)) return
  // force.shard = sheet.houseField['shard-32-6']
  force.field = sheet.houseField.force

  compileForceStart(startSheet, sheet, force.start)

  compileCause(startSheet, sheet, force.cause)
}

function compileForce_mount_matchField(sheet, match) {
  const trace = match.trace
  match.trace = (sheet.houseField && sheet.houseField[trace]) || sheet.sheetField[trace]
  match.shard = sheet.houseField['shard-32-6']
  match.field = (sheet.houseField && sheet.houseField[match.field]) || sheet.sheetField[match.field]
  if (!match.trace) throw `${trace} - ${sheet.trace}`
}

function compileForce_mount_matchChain(sheet, match) {
  // console.log(match)
  // let match = mount.match.match[0]
  // switch (match.field) {
  //   case `match-field`:
  //     compileForce_mount_matchField(sheet, mount)
  //     break
  //   case `match-chain`:
  //     compileForce_mount_matchChain(sheet, mount)
  //     break
  // }
}

function compileField(startSheet, sheet, field) {
  field.shard = sheet.houseField['shard-32-6']
  field.field = sheet.houseField.field
  field.house = field.house.map(f => {
    const house = sheet.houseField[f.trace] || sheet.sheetField[f.trace]
    if (!house) throw `${sheet.trace} - ${f.trace}`
    return house
  })
  field.state.forEach(state => {
    state.shard = sheet.houseField['shard-32-6']
    state.field = sheet.houseField[`state-field`]
    if (!state.field) throw `state-field`
    if (state.match) {
      switch (state.match.field) {
        case `match-field`:
          compileField_mount_matchField(sheet, state.match)
          break
        case `match-chain`:
          compileField_mount_matchChain(sheet, state.match)
          break
      }
    }
  })
}

function compileField_mount_matchField(sheet, match) {
  const trace = match.matchField
  match.trace = (sheet.houseField && sheet.houseField[trace]) || sheet.sheetField[trace]
  match.shard = sheet.houseField['shard-32-6']
  match.field = (sheet.houseField && sheet.houseField[match.field]) || sheet.sheetField[match.field]
  if (!match.trace) throw `${trace} - ${sheet.trace}`
}

function compileField_mount_matchChain(sheet, match) {
  switch (match.field) {
    case `match-field`:
      compileForce_mount_matchField(sheet, match)
      break
    case `match-chain`:
      compileForce_mount_matchChain(sheet, match)
      break
  }
}

function compileState(startSheet, sheet, force) {

}
