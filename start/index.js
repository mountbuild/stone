
const fs = require('fs')
const parseInitialShowString = require('./parse-initial-show-string')
const compileInitialStringGrammar = require('./compile-initial-string-grammar')
const compileInitialStringBuilder = require('./compile-initial-string-builder')
const parseShowString = require('./parse-show-string')
const compileInitialHatchGrammar = require('./compile-initial-hatch-grammar')

const start = () => {
  // initialization
  const showGrammarString = read(`../content-grammar/stack/xo`)
  const parsedShowGrammarTree = parseInitialShowString(showGrammarString)
  const compiledShowGrammar = compileInitialStringGrammar(parsedShowGrammarTree)

  const showBuilderString = read(`../content-ast-generator/stack/xo/catch`)
  const parsedShowBuilderTree = parseInitialShowString(showBuilderString)
  const compiledShowBuilder = compileInitialStringBuilder(parsedShowBuilderTree)
  console.log(compiledShowBuilder)

  // const hatchHatchGrammarString = read(`../xo-tree-grammar/stack/hatch`)
  // const parsedHatchHatchGrammarTree = parseShowString(compiledShowGrammar, hatchHatchGrammarString)
  // console.log(parsedHatchHatchGrammarTree)
  // const compiledHatchHatchGrammar = compileInitialHatchGrammar(parsedHatchHatchGrammarTree)
  // console.log()

  // // hatch grammars used for constructing objects
  // const fieldHatchString = read(`../xo-tree-grammar/stack/field`)
  // const parsedFieldHatchTree = parseShowString(compiledShowGrammar, fieldHatchString)
  // const compiledHatchFieldGrammar = compileHatchGrammar(compiledHatchHatchGrammar, parsedFieldHatchTree)

  // const forceHatchString = read(`../xo-tree-grammar/stack/force`)
  // const parsedForceHatchTree = parseShowString(compiledShowGrammar, forceHatchString)
  // const compiledHatchForceGrammar = compileHatchGrammar(compiledHatchHatchGrammar, parsedForceHatchTree)

  // // parse forces
  // const force1 = read(`../drive/force/chain...`)
  // const compiledForce1 = compileBuildSketch(compiledHatchForceGrammar, force1)
}

const read = (path) => {
  return fs.readFileSync(`${path}/verse.xo`, 'utf-8')
}

start()
