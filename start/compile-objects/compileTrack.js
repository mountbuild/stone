
let TRACK_ID = 1

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

function compileTrack(chain, forceMap, forceHouses) {
  const track = []
  chain.forEach(sheet => {
    // if (sheet.trace.match('\/drive\/')) return
    if (sheet.sheetCheck) {
      sheet.sheetCheck.forEach(check => {
        track.push(...processCheck(forceHouses, forceMap, sheet, check))
      })
    }
  })
  return track
}

module.exports = compileTrack

function processCheck(forceHouses, forceMap, sheet, check) {
  let track = []
  let house = forceHouses[check.id]
  track.push(FORCE[`mount-1`])
  track.push(5)
  track.push(FORCE[`mount-stack`] + 1)
  track.push(0)
  track.push(16)
  check.cause.forEach(cause => {
    track.push(...compileCause(forceHouses, house, forceMap, cause))
  })
  return track
}

function compileCauseWithReturnValue(forceHouses, house, forceMap, cause) {
  const track2 = []
  const build = cause.catch.build[0]
  let buildHouse = { count: house.count, state: { ...house.state } }
  build.start.forEach(start => {
    buildHouse.state[start.brand] = buildHouse.state.hasOwnProperty(start.brand)
      ? buildHouse.state[start.brand]
      : buildHouse.count++
  })
  build.cause.forEach(cause => {
    if (cause.force == 'store') {
      let to = buildHouse.state[cause.mount[0].build.trace]
      let from = buildHouse.state[cause.mount[1].build.trace]
      track2.push(4, to)
    }
  })
  const track = []
  track.push(FORCE[`mount-${cause.mount.length}-shift`])
  track.push(3 + (cause.mount.length * 2) + track2.length)
  track.push(cause.force.driveId + 40)
  cause.mount.forEach(mount => {
    if (mount.build.hasOwnProperty('build')) {
      track.push(0)
      track.push(mount.build.build)
    } else {
      let trace = mount.build.trace
      track.push(3)
      track.push(trace)
    }
  })
  track.push(...track2)
  return track
}

function compileCauseWithoutReturnValue(forceHouses, house, forceMap, cause) {
  const track = []
  let mounts = []
  cause.mount.forEach(mount => {
    if (mount.build.hasOwnProperty('build')) {
      if (typeof mount.build.build == 'string') {
        const chunks = chunkArray(mount.build.build.split('').map(x => x.charCodeAt(0)), 4)
        track.push(40) // specific method
        track.push(3 + chunks.length)
        track.push(chunks.length)
        track.push(...chunks)
        // store it in a specific spot
      } else {
        mounts.push(0)
        mounts.push(mount.build.build)
      }
    } else {
      mounts.push(3)
      let trace = mount.build.trace
      mounts.push(trace)
    }
  })
  track.push(FORCE[`mount-${cause.mount.length}`])
  track.push(3 + (cause.mount.length * 2))
  track.push(cause.force.driveId + 40)
  track.push(...mounts)
  return track
}

function causeHasReturnValue(cause) {
  if (cause.catch.build && cause.catch.build[0]) {
    let build = cause.catch.build[0]
    return true
  } else {
    return false
  }
}

function compileCause(forceHouses, house, forceMap, cause) {
  if (forceMap.start[cause.force.id]) {
    if (causeHasReturnValue(cause)) {
      return compileCauseWithReturnValue(forceHouses, house, forceMap, cause)
    } else {
      return compileCauseWithoutReturnValue(forceHouses, house, forceMap, cause)
    }
  } else if (forceMap.start[cause.force.id]) {

  } else if (forceMap.stick[cause.force.id]) {
    const { force } = cause
    const track = trackMap[cause.force.id] = []

  } else if (forceMap.stack[cause.force.id]) {

  } else {
    throw 'weird'
  }
}

function compileTrackForUsage(forceMap, world, sheet, cause) {
  let keychain = [`start`]
  Object.keys(cause.catch || {}).sort().forEach(key => {
    keychain.push(key)
  })
  let key = keychain.join(':')
  let map = world.force[cause.force.id]
  if (map[key]) return map[key]
  let track = map[key] = []
}

function nextPowerOfTwo (n) {
  if (n === 0) return 1
  n--
  n |= n >> 1
  n |= n >> 2
  n |= n >> 4
  n |= n >> 8
  n |= n >> 16
  return n+1
}

function pow2floor(v) {
  var p = 1;
  while (v >>= 1) {
    p <<= 1;
  }
  return p;
}

function pow2ceil(v) {
  var p = 2;
  while (v >>= 1) {
    p <<= 1;
  }
  return p;
}

longToByteArray = function(/*long*/long) {
  // we want to represent the input as a 8-bytes array
  var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

  for ( var index = 0; index < byteArray.length; index ++ ) {
      var byte = long & 0xff;
      byteArray [ index ] = byte;
      long = (long - byte) / 256 ;
  }

  return byteArray;
};

byteArrayToLong = function(/*byte[]*/byteArray) {
  var value = 0;
  for ( var i = byteArray.length - 1; i >= 0; i--) {
      value = (value * 256) + byteArray[i];
  }

  return value;
};
function chunkArray(arr, len) {
  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}
