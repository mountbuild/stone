
const shared = require('./shared')

function buildBlocks(start) {
  const map = {}
  const front = shared.getBlock(map, -3, 1)
  front.store('trace', 20)
  const stack = shared.getBlock(map, -1, 1)
  stack.store('trace', 28)
  const stick = shared.getBlock(map, -2, 1)
  stick.store('trace', 36)
  const drive = shared.getBlock(map, -4, 1)
  drive.store('trace', 44)
  shared.getBlock(map, -5, 8) // space
  shared.getBlock(map, -6, 8) // space
  const stackFront = shared.getBlock(map, -7, 8)
  stackFront.store('scale', 8)
  stackFront.store('crest', 0)
  stackFront.store('shift', 0)
  const stickFront = shared.getBlock(map, -8, 8)
  stickFront.store('house', 0)
  stickFront.store('crest', 0)
  stickFront.store('shift', 0)
  const driveFront = shared.getBlock(map, -9, 8)
  driveFront.store('stick', stickFront)
  driveFront.store('front', 0)
  let size = nextPowerOf2(start.track.length)
  const track = shared.getBlock(map, -10, size)
  start.track.forEach((count, i) => {
    track.store(i, count)
  })
  front.reach('trace').build = track

  return Object.values(map)
}

module.exports = buildBlocks

function nextPowerOf2(n) {
    let count = 0;

    // First n in the below condition
    // is for the case where n is 0
    if (n && !(n & (n - 1)))
        return n;

    while( n != 0)
    {
        n >>= 1;
        count += 1;
    }

    return 1 << count;
}
