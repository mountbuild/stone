class Node {
  constructor(capacity) {
      // Mimic fixed-size array (avoid accidentally growing it)
      this.children = Object.seal(Array(capacity).fill(null));
      this.childCount = 0; // Number of used slots in children array
      this.key = null; // Property for supporting a search
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
      return !(this.children[0] instanceof Node);
  }
  index() {
      return this.parent.children.indexOf(this);
  }
  updateKey() {
      this.key = this.isLeaf() ? this.children[0] : this.children[0].key;
      for (let node = this.parent; node; node = node.parent) {
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
      if (start === 0) this.updateKey();
  }
  moveFrom(neighbor, target, start, count=1) {
      // Note: `start` can have two meanings:
      //   if neighbor is null, it is the key/Node to move to the target
      //   if neighbor is a Node, it is the index from where keys(s)/Node(s) have to be moved to the target
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
          this.children[target] = start; // start is key to insert
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
  basicInsert(index, value) { // value can be a key or a Node
      this.moveFrom(null, index, value);
      if (value instanceof Node) {
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

class Tree {
  constructor(nodeCapacity=32) {
      this.nodeCapacity = nodeCapacity;
      this.root = new Node(1);
      this.first = this.root; // Head of doubly linked list at bottom level
  }
  locate(key) {
      let node = this.root;
      while (!node.isLeaf()) {
          // Binary search among keys
          let low = 0;
          let high = node.childCount;
          while (low < high) {
              let index = (low + high) >> 1;
              if (key >= node.children[index].key) {
                  low = index + 1;
              } else {
                  high = index;
              }
          }
          if (low) low--;
          node = node.children[low];
      }
      // Binary search in leaf
      let low = 0;
      let high = node.childCount;
      while (low < high) {
          let index = (low + high) >> 1;
          if (key > node.children[index]) {
              low = index + 1;
          } else {
              high = index;
          }
      }
      return [node, low];
  }
  has(key) {
      let [node, index] = this.locate(key);
      return index < node.childCount && node.children[index] === key;
  }
  remove(key) {
      let [node, index] = this.locate(key);
      if (index >= node.childCount || node.children[index] !== key) return; // not found
      while (true) {
          node.basicRemove(index);

          // Exit when node's fill ratio is fine
          if (!node.parent || node.childCount * 2 > this.nodeCapacity) return;
          // Node has potentially too few children, we should either merge or redistribute

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
  insert(value) {  // value is a key
      let [node, index] = this.locate(value);
      if (index < node.childCount && node[index] === value) return; // already present
      while (node.childCount === this.nodeCapacity) { // No room here
          if (index === 0 && node.prev && node.prev.childCount < this.nodeCapacity) {
              return node.prev.basicInsert(node.prev.childCount, value);
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
                      right.basicInsert(joinedIndex - left.childCount, value);
                  } else {
                      left.basicInsert(joinedIndex, value);
                  }
                  return;
              }
          }
          // Cannot redistribute: split node
          let childCount = node.childCount >> 1;
          // Create a new node that will later become the right sibling of this node
          let sibling = new Node(childCount);
          // Move half of node node's data to it
          sibling.moveFrom(node, 0, childCount, childCount);
          // Insert the value in either the current node or the new one
          if (index > node.childCount) {
              sibling.basicInsert(index - node.childCount, value);
          } else {
              node.basicInsert(index, value);
          }
          // Is this the root?
          if (!node.parent) {
              // ...then first create a parent, which is the new root
              this.root = new Node(2);
              this.root.basicInsert(0, node);
          }
          // Prepare for inserting the sibling node into the tree
          index = node.index() + 1;
          node = node.parent;
          value = sibling; // value is now a Node
      }
      node.basicInsert(index, value);
  }
}

module.exports = Tree
Tree.Node = Node
