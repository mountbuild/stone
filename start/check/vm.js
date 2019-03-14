
// const trace = require('../../start/trace')

// const fs = require('fs')

// const write = fs.readFileSync('../drive/stack/javascript/binding/base/verse.xo', 'utf-8')

// const out = JSON.stringify(trace(write), null, 2)
// console.log(out)
// fs.writeFileSync('.build/out.json', out)

let i = 0
const FORCE = {
  'start': i++,
  'mount-0': i++,
  'mount-1': i++,
  'mount-2': i++,
  'mount-3': i++,
  'mount-4': i++,
  'mount-5': i++,
  'mount-6': i++,
  'mount-7': i++,
  'mount-0-shift': i++,
  'mount-1-shift': i++,
  'mount-2-shift': i++,
  'mount-3-shift': i++,
  'mount-4-shift': i++,
  'mount-5-shift': i++,
  'mount-6-shift': i++,
  'mount-7-shift': i++,
  'shift-match': i++,
  'shift-shift-match': i++,
  'shift-crest': i++,
  'shift-floor': i++,
  'shift-crest-match': i++,
  'shift-floor-match': i++,
  'shift': i++,
  'fetch-build': i++,
  'fetch-mount': i++,
  'fetch': i++,
  'store-mount-build': i++,
  'store-stack-mount-build': i++,
  'store-stick-mount-build': i++,
  'store-stack-share-mount': i++,
  'store-stick-share-mount': i++,
  'store-mount-share-build': i++,
  'store-build-share-mount': i++,
  'mount-stack': i++,
  'clear-stack': i++
}

const Stone = require('../../build/build')

const stone = new Stone
// stone.cause(FORCE['store-stack-mount-build'], 0, 23)
// stone.cause(FORCE['store-stack-mount-build'], 1, 29)
// stone.cause(FORCE['store-stack-mount-build'], 2, 31)
// stone.cause(FORCE['mount-stack'], 8)
// stone.cause(FORCE['mount-stack'], 8)
// stone.cause(FORCE['mount-stack'], 5)
// stone.cause(FORCE['store-stack-mount-build'], 2, 17)
// stone.cause(FORCE['store-stack-mount-build'], 3, 19)
// stone.cause(FORCE['store-stick-mount-build'])
// stone.cause(FORCE['store-stack-mount-build'], 0, 23)
// stone.cause(FORCE['store-stack-mount-build'], 1, 29)
// stone.cause(FORCE['store-stack-mount-build'], 2, 31)
// stone.cause(FORCE['mount-drive'], 8)
// stone.cause(FORCE['mount-drive'], 8)
// stone.cause(FORCE['mount-drive'], 8)
// stone.cause(FORCE['clear-drive'])
// stone.cause(FORCE['clear-drive'])
// stone.cause(FORCE['mount-drive'], 6)
// stone.cause(FORCE['mount-drive'], 5)
// // stone.cause(FORCE['clear-drive'])
// stone.cause(FORCE['clear-drive'])
console.log(stone.store[0])
stone.drive()
