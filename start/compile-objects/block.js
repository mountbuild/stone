
const { allocate } = require('../allocator')

const cache = {}

class Block {
  constructor(scale) {
    if (!scale) throw `need scale`
    this.state = []
    let bits = scale * 32
    this.scale = scale
    this.trace = allocate(bits, 1) / 32
    this.isBlock = true
  }

  reach(brand) {
    let i = 0
    while (i < this.state.length) {
      if (this.state[i].brand == brand) {
        return this.state[i]
      }
      i++
    }
  }

  fetch(brand) {
    let state = this.reach(brand)
    if (state) return state.build
  }

  store(brand, build) {
    let state = this.reach(brand)
    if (state) {
      state.build = build
    } else {
      this.state.push({ brand, build })
    }
  }

  clear(brand) {
    let state
    let i = 0
    while (i < this.state.length) {
      if (this.state[i].brand == brand) {
        this.state.splice(i, 1)
        break
      }
      i++
    }
  }
}

module.exports = Block

function build(brand) {
  return cache[brand]
    = cache[brand]
    || new Block
}

function block_field(brand, state) {
  const b = build(`field ${brand}`)
  if (arguments.length === 1) {
    return b
  } else {
    b.store('weave', block_field('field-shard'))
    b.store('field', block_field('field'))
    b.store('brand', block_brand(brand))
    b.store('state', block_chain(state))
  }
}

function block_force(brand, { mount, cause, force } = {}) {
  const b = build(`force ${brand}`)
  if (arguments.length === 1) {
    return b
  } else {
    b.store('weave', block_field('field-shard'))
    b.store('field', block_field('field'))
    b.store('brand', block_brand(brand))
    b.store('mount', block_chain(mount || []))
    b.store('cause', block_chain(cause || []))
    b.store('force', block_chain(force || []))
    return b
  }
}

function block_cause(brand, mount = []) {
  const b = build(`cause ${brand}`)
  if (arguments.length === 1) {
    return b
  } else {
    b.store('weave', block_field('field-shard'))
    b.store('field', block_field('field'))
    b.store('force', block_force(brand))
    b.store('mount', block_chain(mount))
    return b
  }
}

function block_count_8(count) {
  const b = new Block
  b.store('weave', block_field('count-8-shard'))
  b.store('field', block_field('count'))
  b.store('scale', 1)
  b.store('trace', count)
  return b
}

function block_count(count) {
  return block_count_8(count)
}

function block_brand_8(brand) {
  const b = new Block
  b.store('weave', block_field('write-8-shard'))
  b.store('field', block_field('write'))
  b.store('scale', brand.length)
  b.store('trace', brand)
  return b
}

function block_brand_16(brand) {
  const b = new Block
  b.store('weave', block_field('write-16-shard'))
  b.store('field', block_field('write'))
  b.store('scale', brand.length)
  b.store('trace', brand)
  return b
}

function block_brand(brand) {
  if (brand.length <= 20) {
    return block_brand_8(brand)
  } else if (brand.length <= 52) {
    return block_brand_16(brand)
  } else {
    throw `bound block brand: '${brand}'`
  }
}

function block_write(write) {
  const b = new Block
  b.store('weave', block_field('write-16-shard'))
  b.store('field', block_field('write'))
  b.store('scale', write.length)
  b.store('trace', write)
  return b
}

function block_chain_8(chain) {
  const b = new Block
  b.store('weave', block_field('chain-8-shard'))
  b.store('field', block_field('chain'))
  b.store('count', chain.length)
  b.store('chain', chain)
  return b
}

function block_chain_16(chain) {
  const b = new Block
  b.store('weave', block_field('chain-16-shard'))
  b.store('field', block_field('chain'))
  b.store('count', chain.length)
  b.store('chain', chain)
  return b
}

function block_chain(chain) {
  if (chain.length <= 5) {
    return block_chain_8(chain)
  } else if (chain.length <= 13) {
    return block_chain_16(chain)
  } else {
    throw `bound chain count: '${brand}'`
  }
}

function block_state(brand, match) {
  const b = new Block
  b.store('weave', block_field('field-shard'))
  b.store('field', block_field('state'))
  b.store('brand', block_brand(brand))
  b.store('match', match)
  return b
}

function block_match(a, c) {
  const b = new Block
  b.store('weave', block_field('shard-4'))
  if (a == 'chain') {
    b.store('field', block_field('match-chain'))
  } else if (a == 'field') {
    b.store('field', block_field('match-field'))
    b.store('match-field', c)
  }
  return b
}

function block_mount(brand, mount_chain) {
  const b = build(`mount ${brand}`)

  if (arguments.length == 1) {
    return b
  }
  b.store('weave', block_field('shard-8'))
  b.store('scale', 1)
  b.store('count', 0)
  b.store('trace')
  b.store('block', block_block(brand))
  b.store('mount', block_chain(mount_chain || []))
  return b
}

function block_block(brand, state) {
  const b = build(`block ${brand}`)
  if (arguments.length == 1) {
    return b
  }
  for (let state_brand in state) {
    b.store(state_brand, state[state_brand])
  }
  return b
}

function block_shard(brand) {
  return build(`shard ${brand}`)
}

function block_cause_mount(state, build) {
  const b = new Block
  b.store('weave', block_field('shard-4'))
  b.store('field', block_field('cause-mount'))
  b.store('state', block_brand(state))
  b.store('build', build)
  return b
}

function block_sheet(sheet) {
  return
}

function build_block() {

}
