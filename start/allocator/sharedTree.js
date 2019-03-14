
exports.tryToRedistribute = function tryToRedistribute(tree, node, index, item) {
  if (node !== tree.base) {
    let [left, right] = exports.pairWithSmallest(node);
    let joinedIndex = left === node ? index : left.childCount + index;
    let sumCount = left.childCount + right.childCount + 1;
    if (sumCount <= 2 * tree.nodeCapacity) { // redistribute
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
        exports.insertToLayer(right, joinedIndex - left.childCount, item);
      } else {
        exports.insertToLayer(left, joinedIndex, item);
      }
      return true;
    }
  }
  return false
}

exports.removeNodeFromLayer = function removeNodeFromLayer(node, index) {
  if (!exports.isLeaf(node)) {
    // Take node out of the level's linked list
    let prev = node.children[index].prev;
    let next = node.children[index].next;
    if (prev) prev.next = next;
    if (next) next.prev = prev;
  }
  node.wipe(index, index + 1);
}

exports.insertToLayer = function insertToLayer(node, index, value) {
  node.moveFrom(null, index, value);
  if (value && value.type == 'node') {
    // Insert node in the level's linked list
    if (index > 0) {
      value.prev = node.children[index - 1];
      value.next = value.prev.next;
    } else if (node.childCount > 1) {
      value.next = node.children[1];
      value.prev = value.next.prev;
    }
    if (value.prev) value.prev.next = value;
    if (value.next) value.next.prev = value;
  }
}

exports.basicWipe = function basicWipe(node, start, end) {
  exports.updateTreeSize(node, start, end, -1);
  copyWithin(node.children, start, end, node.childCount);
  for (let i = node.childCount - end + start; i < node.childCount; i++) {
    node.children[i] = null;
  }
  node.childCount -= end - start;
}

function copyWithin(array, target, start, end) {
  let shift = target - start;
  if (shift < 0) {
      end = Math.min(end, array.length);
      for (let i = start; i < end; i++) {
          array[i + shift] = array[i];
      }
  } else {
      for (let i = Math.min(end, array.length - shift) - 1; i >= start; i--) {
          array[i + shift] = array[i];
      }
  }
  return array; // the array mutated, but it is handy to also return it.
}

exports.isAvailableToMoveLeft = function isAvailableToMoveLeft(tree, node, index) {
  return index === 0 && node.prev && node.prev.childCount < tree.nodeCapacity
}

exports.tryShiftLeftOnInsert = function tryShiftLeftOnInsert(tree, node, index, value) {
  if (exports.isAvailableToMoveLeft(tree, node, index)) {
    exports.insertToLayer(node.prev, node.prev.childCount, value);
    return true
  } else {
    return false
  }
}

exports.applyRemove = function(tree, node, index, value) {
  while (true) {
    console.assert(exports.isLeaf(node) || node.children[index].count === 0);
    exports.removeNodeFromLayer(node, index);

    if (!node.parent) return value
    if (exports.isFillRatioFine(tree, node)) return value
    // Node has potentially too few children, we should either merge or redistribute

    let [left, right] = exports.pairWithSmallest(node);

    let rebased = exports.tryToRebaseOnRemove(tree, node, left, right)
    if (rebased) return value

    let redistributed = exports.tryToMergeOrRedistributeOnRemove(tree, node, left, right)
    if (redistributed) return value

    // Merge:
    // Move all data from the right to the left
    left.moveFromNext(right.childCount);
    if (right === tree.last) tree.last = left;
    // Prepare to delete right node
    node = right.parent;
    index = exports.getIndexOf(right.parent, right)
  }
}

exports.applyInsert = function applyInsert(tree, node, index, item, Node) {
  while (exports.isAtCapacity(tree, node)) { // No room here
    let shifted = exports.tryShiftLeftOnInsert(tree, node, index, item)
    if (shifted) return

    let redistributed = exports.tryToRedistribute(tree, node, index, item)
    if (redistributed) return

    let sibling = exports.splitNode(tree, node, Node, index, item)

    exports.tryToRebaseOnInsert(tree, node, Node)

    // Prepare for inserting the sibling node into the tree
    index = exports.getIndexOf(node.parent, node) + 1;
    node = node.parent;
    item = sibling; // item is now a Node
  }
  exports.insertToLayer(node, index, item);
}

exports.basicMoveFrom = function basicMoveFrom(node, neighbor, target, start, count) {
  // Note: `start` can have two meanings:
  //   if neighbor is null, it is the value/Node to move to the target
  //   if neighbor is a Node, it is the index from where value(s) have to be moved to the target
  // Make room in target node
  copyWithin(node.children, target + count, target, Math.max(target + count, node.childCount));
  node.childCount += count;
  if (neighbor !== null) {
    // Copy the children
    for (let i = 0; i < count; i++) {
      node.children[target + i] = neighbor.children[start + i];
    }
    // Remove the original references
    neighbor.wipe(start, start + count);
  } else {
    node.children[target] = start; // start is value to insert
  }
  exports.updateTreeSize(node, target, target + count, 1);
  // Set parent link(s)
  if (!exports.isLeaf(node)) {
    for (let i = 0; i < count; i++) {
      node.children[target + i].parent = node;
    }
  }
  // Update key if first item changed
}

exports.tryToMergeOrRedistributeOnRemove = function tryToMergeOrRedistributeOnRemove(tree, node, left, right) {
  let sumCount = left.childCount + right.childCount;
  let childCount = sumCount >> 1;

  // Check whether to merge or to redistribute
  if (sumCount > tree.nodeCapacity) { // redistribute
    // Move some data from the bigger to the smaller node
    let shift = childCount - node.childCount;
    if (!shift) { // Boundary case: when a redistribution would bring no improvement
      console.assert(node.childCount * 2 === tree.nodeCapacity && sumCount === tree.nodeCapacity + 1);
      return true; // *
    }
    if (node === left) { // move some children from right to left
      left.moveFromNext(shift);
    } else { // move some children from left to right
      left.moveToNext(shift);
    }
    return true; // *
  }
  return false
}

exports.isFillRatioFine = function(tree, node) {
  return node.childCount * 2 > tree.nodeCapacity
}

exports.pairWithSmallest = function pairWithSmallest(node) {
  return node.prev && (!node.next || node.next.childCount > node.prev.childCount) ?
    [node.prev, node] : [node, node.next];
}

exports.getIndexOf = function getIndexOf(parent, child) {
  return parent.children.indexOf(child);
}

exports.splitNode = function(tree, node, Node, index, value) {
  // Cannot redistribute: split node
  let childCount = node.childCount >> 1;
  // Create a new node that will later become the right sibling of this node
  let sibling = new Node(16, !(value instanceof Node));
  if (node === tree.last) tree.last = sibling;
  // Move half of node node's data to it
  sibling.moveFrom(node, 0, childCount, childCount);
  // Insert the value in either the current node or the new one
  if (index > node.childCount) {
    exports.insertToLayer(sibling, index - node.childCount, value);
  } else {
    exports.insertToLayer(node, index, value);
  }
  return sibling
}

exports.updateTreeSize = function(node, start, end, sign) {
  let sum = 0;
  if (exports.isLeaf(node)) {
      sum = end - start;
  } else {
      for (let i = start; i < end; i++) sum += node.children[i].count;
  }
  if (!sum) return;
  sum *= sign;
  // Apply the sum change to node node and all its ancestors
  for (node; node; node = node.parent) {
      node.count += sum;
  }
}

exports.tryToRebaseOnRemove = function(tree, node, left, right) {
  if (!left || !right) { // A node with no siblings? Must become the base!
    tree.base = node;
    node.parent = null;
    return true; // *
  } else {
    return false
  }
}

exports.tryToRebaseOnInsert = function(tree, node, Node) {
  // Is this the base?
  if (!node.parent) {
    // ...then first create a parent, which is the new base
    tree.base = new Node(16, false);
    exports.insertToLayer(tree.base, 0, node);
  }
}

exports.isAtCapacity = function(tree, node) {
  return node.childCount === tree.nodeCapacity
}

exports.handleInsertIfAtCapacity = function(tree, node, index, item, Node) {

}

exports.isLeaf = function(node) {
  return node.isLeafType //!(node.children[0] instanceof Node);
}
