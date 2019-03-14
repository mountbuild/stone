
const ArrayTree = require('./arrayTree')
const KeyValueTree = require('./keyValueTree')

ArrayTree.allocate = doAllocate
ArrayTree.free = doFree
KeyValueTree.allocate = doAllocate
KeyValueTree.free = doFree
KeyValueTree.Node.allocate = doAllocate
KeyValueTree.Node.free = doFree
ArrayTree.Node.allocate = doAllocate
ArrayTree.Node.free = doFree

let bins
bins = new ArrayTree()
bins.push(new KeyValueTree) // 128 bits each chunk
bins.push(new KeyValueTree) // 256
bins.push(new KeyValueTree) // 512
bins.push(new KeyValueTree) // 1024
bins.push(new KeyValueTree) // 2048
bins.push(new KeyValueTree) // 4096
bins.push(new KeyValueTree) // 8192
bins.push(new KeyValueTree) // 16384
bins.push(new KeyValueTree) // 32768
bins.push(new KeyValueTree) // 65536
bins.push(new KeyValueTree) // 131072
bins.push(new KeyValueTree) // 262144
bins.push(new KeyValueTree) // 524288
bins.push(new KeyValueTree) // 1048576
bins.push(new KeyValueTree) // 2097152
let last = new KeyValueTree
last.set(0, 100)
bins.push(last)

module.exports = {
  allocate: doAllocate,
  free: doFree,
  bins
}

function doFree(size, address) {
  if (!bins) return
  return free(bins, size, address)
}

function doAllocate(bits, quantity) {
  if (!bins) return
  return allocate(bins, bits, quantity)
}

function free(bins, size, address) {
  if ((size & (size - 1)) != 0) {
    throw "Parameter is not a power of 2";
  }

  if (size < 32 || size > 4194304) {
    throw "size required out of range";
  }

  var binIndex = Math.log2(size >> 5);

  merge(bins, binIndex, address, size)
}

function getNodeWithClosestKey(tree, key) {
  let node = tree.base
  let i = 0
  while (true) {
    // Binary search among keys
    i = 0
    let n = node.childCount
    loop2:
    while (i < n) {
      let child = node.children[i]
      if (key <= child.key) {
        break loop2
      }
      i++
    }
    if (node.isLeaf()) break;
    node = node.children[i]
  }
  return [node, i]
}

function merge(bins, binIndex, key, size) {
  while (true) {
    let tree = bins.getItemAt(binIndex)
    let [node, i] = getNodeWithClosestKey(tree, key)
    let current = node.children[i]
    let prev = node.children[i - 1]
    let fraction = key / size
    if (isEven(fraction)) {
      if (current && key == current.key + size) {
        tree.remove(key)
        binIndex++
        size *= 2
        key = current.key
      } else if (prev && key == prev.key - size) {
        tree.remove(prev.key)
        binIndex++
        size *= 2
      } else {
        tree.set(key, 1)
        break
      }
    } else if (isOdd(fraction)) {
      if (current && key == current.key - size) {
        tree.remove(key)
        binIndex++
        size *= 2
      } else if (prev && key == prev.key + size) {
        tree.remove(prev.key)
        binIndex++
        key = prev.key
        size *= 2
      } else {
        tree.set(key, 1)
        break
      }
    }
  }
}

function isOdd(num) { return num % 2 }
function isEven(num) { return num % 2 == 0 }

function allocate(bins, bits, quantity = 1) {
  var requiredSize = bits * quantity

  if ((bits & (bits - 1)) != 0) {
    throw "Parameter is not a power of 2";
  }

  if (bits < 32 || bits > 4194304) {
    throw "Bits required out of range";
  }

  var startBinIndex = Math.log2(bits >> 5);

  for ([bin, binIndex] of ArrayTree.forEachStartingAt(bins, startBinIndex)) {
    //
    // We have found a bin that is not empty...
    //
    if (bin.base.count == 0) {
      continue
    }

    var thisBinMemorySize = (32 << binIndex);

    for ([node, keyValue] of KeyValueTree.forEachReverse(bin)) {
      var blockSize = keyValue.value * thisBinMemorySize;
      //
      // We've found a continous block this bin that fits the amount we want
      //
      if (blockSize >= requiredSize) {
        //
        // We are going to return this block
        //
        var allocatedMemoryBlock = allocateMemoryBlock(bin, bins, requiredSize, thisBinMemorySize, node, keyValue)
        return allocatedMemoryBlock
      }
    }

    // var binBlock = bin.first.children[0];
    // var memoryAddress = binBlock.key;
    // var allocatedMemoryBlock = memoryAddress

    // pluck(bin, binBlock, thisBinMemorySize)
    // propagate(bins, bits, thisBinMemorySize, memoryAddress, startBinIndex)

    // return allocatedMemoryBlock;
  }
  return null; // out of memory...
}

function allocateMemoryBlock(bin, bins, requiredSize, thisBinMemorySize, node, keyValue) {
  const allocatedMemoryBlock = keyValue.key
  const blockConsumed = Math.ceil(requiredSize / thisBinMemorySize);
  const totalMemoryConsumed = thisBinMemorySize * blockConsumed;
  pluck(bin, blockConsumed, keyValue, node, thisBinMemorySize)
  propagate(bins, thisBinMemorySize, totalMemoryConsumed, requiredSize, allocatedMemoryBlock)
  return allocatedMemoryBlock;
}

function propagate(bins, thisBinMemorySize, totalMemoryConsumed, requiredSize, allocatedMemoryBlock) {
  //
  // We may have acquired more memory than we need so we need to put the excess back into their respective bins...
  //
  var leftOverMemory = totalMemoryConsumed - requiredSize;
  if (leftOverMemory > 0) {
    //
    // adjust the left over memory start address by the amount we have actually used
    //
    var leftOverMemoryAddressStartsAt = allocatedMemoryBlock + requiredSize;
    var endOfMemory = allocatedMemoryBlock + totalMemoryConsumed;

    while (leftOverMemory != 0) {
      //
      // Previous bin... size and index
      //
      thisBinMemorySize >>= 1;
      binIndex--;

      //
      // This unused block fits in this bin...
      //
      if (leftOverMemory - thisBinMemorySize >= 0) {
        //
        // Register it...
        //
        endOfMemory -= thisBinMemorySize;
        bins.getItemAt(binIndex).set(endOfMemory, 1)

        //
        // Reduce the amount of left over memory...
        //
        leftOverMemory -= thisBinMemorySize;
        leftOverMemoryAddressStartsAt += thisBinMemorySize;
      }
    }
  }
}

function pluck(bin, blockConsumed, keyValue, node, thisBinMemorySize) {
  //
  // Figure out how many blocks were consumed...
  //
  //
  // Perfect amount, so delete whole block from bin
  //
  if (blockConsumed == keyValue.value) {
    bin.remove(keyValue.key)
  } else {
    //
    // Otherwise count reduced by consumed block amount and the start address is adjusted to account for consumed block
    //
    keyValue.value -= blockConsumed;
    keyValue.key += thisBinMemorySize * blockConsumed;
    node.updateKey()
  }
}
