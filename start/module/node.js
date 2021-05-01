
const child_process = require('child_process')
const https = require('https')
const http2 = require('http2')
const http = require('http')
const net = require('net')
const stone = require('.')

global.child_process_module = child_process
global.https_module = https
global.http2_module = http2
global.http_module = http
global.net_module = net

module.exports = global.stone = stone

stone.mount('@mount/drive-node/fs', ({ state }) => {
  state.fs = require('fs')
})

stone.mount('@mount/drive-node/http', ({ state }) => {
  state.http = require('http')
  state.https = require('https')
  state.http2 = require('http2')
})

stone.mount('@mount/drive-js/console', ({ state }) => {
  state.console = console
})

stone.mount('@mount/start/force/store', ({ force }) => {
  force.build = () => new Store
  force.store = (store, block) => store.store(block)
  force.fetch = (store, match) => store.fetch(match)
  force.clear = (store, match) => store.clear(match)
})

stone.mount('@mount/start/store/stack', ({ force }) => {
  force.build = () => new Stack
  force.mount = (store, stack) => store.mount_stack(stack)
  force.clear = (store, stack) => store.clear_stack(stack)
})

stone.mount('@mount/start/store/stack/cache', ({ force }) => {
  force.build = (mount) => new Cache(mount)
})

stone.mount('@mount/start/store/weave', ({ force }) => {
  force.build = () => new Weave()
})
