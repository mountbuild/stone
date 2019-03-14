
function compileForces(chain, mountMap) {
  const forceMap = {
    ...mountMap,
    stack: {},
    stick: {}
  }
  chain.forEach(sheet => {
    let started = false
    if (!sheet.sheetCheck) return
    sheet.sheetCheck.forEach(check => {
      check.cause.forEach(cause => {
        compileForce2(sheet, cause.force)
      })
    })
    Object.values(sheet.sheetForce || {}).forEach(force => {
      if (!started) {
        if (force.brand === 'fetch-block-count') {
          started = true
        }
        return
      }

      compileForce2(sheet, force)
    })
  })

  function compileForce2(sheet, force) {
    if (forceMap.start[force.id]) return
    if (forceMap.stack[force.id]) return
    if (forceMap.drive[force.id]) return
    if (forceMap.stick[force.id]) return

    if (sheet.sheet.match(/force\/stick/)) {
      forceMap.stack[force.id] = force
    } else {
      forceMap.stick[force.id] = force
    }

    force.cause.forEach(cause => {
      compileForce2(sheet, cause.force)

      Object.values(cause.catch || {}).forEach(chain => {
        chain.forEach(_catch => {
          forceMap.stick[_catch.id] = _catch
          _catch.cause.forEach(cause => {
            compileForce2(sheet, cause.force)
          })
        })
      })
    })
  }

  chain.forEach(sheet => {
    if (sheet.trace.match('binding')) return

    Object.values(sheet.sheetForce).forEach(force => {
      compileForce(forceMap, sheet, force)
    })
  })
  return forceMap
}

module.exports = compileForces

function compileForce(forceMap, sheet, force) {
  if (forceMap.start[force.id]) return
  if (forceMap.stack[force.id]) return
  forceMap.stick[force.id] = force
}
