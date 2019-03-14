
const sharedTree = require('./sharedTree')

function wipe(node, start, end) {
  sharedTree.basicWipe(node, start, end)
  // Update key if first item changed
  updateKeyIfChanged(node, start)
}

function updateKeyIfChanged(node, start) {
  if (start === 0) {
    if (node.childCount > 0) {
      node.updateKey();
    } else {
      node.key = null
    }
  }
}

function removeByKey(tree, key) {
  let [node, index] = locateByKey(tree, key);
  if (removeKeyDoesntMatch(node, index, key)) return; // not found
  let value = node.children[index].value
  return sharedTree.applyRemove(tree, node, index, value)
}

function setKeyValue(tree, key, value) {
  let [node, index] = locateByKey(tree, key);
  if (index < node.childCount && node.children[index].key === key) {
    // already present: update the value
    node.children[index].value = value;
    return;
  }
  let item = new KeyValue(key, value); // item can be a KeyValue or a Node
  sharedTree.applyInsert(tree, node, index, item, Node)
}

function getByKey(tree, key) {
  let [node, index] = locateByKey(tree, key);
  if (index < node.childCount) {
    let keyValue = node.children[index];
    if (keyValue.key === key) return keyValue.value;
  }
}

function removeKeyDoesntMatch(node, index, key) {
  return (index >= node.childCount || node.children[index].key !== key)
}

function binarySearch(node, key) {
  let low = 1;
  let high = node.childCount;
  while (low < high) {
    let index = (low + high) >> 1;
    let child = node.children[index]
    if (key >= child.key) {
      low = index + 1;
    } else {
      high = index;
    }
  }
  return low - 1
}

function locateByKey(tree, key) {
  let node = tree.base;
  let low;
  while (true) {
    // Binary search among keys
    low = binarySearch(node, key)
    if (sharedTree.isLeaf(node, Node)) break;
    node = node.children[low];
  }
  if (low < node.childCount && key > node.children[low].key) {
    return [node, low + 1];
  } else {
    return [node, low];
  }
}

class KeyValue {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  stringify(ind = 0) {
    return `${(new Array(ind)).join('  ')}${this.key}:${this.value}`
  }
}

class Node {
  constructor(capacity, isLeaf = true) {
    this.type = 'node'
    this.isLeafType = isLeaf
    // Mimic fixed-size array (avoid accidentally growing it)
    this.children = Object.seal(Array(capacity).fill(null));
    this.childCount = 0; // Number of used slots in children array
    this.count = 0
    // The algorithm relies on that fact that both KeyValue & Node have a key property:
    this.key = null; // Here it is a property for supporting a search
    // Maintain back-link to parent.
    this.parent = null;
    // Per level in the tree, maintain a doubly linked list
    this.prev = this.next = null;
  }
  isLeaf() {
    return !(this.children[0] instanceof Node);
  }
  updateKey() {
    for (let node = this; node; node = node.parent) {
      node.key = node.children[0].key;
    }
  }
  wipe(start, end) {
    return wipe(this, start, end)
  }
  moveFrom(neighbor, target, start, count = 1) {
    sharedTree.basicMoveFrom(this, neighbor, target, start, count)
    if (target === 0) this.updateKey();
  }
  moveToNext(count) {
    this.next.moveFrom(this, 0, this.childCount - count, count);
  }
  moveFromNext(count) {
    this.moveFrom(this.next, this.childCount, 0, count);
  }
  stringify(ind = 1) {
    let str = []
    let nodes = []
    let indent = (new Array(ind)).join('  ')
    let childIndent = `  ${indent}`
    this.children.forEach(v => {
      nodes.push((v == null ? `${childIndent}-` : v.stringify(ind + 1)))
    })

    str.push(indent, this.key, `(\n`)
    str.push(nodes.join(`\n`))
    str.push(`\n${indent})`)

    return str.join('')
  }
}

class Tree {
  constructor(nodeCapacity = 16) {
    this.nodeCapacity = nodeCapacity;
    this.base = new Node(nodeCapacity);
    this.first = this.last = this.base; // Head of doubly linked list at bottom level
  }
  stringify() {
    return this.base.stringify()
  }
  locate(key) {
    return locateByKey(this, key)
  }
  get(key) {
    return getByKey(this, key)
  }
  set(key, value) {
    setKeyValue(this, key, value)
  }
  remove(key) {
    return removeByKey(this, key)
  }
}

module.exports = Tree
Tree.Node = Node
Tree.KeyValue = KeyValue

Tree.prototype[Symbol.iterator] = function*() { // Make tree iterable, yielding key/value pairs
  for (let node = this.first; node; node = node.next) {
      for (let i = 0; i < node.childCount; i++) yield node.children[i]
  }
}

Tree.forEachReverse = function*(tree) { // Make tree iterable, yielding key/value pairs
  for (let node = tree.last; node; node = node.prev) {
      for (let i = node.childCount - 1; i >= 0; i--) yield [node, node.children[i]]
  }
}
