
function Stone() {
  this.store = {}
}

Stone.prototype.sheet = function(trace){
  const stack = trace.split('/')
  let count = 0
  let store = this.store
  let sheet
  while (count < stack.length) {
    const block = stack[count]
    sheet = store[block] = store[block] || new Sheet(block)
    store = sheet.store
    count++
  }
  return sheet
}

Stone.prototype.mount = function(trace, mount){
  this.sheet(trace).mount(mount)
  return this
}

Stone.prototype.fetch = function(trace){
  return this.sheet(trace).build
}

Stone.prototype.clear = function(trace){

}

function Sheet(trace) {
  this.trace = trace
  this.store = {}
  this.force = {}
  this.field = {}
  this.state = {}
}

Sheet.prototype.mount = function(force){
  force(this)
  return this
}

module.exports = new Stone
module.exports.Stone = Stone
