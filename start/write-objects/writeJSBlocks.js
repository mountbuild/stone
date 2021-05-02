
function writeJSBlocks(blocks) {
  const store = []
  blocks.forEach(block => {
    let { scale, trace } = block
    let i = 0
    while (i < scale) {
      store[trace + i] = getValue(block, i)
      i++
    }
  })

  const arr = chunkArray(store, 8).map(x => {
    let vals = []
    for (let i = 0, n = x.length; i < n; i++) {
      vals.push(x[i] || 0)
    }
    return `    ` + vals.map(x => decimalToHex(x, 5)).join(', ')
  }).join(',\n')
  return `[\n${arr}\n  ]`
}

module.exports = writeJSBlocks

function getValue(block, slate) {
  const state = block.state[slate]
  if (!state) return 0
  const { build } = state
  if (build && build.isBlock) {
    return build.trace || 0
  } else {
    return build || 0
  }
}

function chunkArray(arr, len) {
  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

function decimalToHex(d, padding) {
  let hex = Number(d).toString(16)
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding

  while (hex.length < padding) {
    hex = '0' + hex
  }

  return '0x' + hex
}
