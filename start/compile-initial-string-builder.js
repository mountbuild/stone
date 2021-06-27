
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
      case 'weave':
        const child = parseWeave(verse)
        churn.churn.push(child)
        break
      case 'check':
        const check = parseCheck(verse)
        churn.churn.push(check)
        break
      case 'shift':
        const shift = parseShift(verse)
        churn.churn.push(shift)
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
    class: null,
    catch: []
  }
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'mount':

        break
      case 'class':

        break
      case 'store':

        break
      case 'stack':

        break
    }
  })
}
