
const parseInitialShowString = require('./parse-initial-show-string')
const shared = require('./shared')

const parse = (verse) => {
  const result = {}
  verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'weave':
        const _weave = parseMain(verse)
        result[_weave.brand] = _weave
        break
    }
  })
  return result
}

module.exports = parse

const parseMain = verse => {
  const brand = shared.getBrandFromFirst(verse)
  // just parse it into complete match tree just in case.
  const churn = {
    field: 'weave-churn',
    brand,
    start: [],
    churn: [],
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'start':
        const start = parseStart(verse)
        churn.start.push(start)
        break
      case 'state':
        const state = parseState(verse)
        churn.churn.push(state)
        break
      case 'weave':
        const child = parseWeave(verse)
        churn.churn.push(child)
        break
      case 'shift':
        const shift = parseShift(verse)
        churn.churn.push(shift)
        break
      case 'build':
        const build = parseBuild(verse)
        churn.churn.push(build)
        break
    }
  })
  return churn
}

const parseShift = verse => {
  const brand = shared.getBrandFromFirst(verse)

  const churn = {
    field: `weave-churn-shift`,
    brand,
    mount: [],
    catch: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        churn.mount.push(mount)
        break
      case `catch`:
        const start = parseCatch(verse)
        churn.catch.push(start)
        break
      case `store`:
        const store = parseStore(verse)
        churn.catch.push(store)
        break
      case `stack`:
        const stack = parseStack(verse)
        churn.catch.push(stack)
        break
      case `blend`:
        const blend = parseBlend(verse)
        churn.catch.push(blend)
        break
    }
  })

  return churn
}

const parseBuild = verse => {
  const brand = shared.getBrandFromFirst(verse)

  const churn = {
    field: `weave-churn-build`,
    brand,
    mount: [],
    churn: []
  }

  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case `mount`:
        const mount = parseMount(verse)
        churn.mount.push(mount)
        break
      case `store`:
        const store = parseStore(verse)
        churn.catch.push(store)
        break
      case `stack`:
        const stack = parseStack(verse)
        churn.catch.push(stack)
        break
      case `blend`:
        const blend = parseBlend(verse)
        churn.catch.push(blend)
        break
      case `leave`:
        const leave = parseBuildLeave(verse)
        churn.churn.push(leave)
        break
    }
  })

  return churn
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

const parseWeave = verse => {
  const brand = shared.getBrandFromFirst(verse)
  const churn = {
    field: 'weave-churn-weave',
    brand,
    mount: [],
    class: undefined,
    churn: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'mount':
        const mount = parseMount(verse)
        churn.mount.push(mount)
        break
      case 'class':
        churn.class = parseClass(verse)
        break
      case 'store':
        const store = parseWeaveStore(verse)
        if (Array.isArray(store)) {
          churn.churn.push(...store)
        } else {
          churn.churn.push(store)
        }
        break
      case 'stack':
        const stack = parseWeaveStack(verse)
        if (Array.isArray(stack)) {
          churn.churn.push(...stack)
        } else {
          churn.churn.push(stack)
        }
        break
      case 'blend':
        const blend = parseWeaveBlend(verse)
        if (Array.isArray(blend)) {
          churn.churn.push(...blend)
        } else {
          churn.churn.push(blend)
        }
        break
    }
  })
  return churn
}

const parseClass = (verse) => {
  return shared.getBrandFromFirst(verse)
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
    field: 'weave-churn-state',
    brand
  }
  return state
}

const parseCatch = (verse) => {
  const brand = shared.getBrandFromFirst(verse)
  const churn = {
    field: `weave-churn-catch`,
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
      case 'blend':
        const blend = parseCatchBlend(verse)
        if (Array.isArray(blend)) {
          churn.churn.push(...blend)
        } else {
          churn.churn.push(blend)
        }
        break
    }
  })
  return churn
}

const parseWeaveStore = (verse) => {

}

const parseWeaveStack = (verse) => {
  return [
    {
      field: 'weave-churn-stack',
      trace: shared.getBrandFromFirst(verse)
    }
  ]
}

const parseWeaveBlend = (verse) => {

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

const parseBuildLeave = (verse) => {
  const churn = {
    field: `weave-churn-leave`,
    brand: shared.getBrandFromFirst(verse)
  }

  return churn
}
