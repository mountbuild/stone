
const { Stone } = require('../module')

// cause require
//   mount path, ../module/v
//   store tree_constructor

const stone = new Stone
stone.mount('@mount/drive/javascript/number', ({ force }) => {
  force.add = (a, b) => a + b
})
stone.mount('@mount/start/force/store', ({ force }) => {
  const Tree = require('../module/v')

  force.store = (t, k, v) => t.set(k, v)
  force.fetch = (t, k) => t.get(k)
  force.build = () => new Tree
})

const { force: { add } } = stone.fetch('@mount/drive/javascript/number')
console.log(add(1, 2))

const { force: { fetch, store: store_store, build: build_store } } = stone.fetch('@mount/start/force/store')

const store = build_store()
store_store(store, 'key', 'value')
console.log(fetch(store, 'key'))

