
let ID = 1

function giveIds(start) {
  start.id = ID++
  start.track.id = ID++
  for (let track of start.track) {
    track.id = ID++
    for (let track2 of track) {
      track2.id = ID++
    }
  }
  let cloud = start.cloud
  cloud.id = ID++
  cloud.house.id = ID++
  for (let houseNode of cloud.house) {
    houseNode.id = ID++
    let house = houseNode.value
    house.id = ID++
    house.stack.id = ID++
    for (let stackNode of house.stack) {
      stackNode.id = ID++
      let stack = stackNode.value
      stack.id = ID++
      traverseStore(stack.store)
    }
  }
}

function traverseStore(store) {
  store.id = ID++
  for (let storeNode of store) {
    storeNode.id = ID++
    let childStore = storeNode.value
    childStore.id = ID++
    if (childStore.sheet) {
      traverseSheet(childStore.trace, childStore.sheet)
    }
    if (childStore.store) {
      traverseStore(childStore.store)
    }
  }
}

function traverseSheet(trace, sheet) {
  sheet.id = ID++

  if (sheet.force) {
    traverseForces(trace, sheet.force)
  }
  if (sheet.field) {
    traverseFields(trace, sheet.field)
  }
  if (sheet.fetch) {
    traverseFetches(trace, sheet.fetch)
  }
  if (sheet.state) {
    traverseStates(trace, sheet.state)
  }
  if (sheet.cloud) {
    traverseCloud(trace, sheet)
  }
  // if (sheet.theme) {
  //   addTheme(store.sheet, sheet)
  // }
}

function traverseFetches(trace, fetches) {
  fetches.id = ID++
  for (let fetchNode of fetches) {
    fetchNode.id = ID++
    if (fetchNode.fetch && fetchNode.fetch.base.count) {
      traverseFetches(trace, fetchNode.fetch)
    }
    if (fetchNode.catch) {
      fetchNode.catch.id = ID++
      if (fetchNode.catch.store) {
        fetchNode.catch.store.id = ID++
      }
    }
  }
}

function traverseCloud(trace, sheet) {

}

function traverseFields(trace, fields) {
  fields.id = ID++
  for (let fieldNode of fields) {
    fieldNode.id = ID++
    let field = fieldNode.value
    traverseField(trace, field)
  }
}

function traverseForces(trace, forces) {
  forces.id = ID++
  for (let forceNode of forces) {
    forceNode.id = ID++
    let force = forceNode.value
    traverseForce(trace, force)
  }
}

function traverseForce(trace, force) {
  force.id = ID++
  compileMount(trace, force.start)
  force.cause.id = ID++
  for (let cause of force.cause) {
    cause.id = ID++
    cause.mount.id = ID++
    for (let mount of cause.mount) {
      mount.id = ID++
      if (mount.build != null) {
        mount.build.id = ID++
      }
    }
  }
}

module.exports = giveIds

function compileMount(sheet, mount) {
  mount.id = ID++
  mount.forEach(mount => {
    mount.id = ID++
    if (mount.match) {
      mount.match.id = ID++
      switch (mount.match.field.brand) {
        case `match-field`:
          break
        case `match-chain`:
          mount.match.match.forEach(match => {
            match.id = ID++
          })
          break
      }
    }
  })
}

function traverseField(trace, field) {
  field.id = ID++
  compileMount(trace, field.state)
}

function compileState(sheet, state) {
  state.id = ID++
}
