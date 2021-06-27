
const parse = (showGrammar, string) => {
  // parse into a tree the show text from using the show grammar
  const start = showGrammar['xo']
  const state = { pos: 0 }
  const result = []
  for (let i = 0, n = start.churn.length; i < n; i++) {
    let churn = start.churn[i]
    switch (churn.field) {
      case 'trace-churn-chain':
        parseChain(showGrammar, churn, result, string, state)
        break
    }
  }
}

module.exports = parse

const parseChain = (grammar, churn, result, string, state) => {
  const out = []
  let start
  let front
  churn.mount.forEach(mount => {
    if (mount.brand === 'start') {
      start = mount.build
    } else if (mount.brand === 'front') {
      front = mount.build
    }
  })

  for (let i = 0, n = churn.churn.length; i < n; i++) {
    let child = start.churn[i]
    switch (child.field) {
      case 'trace-churn-crown':
        const value = parseCrown(grammar, child, string, state)
        break
    }
  }
}

const parseCrown = (grammar, churn, result, string, state) => {

}
