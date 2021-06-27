
const trace = (chord) => {
  var place = 0
  var block = []
  var chunk = 0
  var slice = 0
  var climb = 0
  var verse = { brand: 'sheet', verse: [] }
  var backslash = false
  var start_stick = false
  var scope = 'start'
  while (place < chord.length) {
    var start = place
    var point = chord[place++]
    if (point === '\n') {
      climb++
    } else {
      slice++
    }
    if (point.match(/[^' ,\(\)\n]/)) {
      if (point === "\\") {
        if (backslash) {
          block.push(point)
          backslash = false
        } else {
          backslash = true
        }
      } else {
        block.push(point)
      }

      if (point.match(/\|/)) {
        if (backslash) {
          backslash = false
        } else {
          start_stick = !start_stick
        }
      } else if (point.match(/[:]/)) {
        if (backslash) {
          backslash = false
        }
      }

      b:
      switch (scope) {
        case 'brand':
          break
        case 'start':
          var share = Math.floor(chunk / 2)
          if (verse) {
            while (--share > -1) {
              verse = verse.verse[verse.verse.length - 1]
            }
            verse = buildParseBlock(verse, start, { climb, slice, chord })
          }
          chunk = 0
          // break a
        default:
          scope = 'brand'
          break
      }
    } else if (start_stick) {
      block.push(point)
    } else {
      a:
      switch (point) {
        case ' ':
          b:
          switch (scope) {
            case 'start':
              chunk++
              break a
            case 'brand':
              verse.brand = block.join('')
              block = []
              verse = buildParseBlock(verse, start, { climb, slice, chord })
              break a
          }
          scope = 'space'
          break
        case ',':
          verse.brand = block.join('')
          block = []
          verse = buildParseBlock(verse.crest, start, { climb, slice, chord })
          scope = 'verse'
          break a
        case '(':
          scope = 'curve start'
          verse.brand = block.join('')
          block = []
          break a
        case ')':
          scope = 'curve brake'
          break a
        case '\n':
          switch (scope) {
            case 'brand':
              verse.brand = block.join('')
              block = []
              chunk = 0
              scope = 'start'
              while (verse.crest) verse = verse.crest
              break a
          }
          chunk = 0
          scope = 'start'
          block = []
          while (verse.crest) verse = verse.crest
          break a
        default:
          block.push(point)
          break
      }
    }
  }

  switch (scope) {
    case 'brand':
      verse.brand = block.join('')
      block = []
      break
  }

  while (verse.crest) verse = verse.crest

  return verse
}

const buildParseBlock = (stack) => {
  const floor = { brand: null, verse: [] }
  Object.defineProperty(floor, 'crest', { value: stack })
  stack.verse.push(floor)
  return floor
}

module.exports = trace
