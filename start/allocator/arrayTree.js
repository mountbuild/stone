
const sharedTree = require('./sharedTree')

function getItemAt(tree, offset) {
  let [node, index] = locate(tree, offset);
  if (index < node.childCount) return node.children[index];
}

function locate(tree, offset) {
  let node = tree.base;
  // Normalise argument
  offset = offset < 0 ? Math.max(0, node.count + offset) : Math.min(offset, node.count);
  // Shortcuts

  if (offset < tree.first.childCount) return [tree.first, offset]; // *
  if (offset >= node.count - tree.last.childCount) {
    return [tree.last, offset - node.count + tree.last.childCount]; // *
  }
  while (!sharedTree.isLeaf(node)) {
    let index = 0;
    let child = node.children[index];
    while (offset > child.count || offset === child.count && child.next) {
      offset -= child.count;
      child = node.children[++index];
    }
    node = child;
  }
  return [node, offset];
}

function insertItemAt(tree, offset, value) {
  let [node, index] = locate(tree, offset);
  sharedTree.applyInsert(tree, node, index, value, Node)
  // console.log(node, index)
}

function removeItemAt(tree, offset) {
  let [node, index] = locate(tree, offset);
  if (index >= node.childCount) return;
  let value = node.children[index]; // * get deleted item (to return it)
  return sharedTree.applyRemove(tree, node, index, value)
}

class Node {
  constructor(capacity, isLeaf = true) {
    this.isLeafType = isLeaf
    // Mimic fixed-size array (avoid accidentally growing it)
    this.children = Object.seal(Array(16).fill(null))
    this.childCount = 0; // Number of used slots in children array
    this.count = 0; // Total number of values in this subtree
    // Maintain back-link to parent.
    this.parent = null;
    // Per level in the tree, maintain a doubly linked list
    this.prev = this.next = null;
    this.type = 'node'
  }
  isLeaf() {
    return !(this.children[0] instanceof Node);
  }
  wipe(start, end) {
    sharedTree.basicWipe(this, start, end)
  }
  moveFrom(neighbor, target, start, count = 1) {
    sharedTree.basicMoveFrom(this, neighbor, target, start, count)
  }
  moveToNext(count) {
    this.next.moveFrom(this, 0, this.childCount - count, count);
  }
  moveFromNext(count) {
    this.moveFrom(this.next, this.childCount, 0, count);
  }
  toString() {
    return "[" + this.children.map(v => v ?? "-").join() + "]";
  }
}

class Tree {
  constructor(nodeCapacity = 16) {
    this.nodeCapacity = nodeCapacity;
    this.base = new Node(16);
    this.first = this.last = this.base; // Head of doubly linked list at bottom level
  }
  locate(offset) {
    return locate(this, offset)
  }
  getItemAt(offset) {
    return getItemAt(this, offset)
  }
  removeItemAt(offset) {
    return removeItemAt(this, offset)
  }
  insertItemAt(offset, value) {
    insertItemAt(this, offset, value)
  }
  // * added 4 methods
  push(value) {
    this.insertItemAt(this.base.count, value);
  }
  pop() {
    return this.removeItemAt(-1);
  }
  unshift(value) {
    this.insertItemAt(0, value);
  }
  shift() {
    return this.removeItemAt(0);
  }
}

Tree.forEachStartingAt = function*(tree, globalIndex) {
  let [node, index] = tree.locate(globalIndex)
  for (node; node; node = node.next) {
    for (let i = index; i < node.childCount; i++) {
      yield([node.children[i], globalIndex])
      globalIndex++
    }
  }
}

module.exports = Tree

Tree.Node = Node

/* Below this point: these methods are optional */
Tree.prototype[Symbol.iterator] = function*() { // Make tree iterable
  let i = 0;
  for (let node = this.first; node; node = node.next) {
    for (let i = 0; i < node.childCount; i++) yield node.children[i];
  }
}
