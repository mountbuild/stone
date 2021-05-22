
const global = typeof window == 'undefined' ? global : window



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
    sheet = store[block] = store[block] || new Store(block)
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
  return this.sheet(trace)
}

Stone.prototype.clear = function(trace){

}

function Store(trace) {
  this.trace = trace
  this.store = {}
  this.force = {}
  this.field = {}
  this.state = {}
}

Store.prototype.mount = function(force){
  force(this)
  return this
}

const stone = new Stone

class KeyValue {
  constructor(key, value) {
      this.key = key;
      this.value = value;
  }
}

class KeyValueNode {
  constructor(capacity) {
      // Mimic fixed-size array (avoid accidentally growing it)
      this.children = Object.seal(Array(capacity).fill(null));
      this.childCount = 0; // Number of used slots in children array
      // The algorithm relies on that fact that both KeyValue & KeyValueNode have a key property:
      this.key = null; // Here it is a property for supporting a search
      // Maintain back-link to parent.
      this.parent = null;
      // Per level in the tree, maintain a doubly linked list
      this.prev = this.next = null;
  }
  setCapacity(capacity) {
      if (capacity < 1) return;
      // Here we make a new array, and copy the data into it
      let children = Object.seal(Array(capacity).fill(null));
      for (let i = 0; i < this.childCount; i++) children[i] = this.children[i];
      this.children = children;
  }
  isLeaf() {
      return !(this.children[0] instanceof KeyValueNode);
  }
  index() {
      return this.parent.children.indexOf(this);
  }
  updateKey() {
      for (let node = this; node; node = node.parent) {
          node.key = node.children[0].key;
      }
  }
  wipe(start, end) {
      this.children.copyWithin(start, end, this.childCount);
      for (let i = this.childCount - end + start; i < this.childCount; i++) {
          this.children[i] = null;
      }
      this.childCount -= end - start;
      // Reduce allocated size if possible
      if (this.childCount * 2 <= this.children.length) this.setCapacity(this.children.length / 2);
      // Update key if first item changed
      if (start === 0 && this.childCount > 0) this.updateKey();
  }
  moveFrom(neighbor, target, start, count=1) {
      // Note: `start` can have two meanings:
      //   if neighbor is null, it is the value/KeyValueNode to move to the target
      //   if neighbor is a KeyValueNode, it is the index from where value(s) have to be moved to the target
      // Make room in target node
      if (this.childCount + count > this.children.length) this.setCapacity(this.children.length * 2);
      this.children.copyWithin(target + count, target, Math.max(target + count, this.childCount));
      this.childCount += count;
      if (neighbor !== null) {
          // Copy the children
          for (let i = 0; i < count; i++) {
              this.children[target + i] = neighbor.children[start + i];
          }
          // Remove the original references
          neighbor.wipe(start, start + count);
      } else {
          this.children[target] = start; // start is value to insert
      }
      // Set parent link(s)
      if (!this.isLeaf()) {
          for (let i = 0; i < count; i++) {
              this.children[target + i].parent = this;
          }
      }
      // Update key if first item changed
      if (target === 0) this.updateKey();
  }
  moveToNext(count) {
      this.next.moveFrom(this, 0, this.childCount - count, count);
  }
  moveFromNext(count) {
      this.moveFrom(this.next, this.childCount, 0, count);
  }
  basicRemove(index) {
      if (!this.isLeaf()) {
          // Take node out of the level's linked list
          let prev = this.children[index].prev;
          let next = this.children[index].next;
          if (prev) prev.next = next;
          if (next) next.prev = prev;
      }
      this.wipe(index, index + 1);
  }
  basicInsert(index, value) {
      this.moveFrom(null, index, value);
      if (value instanceof KeyValueNode) {
          // Insert node in the level's linked list
          if (index > 0) {
              value.prev = this.children[index-1];
              value.next = value.prev.next;
          } else if (this.childCount > 1) {
              value.next = this.children[1];
              value.prev = value.next.prev;
          }
          if (value.prev) value.prev.next = value;
          if (value.next) value.next.prev = value;
      }
  }
  pairWithSmallest() {
      return this.prev && (!this.next || this.next.childCount > this.prev.childCount)
          ? [this.prev, this] : [this, this.next];
  }
  toString() {
      return "[" + this.children.map(v => v??"-").join() + "]";
  }
}

class KeyValueTree {
  constructor(nodeCapacity=16) {
      this.nodeCapacity = nodeCapacity;
      this.root = new KeyValueNode(1);
      this.first = this.root; // Head of doubly linked list at bottom level
  }
  locate(key) {
      let node = this.root;
      let low;
      while (true) {
          // Binary search among keys
          low = 1;
          let high = node.childCount;
          while (low < high) {
              let index = (low + high) >> 1;
              if (key >= node.children[index].key) {
                  low = index + 1;
              } else {
                  high = index;
              }
          }
          low--;
          if (node.isLeaf()) break;
          node = node.children[low];
      }
      if (low < node.childCount && key > node.children[low].key) return [node, low+1];
      return [node, low];
  }
  get(key) {
      let [node, index] = this.locate(key);
      if (index < node.childCount) {
          let keyValue = node.children[index];
          if (keyValue.key === key) return keyValue.value;
      }
  }
  set(key, value) {
      let [node, index] = this.locate(key);
      if (index < node.childCount && node.children[index].key === key) {
          // already present: update the value
          node.children[index].value = value;
          return;
      }
      let item = new KeyValue(key, value); // item can be a KeyValue or a KeyValueNode
      while (node.childCount === this.nodeCapacity) { // No room here
          if (index === 0 && node.prev && node.prev.childCount < this.nodeCapacity) {
              return node.prev.basicInsert(node.prev.childCount, item);
          }
          // Check whether we can redistribute (to avoid a split)
          if (node !== this.root) {
              let [left, right] = node.pairWithSmallest();
              let joinedIndex = left === node ? index : left.childCount + index;
              let sumCount = left.childCount + right.childCount + 1;
              if (sumCount <= 2 * this.nodeCapacity) { // redistribute
                  let childCount = sumCount >> 1;
                  if (node === right) { // redistribute to the left
                      let insertInLeft = joinedIndex < childCount;
                      left.moveFromNext(childCount - left.childCount - +insertInLeft);
                  } else { // redistribute to the right
                      let insertInRight = index >= sumCount - childCount;
                      left.moveToNext(childCount - right.childCount - +insertInRight);
                  }
                  if (joinedIndex > left.childCount ||
                          joinedIndex === left.childCount && left.childCount > right.childCount) {
                      right.basicInsert(joinedIndex - left.childCount, item);
                  } else {
                      left.basicInsert(joinedIndex, item);
                  }
                  return;
              }
          }
          // Cannot redistribute: split node
          let childCount = node.childCount >> 1;
          // Create a new node that will later become the right sibling of this node
          let sibling = new KeyValueNode(childCount);
          // Move half of node node's data to it
          sibling.moveFrom(node, 0, childCount, childCount);
          // Insert the item in either the current node or the new one
          if (index > node.childCount) {
              sibling.basicInsert(index - node.childCount, item);
          } else {
              node.basicInsert(index, item);
          }
          // Is this the root?
          if (!node.parent) {
              // ...then first create a parent, which is the new root
              this.root = new KeyValueNode(2);
              this.root.basicInsert(0, node);
          }
          // Prepare for inserting the sibling node into the tree
          index = node.index() + 1;
          node = node.parent;
          item = sibling;  // item is now a KeyValueNode
      }
      node.basicInsert(index, item);
  }
  remove(key) {
      let [node, index] = this.locate(key);
      if (index >= node.childCount || node.children[index].key !== key) return; // not found
      while (true) {
          node.basicRemove(index);

          // Exit when node's fill ratio is fine
          if (!node.parent || node.childCount * 2 > this.nodeCapacity) return;
          // KeyValueNode has potentially too few children, we should either merge or redistribute

          let [left, right] = node.pairWithSmallest();

          if (!left || !right) { // A node with no siblings? Must become the root!
              this.root = node;
              node.parent = null;
              return;
          }
          let sumCount = left.childCount + right.childCount;
          let childCount = sumCount >> 1;

          // Check whether to merge or to redistribute
          if (sumCount > this.nodeCapacity) { // redistribute
              // Move some data from the bigger to the smaller node
              let shift = childCount - node.childCount;
              if (!shift) { // Boundary case: when a redistribution would bring no improvement
                  console.assert(node.childCount * 2 === this.nodeCapacity && sumCount === this.nodeCapacity + 1);
                  return;
              }
              if (node === left) { // move some children from right to left
                  left.moveFromNext(shift);
              } else { // move some children from left to right
                  left.moveToNext(shift);
              }
              return;
          }

          // Merge:
          // Move all data from the right to the left
          left.moveFromNext(right.childCount);
          // Prepare to delete right node
          node = right.parent;
          index = right.index();
      }
  }
}

global.stone = stone

stone.mount('@mount/drive-node/fs', ({ state }) => {
  // state.fs = require('fs')
})

stone.mount('@mount/drive-node/http', ({ state }) => {
  // state.http = require('http')
  // state.https = require('https')
  // state.http2 = require('http2')
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

stone.mount('@mount/drive-js', function(build){
  const force = build.force
})
stone.mount('@mount/drive-js/mount', function(build){
  const force = build.force
})
stone.mount('@mount/drive-js/base', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/base#drive
   */
  
  force.drive = function(s, h){
    while (s()) {
      h()
    }
  }
  
  /**
   * @mount/drive-js/base#check
   */
  
  force.check = function(s, h){
    if (s()) {
      return h()
    }
  }
  
  /**
   * @mount/drive-js/base#check-else
   */
  
  force.check_else = function(s, h, o){
    if (s()) {
      return h()
    } else {
      return o()
    }
  }
  
  /**
   * @mount/drive-js/base#debug-function
   */
  
  force.debug_function = function(s){
    window.debug(s)
  }
  
  /**
   * @mount/drive-js/base#debug
   */
  
  force.debug = function(){
    debugger
  }
  
  /**
   * @mount/drive-js/base#queue
   */
  
  force.queue = function(s){
    window.setImmediate(s)
  }
  
  /**
   * @mount/drive-js/base#compute-bitwise-or
   */
  
  force.compute_bitwise_or = function(s, h){
    return s | h
  }
  
  /**
   * @mount/drive-js/base#check-if-equal
   */
  
  force.check_if_equal = function(s, h){
    return s == h
  }
  
  /**
   * @mount/drive-js/base#check-if-strictly-equal
   */
  
  force.check_if_strictly_equal = function(s, h){
    return s === h
  }
  
  /**
   * @mount/drive-js/base#get-typeof
   */
  
  force.get_typeof = function(s){
    return typeof s
  }
  
  /**
   * @mount/drive-js/base#get-instanceof
   */
  
  force.get_instanceof = function(s, h){
    return s instanceof h
  }
  
  /**
   * @mount/drive-js/base#set-field
   */
  
  force.set_field = function(s, h, o){
    s[h] = o
  }
  
  /**
   * @mount/drive-js/base#get-field
   */
  
  force.get_field = function(s, h){
    return s[h]
  }
  
  /**
   * @mount/drive-js/base#remove-field
   */
  
  force.remove_field = function(s, h){
    delete s[h]
  }
  
  /**
   * @mount/drive-js/base#shift-left
   */
  
  force.shift_left = function(s, h){
    return s << h
  }
  
  /**
   * @mount/drive-js/base#shift-right
   */
  
  force.shift_right = function(s, h){
    return s >> h
  }
  
  /**
   * @mount/drive-js/base#shift-right-unsigned
   */
  
  force.shift_right_unsigned = function(s, h){
    return s >>> h
  }
  
  /**
   * @mount/drive-js/base#compute-bitwise-and
   */
  
  force.compute_bitwise_and = function(s, h){
    return s & h
  }
  
  /**
   * @mount/drive-js/base#check-or
   */
  
  force.check_or = function(s, h){
    return s || h
  }
  
  /**
   * @mount/drive-js/base#try-catch
   */
  
  force.try_catch = function(s, h){
    try {
      return s()
    } catch (e) {
      return h(e)
    }
  }
  
  /**
   * @mount/drive-js/base#check-if-truthy
   */
  
  force.check_if_truthy = function(s){
    return !!s
  }
  
  /**
   * @mount/drive-js/base#check-opposite
   */
  
  force.check_opposite = function(s){
    return !s
  }
  
  /**
   * @mount/drive-js/base#check-not-equal
   */
  
  force.check_not_equal = function(s, h){
    return s !== h
  }
  
  /**
   * @mount/drive-js/base#flip-block
   */
  
  force.flip_block = function(s){
    return ~s
  }
  
  /**
   * @mount/drive-js/base#check-gt
   */
  
  force.check_gt = function(s, h){
    return s > h
  }
  
  /**
   * @mount/drive-js/base#check-lt
   */
  
  force.check_lt = function(s, h){
    return s < h
  }
  
  /**
   * @mount/drive-js/base#check-gte
   */
  
  force.check_gte = function(s, h){
    return s >= h
  }
  
  /**
   * @mount/drive-js/base#check-lte
   */
  
  force.check_lte = function(s, h){
    return s <= h
  }
  
  /**
   * @mount/drive-js/base#check-and
   */
  
  force.check_and = function(s, h){
    return s && h
  }
})
stone.mount('@mount/drive-js/string', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/string#replace
   */
  
  force.replace = function(s, h, o){
    return s.replace(h, o)
  }
  
  /**
   * @mount/drive-js/string#trim
   */
  
  force.trim = function(s){
    return s.trim()
  }
  
  /**
   * @mount/drive-js/string#get-char-code-at
   */
  
  force.get_char_code_at = function(s, h){
    return s.charCodeAt(h)
  }
  
  /**
   * @mount/drive-js/string#get-char-at
   */
  
  force.get_char_at = function(s, h){
    return s.charAt(h)
  }
  
  /**
   * @mount/drive-js/string#get-char-from-code
   */
  
  force.get_char_from_code = function(s){
    return String.fromCharCode(s)
  }
  
  /**
   * @mount/drive-js/string#get-char-from-code-point
   */
  
  force.get_char_from_code_point = function(s){
    return String.fromCodePoint(s)
  }
  
  /**
   * @mount/drive-js/string#convert-to-lowercase
   */
  
  force.convert_to_lowercase = function(s){
    return s.toLowerCase()
  }
  
  /**
   * @mount/drive-js/string#convert-to-uppercase
   */
  
  force.convert_to_uppercase = function(s){
    return s.toUpperCase()
  }
  
  /**
   * @mount/drive-js/string#create
   */
  
  force.create = function(){
    return null
  }
  
  /**
   * @mount/drive-js/string#match
   */
  
  force.match = function(s, h){
    return s.match(h)
  }
  
  /**
   * @mount/drive-js/string#create-collator
   */
  
  force.create_collator = function(){
    return new Intl.Collator()
  }
  
  /**
   * @mount/drive-js/string#get-collator-comparator
   */
  
  force.get_collator_comparator = function(s){
    return s.compare
  }
  
  /**
   * @mount/drive-js/string#split
   */
  
  force.split = function(s, h){
    return s.split(h)
  }
  
  /**
   * @mount/drive-js/string#check-starts-with
   */
  
  force.check_starts_with = function(s, h){
    return s.startsWith(h)
  }
  
  /**
   * @mount/drive-js/string#check-ends-with
   */
  
  force.check_ends_with = function(s, h){
    return s.endsWith(h)
  }
  
  /**
   * @mount/drive-js/string#pad-start
   */
  
  force.pad_start = function(s, h, o){
    return s.padStart(h, o)
  }
})
stone.mount('@mount/drive-js/number', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/number#parse-decimal
   */
  
  force.parse_decimal = function(s){
    return window.parseFloat(s)
  }
  
  /**
   * @mount/drive-js/number#parse-int
   */
  
  force.parse_int = function(s){
    return window.parseInt(s)
  }
  
  /**
   * @mount/drive-js/number#parse-number
   */
  
  force.parse_number = function(s){
    return window.Number(s)
  }
  
  /**
   * @mount/drive-js/number#get-max
   */
  
  force.get_max = function(s, h){
    return Math.max(s, h)
  }
  
  /**
   * @mount/drive-js/number#get-min
   */
  
  force.get_min = function(s, h){
    return Math.max(s, h)
  }
  
  /**
   * @mount/drive-js/number#floor
   */
  
  force.floor = function(s){
    return Math.floor(s)
  }
  
  /**
   * @mount/drive-js/number#ceil
   */
  
  force.ceil = function(s){
    return Math.ceil(s)
  }
  
  /**
   * @mount/drive-js/number#round
   */
  
  force.round = function(s){
    return Math.round(s)
  }
  
  /**
   * @mount/drive-js/number#get-abs
   */
  
  force.get_abs = function(s){
    return Math.abs(s)
  }
  
  /**
   * @mount/drive-js/number#get-cos
   */
  
  force.get_cos = function(s){
    return Math.cos(s)
  }
  
  /**
   * @mount/drive-js/number#get-acos
   */
  
  force.get_acos = function(s){
    return Math.acos(s)
  }
  
  /**
   * @mount/drive-js/number#get-sin
   */
  
  force.get_sin = function(s){
    return Math.sin(s)
  }
  
  /**
   * @mount/drive-js/number#get-asin
   */
  
  force.get_asin = function(s){
    return Math.asin(s)
  }
  
  /**
   * @mount/drive-js/number#get-tan
   */
  
  force.get_tan = function(s){
    return Math.tan(s)
  }
  
  /**
   * @mount/drive-js/number#get-atan
   */
  
  force.get_atan = function(s){
    return Math.atan(s)
  }
  
  /**
   * @mount/drive-js/number#get-atan2
   */
  
  force.get_atan2 = function(s){
    return Math.atan2(s)
  }
  
  /**
   * @mount/drive-js/number#get-log
   */
  
  force.get_log = function(s){
    return Math.log(s)
  }
  
  /**
   * @mount/drive-js/number#get-sqrt
   */
  
  force.get_sqrt = function(s){
    return Math.sqrt(s)
  }
  
  /**
   * @mount/drive-js/number#add
   */
  
  force.add = function(s, h){
    return s + h
  }
  
  /**
   * @mount/drive-js/number#subtract
   */
  
  force.subtract = function(s, h){
    return s - h
  }
  
  /**
   * @mount/drive-js/number#multiply
   */
  
  force.multiply = function(s, h){
    return s * h
  }
  
  /**
   * @mount/drive-js/number#divide
   */
  
  force.divide = function(s, h){
    return s / h
  }
  
  /**
   * @mount/drive-js/number#modulus
   */
  
  force.modulus = function(s, h){
    return s % h
  }
  
  /**
   * @mount/drive-js/number#get-exponent
   */
  
  force.get_exponent = function(s, h){
    return s ** h
  }
  
  /**
   * @mount/drive-js/number#increment
   */
  
  force.increment = function(s){
    return ++s
  }
  
  /**
   * @mount/drive-js/number#decrement
   */
  
  force.decrement = function(s){
    return --s
  }
  
  /**
   * @mount/drive-js/number#check-if-not-number
   */
  
  force.check_if_not_number = function(s){
    return window.isNaN(s)
  }
  
  /**
   * @mount/drive-js/number#get-random
   */
  
  force.get_random = function(){
    return Math.random()
  }
  
  /**
   * @mount/drive-js/number#loop
   */
  
  force.loop = function(s, h, o){
    for (s; s < h; s++) {
      x[0][o](s)
    }
  }
})
stone.mount('@mount/drive-js/function', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/function#create
   */
  
  force.create = function(s){
    return new Function(s)
  }
})
stone.mount('@mount/drive-js/array', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/array#get-index-of
   */
  
  force.get_index_of = function(s, h){
    return s.indexOf(h)
  }
  
  /**
   * @mount/drive-js/array#create
   */
  
  force.create = function(){
    return null
  }
  
  /**
   * @mount/drive-js/array#create-uint8
   */
  
  force.create_uint8 = function(s){
    return new Uint8Array(s)
  }
  
  /**
   * @mount/drive-js/array#create-uint16
   */
  
  force.create_uint16 = function(s){
    return new Uint16Array(s)
  }
  
  /**
   * @mount/drive-js/array#create-uint32
   */
  
  force.create_uint32 = function(s){
    return new Uint32Array(s)
  }
  
  /**
   * @mount/drive-js/array#create-float32
   */
  
  force.create_float32 = function(s){
    return new Float32Array(s)
  }
  
  /**
   * @mount/drive-js/array#push
   */
  
  force.push = function(s, h){
    s.push(h)
  }
  
  /**
   * @mount/drive-js/array#pop
   */
  
  force.pop = function(s){
    return s.pop()
  }
  
  /**
   * @mount/drive-js/array#shift
   */
  
  force.shift = function(s){
    return s.shift()
  }
  
  /**
   * @mount/drive-js/array#unshift
   */
  
  force.unshift = function(s, h){
    s.unshift(h)
  }
  
  /**
   * @mount/drive-js/array#store
   */
  
  force.store = function(s, h, o){
    s[null] = o
  }
  
  /**
   * @mount/drive-js/array#fetch
   */
  
  force.fetch = function(s, h){
    return s[null]
  }
  
  /**
   * @mount/drive-js/array#get-length
   */
  
  force.get_length = function(s){
    return s.null
  }
})
stone.mount('@mount/drive-js/dataview', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/dataview#build-data-view
   */
  
  force.build_data_view = function(s, h, o){
    return new DataView(s, h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-int8
   */
  
  force.get_int8 = function(s, h, o){
    return s.getInt8(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-uint8
   */
  
  force.get_uint8 = function(s, h, o){
    return s.getUint8(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-int16
   */
  
  force.get_int16 = function(s, h, o){
    return s.getInt16(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-uint16
   */
  
  force.get_uint16 = function(s, h, o){
    return s.getUint16(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-int32
   */
  
  force.get_int32 = function(s, h, o){
    return s.getInt32(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-uint32
   */
  
  force.get_uint32 = function(s, h, o){
    return s.getUint32(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-float32
   */
  
  force.get_float32 = function(s, h, o){
    return s.getFloat32(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-float64
   */
  
  force.get_float64 = function(s, h, o){
    return s.getFloat64(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-big-int64
   */
  
  force.get_big_int64 = function(s, h, o){
    return s.getBigInt64(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#get-big-uint64
   */
  
  force.get_big_uint64 = function(s, h, o){
    return s.getBigUint64(h, o)
  }
  
  /**
   * @mount/drive-js/dataview#set-int8
   */
  
  force.set_int8 = function(s, h, o, w){
    s.setInt8(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-uint8
   */
  
  force.set_uint8 = function(s, h, o, w){
    s.setUint8(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-int16
   */
  
  force.set_int16 = function(s, h, o, w){
    s.setInt16(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-uint16
   */
  
  force.set_uint16 = function(s, h, o, w){
    s.setUint16(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-int32
   */
  
  force.set_int32 = function(s, h, o, w){
    s.setInt32(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-uint32
   */
  
  force.set_uint32 = function(s, h, o, w){
    s.setUint32(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-float32
   */
  
  force.set_float32 = function(s, h, o, w){
    s.setFloat32(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-float64
   */
  
  force.set_float64 = function(s, h, o, w){
    s.setFloat64(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-big-int64
   */
  
  force.set_big_int64 = function(s, h, o, w){
    s.setBigInt64(h, o, w)
  }
  
  /**
   * @mount/drive-js/dataview#set-big-uint64
   */
  
  force.set_big_uint64 = function(s, h, o, w){
    s.setBigUint64(h, o, w)
  }
})
stone.mount('@mount/drive-js/console', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/console#assert
   */
  
  force.assert = function(s, h, o, w){
    console.assert(s, h, o, w)
  }
  
  /**
   * @mount/drive-js/console#clear
   */
  
  force.clear = function(){
    console.clear()
  }
  
  /**
   * @mount/drive-js/console#count
   */
  
  force.count = function(s){
    console.count(s)
  }
  
  /**
   * @mount/drive-js/console#count-reset
   */
  
  force.count_reset = function(s){
    console.countReset(s)
  }
  
  /**
   * @mount/drive-js/console#debug
   */
  
  force.debug = function(s, h, o){
    console.debug(s, h, o)
  }
  
  /**
   * @mount/drive-js/console#dir
   */
  
  force.dir = function(s){
    console.dir(s)
  }
  
  /**
   * @mount/drive-js/console#dirxml
   */
  
  force.dirxml = function(s){
    console.dirxml(s)
  }
  
  /**
   * @mount/drive-js/console#error
   */
  
  force.error = function(s, h, o){
    console.error(s, h, o)
  }
  
  /**
   * @mount/drive-js/console#group
   */
  
  force.group = function(s){
    console.group(s)
  }
  
  /**
   * @mount/drive-js/console#group-collapsed
   */
  
  force.group_collapsed = function(s){
    console.groupCollapsed(s)
  }
  
  /**
   * @mount/drive-js/console#group-end
   */
  
  force.group_end = function(){
    console.groupEnd()
  }
  
  /**
   * @mount/drive-js/console#info
   */
  
  force.info = function(s, h, o){
    console.info(s, h, o)
  }
  
  /**
   * @mount/drive-js/console#log
   */
  
  force.log = function(s){
    console.log(s)
  }
  
  /**
   * @mount/drive-js/console#table
   */
  
  force.table = function(s, h){
    console.table(s, h)
  }
  
  /**
   * @mount/drive-js/console#time
   */
  
  force.time = function(s){
    console.time(s)
  }
  
  /**
   * @mount/drive-js/console#time-end
   */
  
  force.time_end = function(s){
    console.timeEnd(s)
  }
  
  /**
   * @mount/drive-js/console#time-log
   */
  
  force.time_log = function(s){
    console.timeLog(s)
  }
  
  /**
   * @mount/drive-js/console#trace
   */
  
  force.trace = function(s){
    console.trace(s)
  }
  
  /**
   * @mount/drive-js/console#warn
   */
  
  force.warn = function(s, h, o){
    console.warn(s, h, o)
  }
})
stone.mount('@mount/drive-js/datetime', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/datetime#create
   */
  
  force.create = function(s){
    return new Date(s)
  }
  
  /**
   * @mount/drive-js/datetime#parse
   */
  
  force.parse = function(s){
    return Date.parse(s)
  }
  
  /**
   * @mount/drive-js/datetime#get-millisecond-timestamp
   */
  
  force.get_millisecond_timestamp = function(){
    return Date.now()
  }
  
  /**
   * @mount/drive-js/datetime#get-microsecond-timestamp
   */
  
  force.get_microsecond_timestamp = function(){
    return performance.now()
  }
  
  /**
   * @mount/drive-js/datetime#get-date
   */
  
  force.get_date = function(s){
    return s.getDate()
  }
  
  /**
   * @mount/drive-js/datetime#get-day
   */
  
  force.get_day = function(s){
    return s.getDay()
  }
  
  /**
   * @mount/drive-js/datetime#get-full-year
   */
  
  force.get_full_year = function(s){
    return s.getFullYear()
  }
  
  /**
   * @mount/drive-js/datetime#get-hours
   */
  
  force.get_hours = function(s){
    return s.getHours()
  }
  
  /**
   * @mount/drive-js/datetime#get-milliseconds
   */
  
  force.get_milliseconds = function(s){
    return s.getMilliseconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-minutes
   */
  
  force.get_minutes = function(s){
    return s.getMinutes()
  }
  
  /**
   * @mount/drive-js/datetime#get-month
   */
  
  force.get_month = function(s){
    return s.getMonth()
  }
  
  /**
   * @mount/drive-js/datetime#get-seconds
   */
  
  force.get_seconds = function(s){
    return s.getSeconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-time
   */
  
  force.get_time = function(s){
    return s.getTime()
  }
  
  /**
   * @mount/drive-js/datetime#get-timezone-offset
   */
  
  force.get_timezone_offset = function(s){
    return s.getTimezoneOffset()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-date
   */
  
  force.get_utc_date = function(s){
    return s.getUTCDate()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-day
   */
  
  force.get_utc_day = function(s){
    return s.getUTCDay()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-full-year
   */
  
  force.get_utc_full_year = function(s){
    return s.getUTCFullYear()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-hours
   */
  
  force.get_utc_hours = function(s){
    return s.getUTCHours()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-milliseconds
   */
  
  force.get_utc_milliseconds = function(s){
    return s.getUTCMilliseconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-minutes
   */
  
  force.get_utc_minutes = function(s){
    return s.getUTCMinutes()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-month
   */
  
  force.get_utc_month = function(s){
    return s.getUTCMonth()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-seconds
   */
  
  force.get_utc_seconds = function(s){
    return s.getUTCSeconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-year
   */
  
  force.get_year = function(s){
    return s.getYear()
  }
  
  /**
   * @mount/drive-js/datetime#set-date
   */
  
  force.set_date = function(s, h){
    s.setDate(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-full-year
   */
  
  force.set_full_year = function(s, h){
    s.setFullYear(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-hours
   */
  
  force.set_hours = function(s, h){
    s.setHours(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-milliseconds
   */
  
  force.set_milliseconds = function(s, h){
    s.setMilliseconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-minutes
   */
  
  force.set_minutes = function(s, h){
    s.setMinutes(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-month
   */
  
  force.set_month = function(s, h){
    s.setMonth(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-seconds
   */
  
  force.set_seconds = function(s, h){
    s.setSeconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-time
   */
  
  force.set_time = function(s, h){
    s.setTime(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-date
   */
  
  force.set_utc_date = function(s, h){
    s.setUTCDate(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-full-year
   */
  
  force.set_utc_full_year = function(s, h){
    s.setUTCFullYear(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-hours
   */
  
  force.set_utc_hours = function(s, h){
    s.setUTCHours(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-milliseconds
   */
  
  force.set_utc_milliseconds = function(s, h){
    s.setUTCMilliseconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-minutes
   */
  
  force.set_utc_minutes = function(s, h){
    s.setUTCMinutes(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-month
   */
  
  force.set_utc_month = function(s, h){
    s.setUTCMonth(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-seconds
   */
  
  force.set_utc_seconds = function(s, h){
    s.setUTCSeconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-year
   */
  
  force.set_year = function(s, h){
    s.setYear(h)
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-date-string
   */
  
  force.convert_to_date_string = function(s){
    return s.toDateString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-iso-string
   */
  
  force.convert_to_iso_string = function(s){
    return s.toISOString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-json
   */
  
  force.convert_to_json = function(s){
    return s.toJSON()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-gmt-string
   */
  
  force.convert_to_gmt_string = function(s){
    return s.toGMTString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-date-string
   */
  
  force.convert_to_locale_date_string = function(s){
    return s.toLocaleDateString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-format
   */
  
  force.convert_to_locale_format = function(s){
    return s.toLocaleFormat()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-string
   */
  
  force.convert_to_locale_string = function(s){
    return s.toLocaleString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-time-string
   */
  
  force.convert_to_locale_time_string = function(s){
    return s.toLocaleTimeString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-string
   */
  
  force.convert_to_string = function(s){
    return s.toString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-time-string
   */
  
  force.convert_to_time_string = function(s){
    return s.toTimeString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-utc-string
   */
  
  force.convert_to_utc_string = function(s){
    return s.toUTCString()
  }
  
  /**
   * @mount/drive-js/datetime#get-value-of
   */
  
  force.get_value_of = function(s){
    return s.valueOf()
  }
})
stone.mount('@mount/drive-js/error', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/error#get-stack
   */
  
  force.get_stack = function(s){
    return s.stack
  }
  
  /**
   * @mount/drive-js/error#throw
   */
  
  force.throw = function(s){
    throw s
  }
})
stone.mount('@mount/drive-js/interval', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/interval#create
   */
  
  force.create = function(s, h){
    return window.setInterval(h, s)
  }
  
  /**
   * @mount/drive-js/interval#remove
   */
  
  force.remove = function(s){
    window.clearInterval(s)
  }
})
stone.mount('@mount/drive-js/object', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/object#create
   */
  
  force.create = function(){
    return {}
  }
  
  /**
   * @mount/drive-js/object#check-if-has-property
   */
  
  force.check_if_has_property = function(s, h){
    return s.hasOwnProperty(h)
  }
  
  /**
   * @mount/drive-js/object#stringify-json
   */
  
  force.stringify_json = function(s){
    return JSON.stringify(s)
  }
  
  /**
   * @mount/drive-js/object#parse-json
   */
  
  force.parse_json = function(s){
    return JSON.parse(s)
  }
  
  /**
   * @mount/drive-js/object#get-keys
   */
  
  force.get_keys = function(s){
    Object.keys(s)
  }
  
  /**
   * @mount/drive-js/object#get-values
   */
  
  force.get_values = function(s){
    Object.values(s)
  }
})
stone.mount('@mount/drive-js/regex', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/regex#create
   */
  
  force.create = function(s, h){
    return new RegExp(s, h)
  }
  
  /**
   * @mount/drive-js/regex#test
   */
  
  force.test = function(s, h){
    return s.test(h)
  }
})
stone.mount('@mount/drive-js/timeout', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/timeout#create
   */
  
  force.create = function(s, h){
    return window.setTimeout(h, s)
  }
  
  /**
   * @mount/drive-js/timeout#remove
   */
  
  force.remove = function(s){
    window.clearTimeout(s)
  }
})
stone.mount('@mount/drive-node', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/fs', function(build){
  const force = build.force
  
  /**
   * @mount/drive-node/fs#write-file
   */
  
  force.write_file = function(s, h, o, w, l){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#read-file
   */
  
  force.read_file = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#append-file
   */
  
  force.append_file = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#change-mode
   */
  
  force.change_mode = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#change-owner
   */
  
  force.change_owner = function(s, h, o, w, l){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#copy-file
   */
  
  force.copy_file = function(s, h, o, w, l){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#create-read-stream
   */
  
  force.create_read_stream = function(s, h, o){
    return null.null()
  }
  
  /**
   * @mount/drive-node/fs#create-write-stream
   */
  
  force.create_write_stream = function(s, h, o){
    return null.null()
  }
  
  /**
   * @mount/drive-node/fs#build-directory
   */
  
  force.build_directory = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#read-directory
   */
  
  force.read_directory = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#rename
   */
  
  force.rename = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#clear-directory
   */
  
  force.clear_directory = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#stat
   */
  
  force.stat = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#truncate
   */
  
  force.truncate = function(s, h, o, w){
    null.null()
  }
  
  /**
   * @mount/drive-node/fs#unlink
   */
  
  force.unlink = function(s, h, o){
    null.null()
  }
})
stone.mount('@mount/drive-node/assert', function(build){
  const force = build.force
  
  /**
   * @mount/drive-node/assert#assert-equal
   */
  
  force.assert_equal = function(s, h, o){
    s.equal(h, o)
  }
})
stone.mount('@mount/drive-node/buffer', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/child-process', function(build){
  const force = build.force
  
  /**
   * @mount/drive-node/child-process#spawn
   */
  
  force.spawn = function(s, h, o){
    return s.spawn(h, o)
  }
})
stone.mount('@mount/drive-node/event', function(build){
  const force = build.force
  
  /**
   * @mount/drive-node/event#add-event-listener
   */
  
  force.add_event_listener = function(s, h, o){
    null.null()
  }
  
  /**
   * @mount/drive-node/event#remove-event-listener
   */
  
  force.remove_event_listener = function(s, h, o){
    null.null()
  }
})
stone.mount('@mount/drive-node/http', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/http2', function(build){
  const force = build.force
  
  /**
   * @mount/drive-node/http2#create-secure-server
   */
  
  force.create_secure_server = function(s, h, o){
    null.null()
  }
})
stone.mount('@mount/drive-node/module', function(build){
  const force = build.force
  
  /**
   * @mount/drive-node/module#require
   */
  
  force.require = function(s){
    return require()
  }
  
  /**
   * @mount/drive-node/module#get-current-directory-path
   */
  
  force.get_current_directory_path = function(){
    return null
  }
  
  /**
   * @mount/drive-node/module#get-current-file-path
   */
  
  force.get_current_file_path = function(){
    return null
  }
})
stone.mount('@mount/drive-node/net', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/os', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/path', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/zlib', function(build){
  const force = build.force
})
stone.mount('@mount/drive-node/process', function(build){
  const force = build.force
})
stone.mount('@mount/drive-js/datetime', function(build){
  const force = build.force
  
  /**
   * @mount/drive-js/datetime#create
   */
  
  force.create = function(s){
    return new Date(s)
  }
  
  /**
   * @mount/drive-js/datetime#parse
   */
  
  force.parse = function(s){
    return Date.parse(s)
  }
  
  /**
   * @mount/drive-js/datetime#get-millisecond-timestamp
   */
  
  force.get_millisecond_timestamp = function(){
    return Date.now()
  }
  
  /**
   * @mount/drive-js/datetime#get-microsecond-timestamp
   */
  
  force.get_microsecond_timestamp = function(){
    return performance.now()
  }
  
  /**
   * @mount/drive-js/datetime#get-date
   */
  
  force.get_date = function(s){
    return s.getDate()
  }
  
  /**
   * @mount/drive-js/datetime#get-day
   */
  
  force.get_day = function(s){
    return s.getDay()
  }
  
  /**
   * @mount/drive-js/datetime#get-full-year
   */
  
  force.get_full_year = function(s){
    return s.getFullYear()
  }
  
  /**
   * @mount/drive-js/datetime#get-hours
   */
  
  force.get_hours = function(s){
    return s.getHours()
  }
  
  /**
   * @mount/drive-js/datetime#get-milliseconds
   */
  
  force.get_milliseconds = function(s){
    return s.getMilliseconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-minutes
   */
  
  force.get_minutes = function(s){
    return s.getMinutes()
  }
  
  /**
   * @mount/drive-js/datetime#get-month
   */
  
  force.get_month = function(s){
    return s.getMonth()
  }
  
  /**
   * @mount/drive-js/datetime#get-seconds
   */
  
  force.get_seconds = function(s){
    return s.getSeconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-time
   */
  
  force.get_time = function(s){
    return s.getTime()
  }
  
  /**
   * @mount/drive-js/datetime#get-timezone-offset
   */
  
  force.get_timezone_offset = function(s){
    return s.getTimezoneOffset()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-date
   */
  
  force.get_utc_date = function(s){
    return s.getUTCDate()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-day
   */
  
  force.get_utc_day = function(s){
    return s.getUTCDay()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-full-year
   */
  
  force.get_utc_full_year = function(s){
    return s.getUTCFullYear()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-hours
   */
  
  force.get_utc_hours = function(s){
    return s.getUTCHours()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-milliseconds
   */
  
  force.get_utc_milliseconds = function(s){
    return s.getUTCMilliseconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-minutes
   */
  
  force.get_utc_minutes = function(s){
    return s.getUTCMinutes()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-month
   */
  
  force.get_utc_month = function(s){
    return s.getUTCMonth()
  }
  
  /**
   * @mount/drive-js/datetime#get-utc-seconds
   */
  
  force.get_utc_seconds = function(s){
    return s.getUTCSeconds()
  }
  
  /**
   * @mount/drive-js/datetime#get-year
   */
  
  force.get_year = function(s){
    return s.getYear()
  }
  
  /**
   * @mount/drive-js/datetime#set-date
   */
  
  force.set_date = function(s, h){
    s.setDate(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-full-year
   */
  
  force.set_full_year = function(s, h){
    s.setFullYear(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-hours
   */
  
  force.set_hours = function(s, h){
    s.setHours(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-milliseconds
   */
  
  force.set_milliseconds = function(s, h){
    s.setMilliseconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-minutes
   */
  
  force.set_minutes = function(s, h){
    s.setMinutes(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-month
   */
  
  force.set_month = function(s, h){
    s.setMonth(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-seconds
   */
  
  force.set_seconds = function(s, h){
    s.setSeconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-time
   */
  
  force.set_time = function(s, h){
    s.setTime(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-date
   */
  
  force.set_utc_date = function(s, h){
    s.setUTCDate(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-full-year
   */
  
  force.set_utc_full_year = function(s, h){
    s.setUTCFullYear(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-hours
   */
  
  force.set_utc_hours = function(s, h){
    s.setUTCHours(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-milliseconds
   */
  
  force.set_utc_milliseconds = function(s, h){
    s.setUTCMilliseconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-minutes
   */
  
  force.set_utc_minutes = function(s, h){
    s.setUTCMinutes(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-month
   */
  
  force.set_utc_month = function(s, h){
    s.setUTCMonth(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-utc-seconds
   */
  
  force.set_utc_seconds = function(s, h){
    s.setUTCSeconds(h)
  }
  
  /**
   * @mount/drive-js/datetime#set-year
   */
  
  force.set_year = function(s, h){
    s.setYear(h)
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-date-string
   */
  
  force.convert_to_date_string = function(s){
    return s.toDateString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-iso-string
   */
  
  force.convert_to_iso_string = function(s){
    return s.toISOString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-json
   */
  
  force.convert_to_json = function(s){
    return s.toJSON()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-gmt-string
   */
  
  force.convert_to_gmt_string = function(s){
    return s.toGMTString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-date-string
   */
  
  force.convert_to_locale_date_string = function(s){
    return s.toLocaleDateString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-format
   */
  
  force.convert_to_locale_format = function(s){
    return s.toLocaleFormat()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-string
   */
  
  force.convert_to_locale_string = function(s){
    return s.toLocaleString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-locale-time-string
   */
  
  force.convert_to_locale_time_string = function(s){
    return s.toLocaleTimeString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-string
   */
  
  force.convert_to_string = function(s){
    return s.toString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-time-string
   */
  
  force.convert_to_time_string = function(s){
    return s.toTimeString()
  }
  
  /**
   * @mount/drive-js/datetime#convert-to-utc-string
   */
  
  force.convert_to_utc_string = function(s){
    return s.toUTCString()
  }
  
  /**
   * @mount/drive-js/datetime#get-value-of
   */
  
  force.get_value_of = function(s){
    return s.valueOf()
  }
})
stone.mount('@mount/start/force/check', function(build){
  const force = build.force
  force.check = function(){
  }
  force.check_state = function(){
  }
  force.check_blank = function(s){
  }
  force.check_match = function(s, h){
  }
  force.check_blank_match = function(s, h){
  }
  force.check_floor = function(s, h){
  }
  force.check_floor_match = function(s, h){
  }
  force.check_crest = function(s, h){
  }
  force.check_crest_match = function(s, h){
  }
  force.check_blend = function(s, h){
  }
  force.check_cross = function(s, h){
  }
  force.check_shift_match = function(s, h){
  }
  force.check_shift = function(s){
  }
})
stone.mount('@mount/start/force/store', function(build){
  const force = build.force
  force.hatch = function(){
  }
  force.climb = function(){
  }
  force.clear = function(){
  }
  force.drive = function(){
  }
  force.store = function(){
  }
  force.clone = function(){
  }
  force.fetch = function(){
  }
  force.is_within_range = function(){
    check_blend()
  }
  force.slate = function(s, h, o){
    clone_count()
    shift_state_front()
    break_count()
    drive_stick_chain_start_shift()
  }
  force.allocate_memory_block = function(s, h, o, w, l, i){
    store()
    slice_count()
    round_count_crest()
    clone_count()
    pluck()
    propagate()
    throw()
  }
  force.pluck = function(s, h, o, w, l){
    check_match()
  }
  force.propagate = function(s, h, o, w, l){
    clear_count()
    check_crest()
  }
  force.bin_remove = function(){
  }
  force.set_key_value_bin = function(){
  }
})
stone.mount('@mount/start/force/track', function(build){
  const force = build.force
  force.shift_track = function(s){
  }
})
stone.mount('@mount/start/force/count', function(build){
  const force = build.force
  force.mount = function(){
  }
  force.clear = function(){
  }
  force.clone = function(){
  }
  force.slice = function(){
  }
  force.clock = function(){
  }
  force.raise = function(){
  }
  force.floor = function(){
  }
  force.round = function(){
  }
  force.round_crest = function(){
  }
  force.round_floor = function(){
  }
  force.fetch_floor = function(){
  }
  force.fetch_crest = function(){
  }
  force.hatch = function(){
  }
  force.hatch_bound = function(){
  }
  force.break = function(){
  }
  force.scale = function(){
  }
  force.slant_wheel = function(){
  }
  force.slant_wheel_shift = function(){
  }
  force.slant_wheel_shift_2 = function(){
  }
  force.climb_wheel = function(){
  }
  force.climb_wheel_shift = function(){
  }
  force.cross_wheel = function(){
  }
  force.cross_wheel_shift = function(){
  }
  force.fetch_house = function(){
  }
  force.block = function(){
  }
})
stone.mount('@mount/start/force/drive', function(build){
  const force = build.force
  force.start = function(){
  }
  force.mount_0 = function(s){
  }
  force.mount_1 = function(s, h, o){
  }
  force.mount_2 = function(s, h, o, w, l){
  }
  force.mount_3 = function(s, h, o, w, l, i, n){
  }
  force.mount_4 = function(s, h, o, w, l, i, n, k, d){
  }
  force.mount_5 = function(s, h, o, w, l, i, n, k, d, r, u){
  }
  force.mount_6 = function(s, h, o, w, l, i, n, k, d, r, u, m, b){
  }
  force.mount_7 = function(s, h, o, w, l, i, n, k, d, r, u, m, b, e, a){
  }
  force.mount_0_shift = function(s, h){
  }
  force.mount_1_shift = function(s, h, o, w){
  }
  force.mount_2_shift = function(s, h, o, w, l, i){
  }
  force.mount_3_shift = function(s, h, o, w, l, i, n, k){
  }
  force.mount_4_shift = function(s, h, o, w, l, i, n, k, d, r){
  }
  force.mount_5_shift = function(s, h, o, w, l, i, n, k, d, r, u, m){
  }
  force.mount_6_shift = function(s, h, o, w, l, i, n, k, d, r, u, m, b, e){
  }
  force.mount_7_shift = function(s, h, o, w, l, i, n, k, d, r, u, m, b, e, a, t){
  }
  force.shift_match = function(s, h, o){
  }
  force.shift_shift_match = function(s, h, o){
  }
  force.shift_crest = function(s, h, o){
  }
  force.shift_floor = function(s, h, o){
  }
  force.shift_crest_match = function(s, h, o){
  }
  force.shift_floor_match = function(s, h, o){
  }
  force.shift = function(s){
  }
  force.store_mount_share = function(s, h){
  }
  force.store_mount_drive_share = function(s, h){
  }
  force.store_mount_build_share = function(s, h){
  }
  force.store_mount_build = function(s, h){
  }
  force.store_build_mount_share = function(s, h){
  }
  force.store_build_drive_share = function(s, h){
  }
  force.store_build_build = function(s, h){
  }
  force.fetch_drive = function(){
  }
  force.mount_drive = function(s){
  }
  force.clear_drive = function(){
  }
  force.cause = function(s){
  }
  force.store_latch_drive_latch = function(s, h){
  }
  force.store_latch_drive_build = function(s, h){
  }
  force.store_latch_drive_mount = function(s, h){
  }
  force.fetch_build = function(s){
  }
  force.fetch_mount = function(s){
  }
  force.fetch = function(s){
  }
  force.mount_build = function(s){
  }
  force.clear_build = function(){
  }
})
stone.mount('@mount/start/force/chain', function(build){
  const force = build.force
  force.store = function(s, h){
  }
  force.fetch = function(s, h){
  }
  force.slice = function(s, h){
  }
  force.drive = function(s){
  }
  force.drive_start_front = function(s){
  }
  force.slice_chunk = function(s, h, o){
  }
  force.slice_front = function(s){
  }
  force.mount_front = function(s, h){
  }
  force.mount_start = function(s, h){
  }
  force.shift = function(s){
  }
  force.clean = function(s){
  }
  force.mount = function(s, h){
  }
  force.fetch_start = function(s){
  }
  force.fetch_front = function(s){
  }
  force.fetch_count = function(s){
  }
  force.fetch_slice = function(s, h, o){
  }
  force.break = function(s, h){
  }
  force.chunk = function(s, h){
  }
  force.match_blend = function(){
  }
  force.match_cross = function(){
  }
  force.check_house_block = function(s, h){
  }
  force.fetch_block_slate = function(s, h){
  }
  force.match = function(s, h){
  }
})
stone.mount('@mount/start/force/stick/hatch', function(build){
  const force = build.force
  force.clear_latch_black_match = function(s, h, o){
    check_blend()
  }
  force.fetch = function(s, h){
    store()
    store()
    drive()
    check_cross()
  }
  force.build_latch = function(s){
    drive()
  }
  force.wipe = function(s, h, o){
    clear_chain()
    build_latch_check_shift()
  }
  force.build_latch_check_shift = function(s, h){
    check_match()
  }
  force.crawl = function(s, h){
    store()
    store()
    drive()
    clear_count()
  }
  force.shift = function(s, h, o, w, l){
    shift_start()
    check_match()
  }
  force.move_to_front = function(s, h){
    clear_count()
    shift()
  }
  force.move_from_front = function(s, h){
    shift()
  }
})
stone.mount('@mount/start/force/stick/chain', function(build){
  const force = build.force
  force.fetch = function(s, h){
    reach()
    check_floor()
  }
  force.reach = function(s, h){
    store()
    check_floor()
    check_floor()
    clear_count()
    check_crest_match()
    drive()
    build()
    store()
    store()
  }
  force.store = function(s, h, o){
    reach()
    store()
    store()
    drive()
    insert_to_layer()
  }
  force.remove_item_at = function(s, h){
    reach()
    store()
    store()
    check_crest_match()
    store()
    drive()
  }
  force.mount_front = function(s, h){
    store()
  }
  force.clear_front = function(s){
    remove_item_at()
  }
  force.unshift = function(s, h){
    store()
  }
  force.shift = function(s){
    remove_item_at()
  }
  force.try_to_rebase_on_insert = function(s, h){
    check_shift_match()
  }
  force.try_shift_left_on_insert = function(s, h, o, w){
    is_available_to_move_left()
  }
  force.is_available_to_move_left = function(s, h, o){
    check_cross()
  }
  force.move = function(s, h, o, w, l){
    shift_start()
  }
  force.move_to_next = function(s, h){
    clear_count()
    move()
  }
  force.move_from_next = function(s, h){
    move()
  }
  force.drive_stick_chain_start_shift = function(){
  }
})
stone.mount('@mount/start/force/stick', function(build){
  const force = build.force
  force.pair_with_smallest = function(s){
    check_cross()
  }
  force.is_fill_ratio_fine = function(s, h){
    clone_count()
    check_crest()
  }
  force.split_node = function(s, h, o, w){
    shift_state_front()
    check_match()
    check_match()
    shift()
    insert_into_sibling()
    throw()
  }
  force.clear_chain = function(s, h, o){
    build_stick_scale()
    copy_within()
    clear_count()
    mount_count()
    drive()
    clear_count()
    floor_count()
  }
  force.build_stick_scale = function(s, h, o, w){
    store()
    check_match()
    check_match()
    clone_count()
    drive()
  }
  force.remove_node_from_layer = function(s, h){
    check_shift_match()
    mount_count()
    wipe()
  }
  force.insert_to_layer = function(s, h, o){
    shift()
    check_match()
  }
  force.wipe_layer = function(s, h, o){
    build_stick_scale()
    copy_within()
    clear_count()
    mount_count()
    store()
    drive()
    clear_count()
    clear_count()
  }
  force.try_to_rebase_on_remove = function(s, h, o, w){
    check_blend()
  }
  force.try_to_merge_or_redistribute_on_remove = function(s, h, o, w){
    mount_count()
    shift_state_front()
    check_crest()
  }
  force.try_to_redistribute = function(s, h, o, w){
    check_match()
    pair_with_smallest()
    store()
    store()
    check_match()
    mount_count()
    clone_count()
    check_floor_match()
  }
  force.move_from = function(s, h, o, w, l){
    shift_start()
  }
  force.move_to_next = function(s, h){
    clear_count()
    move_from()
  }
  force.move_from_next = function(s, h){
    move_from()
  }
  force.is_at_capacity = function(s, h){
    check_match()
  }
  force.copy_within = function(){
    clear_count()
    check_floor()
    raise()
  }
  force.shift_start = function(s, h, o, w, l){
    mount_count()
    fetch_crest_count()
    copy_within()
    raise_count()
    check_shift_match()
    mount_count()
    build_stick_scale()
    check_shift_match()
  }
  force.shift = function(){
  }
  force.insert_into_sibling = function(){
  }
  force.wipe = function(){
  }
})
stone.mount('@mount/start/force/clock', function(build){
  const force = build.force
  force.add = function(){
  }
  force.get = function(){
  }
  force.still = function(){
  }
  force.fetch = function(){
  }
  force.start = function(){
  }
  force.clear = function(){
  }
  force.build = function(){
  }
  force.fetch_clock_state_shift_2 = function(){
  }
  force.fetch_clock_state_shift_1 = function(){
  }
  force.fetch_clock_state_0 = function(){
  }
  force.fetch_clock_state_1 = function(){
  }
  force.fetch_clock_state_2 = function(){
  }
  force.fetch_clock_state_3 = function(){
  }
  force.fetch_clock_state_4 = function(){
  }
  force.fetch_clock_state_5 = function(){
  }
  force.fetch_clock_state_6 = function(){
  }
  force.fetch_clock_state_7 = function(){
  }
})
stone.mount('@mount/start/force/write', function(build){
  const force = build.force
  force.write = function(){
  }
  force.drive = function(s){
  }
})
stone.mount('@mount/start/force/state/chain', function(build){
  const force = build.force
  force.blend = function(){
  }
  force.cross = function(){
  }
  force.shift_start = function(){
  }
  force.shift_front = function(){
  }
  force.shift_front_count = function(){
  }
  force.drift = function(){
  }
  force.twist = function(){
  }
})
stone.mount('@mount/start/force/state', function(build){
  const force = build.force
  force.store = function(){
    shift_start()
    blend()
  }
  force.check = function(){
    shift_start()
    cross()
    check_shift_match()
  }
  force.clear = function(){
  }
  force.shift = function(){
  }
})
stone.mount('@mount/start/force/shard', function(build){
  const force = build.force
  force.fetch_block_count = function(){
  }
  force.drive = function(s){
    store()
    drive()
  }
})
stone.mount('@mount/start/force/force', function(build){
  const force = build.force
  force.still = function(){
  }
  force.throw = function(){
  }
  force.store = function(){
  }
  force.raise = function(){
  }
  force.stack = function(){
  }
  force.drive = function(){
  }
  force.build = function(){
  }
})
stone.mount('@mount/stone/check', function(build){
  const force = build.force
  force.find_fibonacci_via_loop = function(s){
    store()
    store()
    store()
    drive()
  }
  force.find_fibonacci_via_recursion = function(s, h, o){
    check_blank()
  }
})
