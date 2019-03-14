
const { allocate, free, bins } = require('../allocator')
const KeyValueTree = require('../allocator/keyValueTree')
const ArrayTree = require('../allocator/arrayTree')
const shared = require('../shared')
const path = require('path')

function convertToTree(start) {
  const tree = new KeyValueTree
  let newCloud = {
    field: start.cloud.field,
    shard: start.cloud.shard,
    house: tree,
  }
  let newStart = {
    field: start.field,
    shard: start.shard,
    cloud: newCloud
  }
  addCloud(newStart, start)
  for (let key in start.cloud.house) {
    let house = start.cloud.house[key]
    let newHouse = {}
    tree.set(key, newHouse)
    newHouse.field = house.field
    newHouse.shard = house.shard
    newHouse.brand = house.brand
    newHouse.stack = new KeyValueTree
    for (let key2 in house.stack) {
      let newStack = {}
      let stack = house.stack[key2]
      newHouse.stack.set(key2, newStack)
      newStack.field = stack.field
      newStack.shard = stack.shard
      newStack.brand = stack.brand
      newStack.store = new KeyValueTree
      addStores(newStack.store, stack.store, tree)
    }
  }
  return newStart
}

function addStores(tree, map, cloudTree) {
  for (let key in map) {
    let store = map[key]
    let newStore = {}
    tree.set(key, newStore)
    if (store.sheet) {
      addSheet(newStore, store.sheet, cloudTree)
    }
    if (store.store) {
      let newTree = new KeyValueTree
      addStores(newTree, store.store, cloudTree)
      newStore.store = newTree
    }
  }
}

function addSheet(store, sheet, cloudTree) {
  store.sheet = {}
  store.trace = sheet.sheet
  if (sheet.fetch) {
    addFetch(store.sheet, sheet)
  }
  if (sheet.force) {
    addForces(store.sheet, sheet)
  }
  if (sheet.field) {
    addFields(store.sheet, sheet)
  }
  if (sheet.state) {
    addStates(store.sheet, sheet)
  }
  if (sheet.theme) {
    addTheme(store.sheet, sheet)
  }
}

function addFetch(store, sheet) {
  store.fetch = new ArrayTree
  sheet.fetch.forEach(fetch => {
    let childStore = {
      trace: fetch.trace
    }
    store.fetch.push(childStore)
    addFetch(childStore, fetch)
  })
}

function addTheme(store, sheet) {
  // console.log(sheet.theme)
}

function addCloud(store, sheet) {
  const track = sheet.track
  store.track = new ArrayTree()
  // track.forEach(track => {
  //   let trackBlock = new ArrayTree()
  //   store.track.push(trackBlock)
  //   track.forEach(track => {
  //     trackBlock.push(track)
  //   })
  // })
}

function addForces(store, sheet) {
  let forceTree = new KeyValueTree
  store.force = forceTree
  for (let key in sheet.force) {
    let force = sheet.force[key]
    let newForce = {}
    forceTree.set(key, newForce)
    newForce.field = force.field
    newForce.brand = force.brand
    newForce.start = force.start
    let newCause = new ArrayTree
    force.cause.forEach(cause => {
      addCause(newCause, cause)
    })
    newForce.cause = newCause
    if (Object.keys(force.force).length) {
      addForces(newForce, force)
    }
  }
}

function addCause(chain, cause) {
  let newCause = {
    field: cause.field,
    brand: cause.brand,
    mount: new ArrayTree,
    catch: new KeyValueTree
  }
  chain.push(newCause)

  cause.mount.forEach(mount => {
    newCause.mount.push(mount)
  })

  Object.keys(cause.catch || {}).forEach(brand => {
    let _catch = cause.catch[brand]
    let newCatch = {
      field: _catch.field,
      brand: _catch.brand,
      start: _catch.start,
      cause: [],
      force: {},
      latch: _catch.latch
    }
    newCause.catch.set(brand, newCatch)
    let newCauses = []
    ;(_catch.cause || []).forEach(cause => {
      addCause(newCauses, cause)
    })
    if (Object.keys(_catch.force || {}).length) {
      addForces(newCatch.force, _catch.force)
    }
  })
}

function addFields(store, sheet) {
  let fieldTree = new KeyValueTree
  store.field = fieldTree
  for (let key in sheet.field) {
    let field = sheet.field[key]
    let newField = {}
    fieldTree.set(key, newField)
    newField.brand = field.brand
    newField.state = field.state
    newField.house = field.house
    newField.check = field.check
  }
}

function addStates(store, sheet) {
  let stateTree = new KeyValueTree
  store.state = stateTree
  for (let key in sheet.state) {
    let state = sheet.state[key]
    let newState = {}
    stateTree.set(key, newState)
    newState.brand = state.brand
    newState.build = state.build
  }
}

module.exports = convertToTree
