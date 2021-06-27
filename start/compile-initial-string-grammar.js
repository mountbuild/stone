const shared = require('./shared')
const fs = require('fs')
const parseInitialShowString = require('./parse-initial-show-string')

const parse = verse => {
  const result = {}
  verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'match':
        const match = parseMain(verse)
        result[match.brand] = match
        break
    }
  })
  fs.writeFileSync('build/1.json', JSON.stringify(result, null, 2))
  return result
}

const parseMain = verse => {
  const brand = shared.getBrandFromFirst(verse)
  // just parse it into complete match tree just in case.
  const trace = {
    field: 'trace',
    brand,
    start: [],
    churn: [],
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'start':
        const start = parseStart(verse)
        trace.start.push(start)
        break
      case 'match':
        const match = parseMatch(verse)
        if (Array.isArray(match)) {
          trace.churn.push(...match)
        } else {
          trace.churn.push(match)
        }
        break
      case 'shift':
        const shift = parseShift(verse)
        if (Array.isArray(shift)) {
          trace.churn.push(...shift)
        } else {
          trace.churn.push(shift)
        }
        break
    }
  })
  return trace
}

const parseShift = verse => {
  const brand = shared.getBrandFromFirst(verse)

  const trace = {
    field: `trace-churn-shift`,
    brand,
    mount: [],
    catch: []
  }

  const out = [trace]

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        trace.mount.push(mount)
        break
      case `start`:
        const start = parseStart(verse)
        trace.start.push(start)
        break
      case `store`:
        const [state, store] = parseStore(verse)
        trace.catch.push(store)
        out.unshift(state)
        break
      case `stack`:
        const [state2, stack] = parseStack(verse)
        trace.catch.push(stack)
        out.unshift(state2)
        break
    }
  })

  return out
}

const parseCatch = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  const churn = {
    field: `trace-churn-catch`,
    brand,
    start: [],
    churn: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'start':
        const start = parseStart(verse)
        churn.start.push(start)
        break
      case 'store':
        const store = parseCatchStore(verse)
        if (Array.isArray(store)) {
          churn.churn.push(...store)
        } else {
          churn.churn.push(store)
        }
        break
      case 'stack':
        const stack = parseCatchStack(verse)
        if (Array.isArray(stack)) {
          churn.churn.push(...stack)
        } else {
          churn.churn.push(stack)
        }
        break
    }
  })
  return churn
}

const parseCatchStore = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  const brand2 = shared.getBrandFromFirst(verse.verse[1])
  const shift = parseShift(parseInitialShowString(`
shift store
  mount start, share ${brand}
  mount front, share ${brand2}
`).verse[0])
  return shift
}

const parseStore = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = parseCatch(parseInitialShowString(`
catch build
  start build
  store ${brand}, share build
`).verse[0])
  const state = parseState(parseInitialShowString(`
state ${brand}
`).verse[0])
  return [state, _catch]
}

const parseState = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  const state = {
    field: 'state',
    brand
  }
  return state
}

const parseStack = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  const _catch = parseCatch(parseInitialShowString(`
catch build
  start build
  stack ${brand}, share build
`).verse[0])
  const state = parseState(parseInitialShowString(`
state ${brand}
`).verse[0])
  return [state, _catch]
}

const parseStart = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  // just parse it into complete match tree just in case.
  const start = {
    field: 'start-state',
    brand,
    fault: null
  }
  return start
}

const parseMatch = verse => {
  const brand = shared.getBrandFromFirst(verse)
  // just parse it into complete match tree just in case.
  switch (brand) {
    case `class`: return parseMatchClass(verse)
    case `chain`: return parseMatchChain(verse)
    case `sieve`: return parseMatchSieve(verse)
    case `crown`: return parseMatchCrown(verse)
    case `shift`: return parseMatchShift(verse)
    case `write`: return parseMatchWrite(verse)
    default: throw new Error(`oops: ${brand}`)
  }
}

const parseMatchWrite = verse => {
  const trace = {
    field: `trace-churn-match-write`,
    build: null
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `share`:
        trace.build = parseShare(verse)
        break
      case `write`:
        trace.build = parseWrite(verse)
        break
    }
  })

  return trace
}

const parseWrite = verse => {
  let build = shared.getPathFromFirst(verse)
  if (build.match(/^\|.*\|$/)) {
    build = build.substr(1, build.length - 2)
  }
  return {
    field: `write`,
    build
  }
}

const parseShare = verse => {
  const trace = shared.getPathFromFirst(verse)
  return {
    field: `share`,
    trace
  }
}

const parseMatchShift = verse => {
  const trace = {
    field: `trace-churn-match-shift`,
    mount: [],
    start: [],
    churn: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        trace.mount.push(mount)
        break
      case `start`:
        const start = parseStart(verse)
        trace.start.push(start)
        break
      case `match`:
        const match = parseMatch(verse)
        trace.churn.push(match)
        break
    }
  })

  return trace
}

const parseMatchCrown = verse => {
  const trace = {
    field: `trace-churn-match-crown`,
    mount: [],
    start: [],
    churn: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        trace.mount.push(mount)
        break
      case `start`:
        const start = parseStart(verse)
        trace.start.push(start)
        break
      case `match`:
        const match = parseMatch(verse)
        trace.churn.push(match)
        break
    }
  })

  return trace
}

const parseMatchSieve = verse => {
  const trace = {
    field: `trace-churn-match-sieve`,
    mount: [],
    start: [],
    churn: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        trace.mount.push(mount)
        break
      case `start`:
        const start = parseStart(verse)
        trace.start.push(start)
        break
      case `match`:
        const match = parseMatch(verse)
        trace.churn.push(match)
        break
    }
  })

  return trace
}

const parseMatchClass = verse => {
  const trace = {
    field: `trace-churn-match-class`,
    mount: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `class`:
        trace.class = shared.getBrandFromFirst(verse)
        break
      case `mount`:
        const mount = parseMount(verse)
        trace.mount.push(mount)
        break
    }
  })

  return trace
}

const parseMatchChain = verse => {
  const trace = {
    field: `trace-churn-match-chain`,
    mount: [],
    start: [],
    churn: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        trace.mount.push(mount)
        break
      case `start`:
        const start = parseStart(verse)
        trace.start.push(start)
        break
      case `match`:
        const match = parseMatch(verse)
        trace.churn.push(match)
        break
    }
  })

  return trace
}

const parseMount = verse => {
  const start = shared.getBrandFromFirst(verse)
  const front = shared.parseBuild(verse.verse[1])
  const mount = {
    field: `mount`,
    start,
    front
  }
  return mount
}

module.exports = parse
