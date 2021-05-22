
function compileHatch(hatchSheet, brand, verse) {
  let match = hatchSheet.match[brand]
  let ctch = hatchSheet.catch[brand]
  let i = 0
  let state = { pos: 0 }
  while (match.length) {
    let m = match[i++]
    compileMatch(m, verse, state)
  }
}

function compileMatch(match, verse, state) {
  if (match.field === '@mount/start/field/hatch/match/chain') {
    // many
    while (true) {
      if (compileMatchChain(match.match, verse, state)) {

      }
    }
  } else if (match.field === '@mount/start/field/hatch/match/sieve') {
    // optional
  }
}
