
const fs = require('fs')
const parseInitialShowString = require('./parse-initial-show-string')
const compileInitialStringGrammar = require('./compile-initial-string-grammar')
const compileInitialStringBuilder = require('./compile-initial-string-builder')
const parseShowString = require('./parse-show-string')
const compileInitialXoTreeGrammar = require('./compile-initial-xo-tree-grammar')

const start = () => {
  // initialization
  const showGrammarString = read(`../content-grammar/stack/xo`)
  const parsedShowGrammarTree = parseInitialShowString(showGrammarString)
  const compiledShowGrammar = compileInitialStringGrammar(parsedShowGrammarTree)

  const showBuilderString = read(`../content-ast-generator/stack/xo/catch`)
  const parsedShowBuilderTree = parseInitialShowString(showBuilderString)
  const compiledShowBuilder = compileInitialStringBuilder(parsedShowBuilderTree)
  console.log(compiledShowBuilder)

  // const hatchXoTreeGrammarString = read(`../xo-tree-grammar/stack/hatch`)
  // const parsedHatchXoTreeGrammarTree = parseShowString(compiledShowGrammar, hatchXoTreeGrammarString)
  // console.log(parsedHatchXoTreeGrammarTree)
  // const compiledHatchXoTreeGrammar = compileInitialXoTreeGrammar(parsedHatchXoTreeGrammarTree)
  // console.log()

  // // hatch grammars used for constructing objects
  // const fieldXoTreeString = read(`../xo-tree-grammar/stack/field`)
  // const parsedFieldXoTreeTree = parseShowString(compiledShowGrammar, fieldXoTreeString)
  // const compiledXoTreeFieldGrammar = compileXoTreeGrammar(compiledHatchXoTreeGrammar, parsedFieldXoTreeTree)

  // const forceXoTreeString = read(`../xo-tree-grammar/stack/force`)
  // const parsedForceXoTreeTree = parseShowString(compiledShowGrammar, forceXoTreeString)
  // const compiledXoTreeForceGrammar = compileXoTreeGrammar(compiledHatchXoTreeGrammar, parsedForceXoTreeTree)

  // // parse forces
  // const force1 = read(`../drive/force/chain...`)
  // const compiledForce1 = compileBuildSketch(compiledXoTreeForceGrammar, force1)
}

const read = (path) => {
  return fs.readFileSync(`${path}/verse.xo`, 'utf-8')
}

start()
