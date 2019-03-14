
const fs = require('fs')
const path = require('path')
const headerJS = fs.readFileSync(path.resolve(`${__dirname}/../driver/javascript/header.js`), 'utf-8')
const footerJS = fs.readFileSync(path.resolve(`${__dirname}/../driver/javascript/footer.js`), 'utf-8')
const writeJSBlocks = require('./writeJSBlocks')

function writeDriverSheet(sheet) {
  const arr = []
  traverseEachForce(sheet).forEach(line => {
    arr.push(`  ${line}`)
  })
  return arr.join('\n')
}

module.exports = writeDriverSheet
module.exports.writeHeader = writeHeader
module.exports.writeFooter = writeFooter

function writeHeader(buildingBlocks, str) {
  const blockStr = writeJSBlocks(buildingBlocks)
  let arr = [headerJS.replace(/\{\s*store\s*\}/, blockStr).replace(/\{\s*build\s*\}/, str)]
  return arr
}

function traverseEachForce(sheet) {
  let arr = []
  for (let brand in sheet.sheetForce) {
    const force = sheet.sheetForce[brand]
    writeForceComment(sheet.sheet, force).forEach(str => arr.push(str))
    writeForceDefinition(sheet, force).forEach(str => arr.push(str))
  }
  return arr
}

function writeForceComment(trace, force) {
  const arr = []
  arr.push('')
  arr.push('/**')
  const str = force.brand + ' ' + force.driveId
  arr.push(` * ${trace}#${str}`)
  arr.push(' */')
  return arr
}

function writeForceDefinition(build, force) {
  let arr = []
  writeForceHeader(force).forEach(str => {
    arr.push(str)
  })
  writeForceBody(build, force).forEach(str => {
    arr.push('  ' + str)
  })
  arr.push('})')
  return arr
}

function writeForceHeader(force) {
  let fields = []
  // calmvibewordhunt
  let keys = 'showlinkdrumbeat'.split('')
  force.start.forEach(mount => {
    fields.push(keys.shift())
  })
  let name = `force_${force.brand.replace(/-/g, '_')}`
  let arr = ['', `force(function ${name}(${fields.join(', ')}){`]
  // if debug
  // arr.push(`  console.log('${name}(' + Array.prototype.slice.call(arguments).join(', ') + ')')`)
  return arr
}

function writeForceBody(sheet, force) {
  let arr = []
  let keys = 'showlinkdrumbeat'.split('')
  let fields = {}
  force.start.forEach(mount => {
    fields[mount.brand] = keys.shift()
  })
  force.cause.forEach(cause => {
    writeCause(sheet, fields, keys, cause).forEach(str => arr.push(str))
  })
  return arr
}

function writeLoopCount(build, cause, fields, names) {
  const arr = []
  const input = {
    start: null,
    end: null,
    step: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`for (${input.start}; ${input.start} < ${input.end}; ${input.start}++) {`)
  arr.push(`  x[0][${input.step}](${input.start})`)
  arr.push(`}`)
  return arr
}

function writeCallUnaryFunction(build, cause, fields, names) {
  const arr = []
  const input = {
    operation: null,
    value: null
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.operation}${input.value}`)
  return arr
}

function writeInvokeConstructor(build, cause, fields, names) {
  const arr = []
  const input = {
    constructor: null,
    factor: []
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`return new ${input.constructor}(${input.factor.join(', ')})`)
  return arr
}

function writeApplyDelete(build, cause, fields, names) {
  const arr = []
  const input = {}
  buildInput(build, cause, input, fields)
  arr.push(`delete ${input.object}[${input.aspect}]`)
  return arr
}

function writeApplyDebug(build, cause, fields, names) {
  const arr = []
  const input = {}
  buildInput(build, cause, input, fields)
  arr.push(`${input.keyword}`)
  return arr
}

function writeCallKeyword(build, cause, fields, names) {
  const arr = []
  const input = {}
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.keyword} ${input.value || ''}`)
  return arr
}

function writeCallKeyword2(build, cause, fields, names) {
  const arr = []
  const input = {}
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.left} ${input.keyword} ${input.right}`)
  return arr
}

function writeCallTry(build, cause, fields, names) {
  const arr = []
  const input = {
    block: null,
    error: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`try {`)
  arr.push(`  return ${input.block}()`)
  arr.push(`} catch (e) {`)
  arr.push(`  return ${input.error}(e)`)
  arr.push(`}`)
  return arr
}

function writeApplyLoop(build, cause, fields, names) {
  const arr = []
  const input = {
    check: null,
    block: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`while (${input.check}()) {`)
  arr.push(`  ${input.block}()`)
  arr.push(`}`)
  return arr
}

function writeApplyTest(build, cause, fields, names) {
  const arr = []
  const input = {
    check: null,
    block: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`if (${input.check}()) {`)
  arr.push(`  return ${input.block}()`)
  arr.push(`}`)
  return arr
}

function writeApplyTestElse(build, cause, fields, names) {
  const arr = []
  const input = {
    check: null,
    block: null,
    else: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`if (${input.check}()) {`)
  arr.push(`  return ${input.block}()`)
  arr.push(`} else {`)
  arr.push(`  return ${input.else}()`)
  arr.push(`}`)
  return arr
}

function writeCreateLiteral(build, cause, fields, names) {
  const arr = []
  const input = {
    literal: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`return ${input.literal}`)
  return arr
}

function writeSetAspect(build, cause, fields, names) {
  const arr = []
  const input = {
    object: null,
    aspect: null,
    factor: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`${input.object}.${input.aspect} = ${input.factor}`)
  return arr
}

function writeGetAspect(build, cause, fields, names) {
  const arr = []
  const input = {
    object: null,
    aspect: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`return ${input.object}.${input.aspect}`)
  return arr
}

function writeSetDynamicAspect(build, cause, fields, names) {
  const arr = []
  const input = {
    object: null,
    aspect: null,
    factor: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`${input.object}[${input.aspect}] = ${input.factor}`)
  return arr
}

function writeGetDynamicAspect(build, cause, fields, names) {
  const arr = []
  const input = {
    object: null,
    aspect: null
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.object}[${input.aspect}]`)
  return arr
}

function writeGetVariable(build, cause, fields, names) {
  const arr = []
  const input = {
    aspect: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`return ${input.aspect}`)
  return arr
}

function writeSetVariable(build, cause, fields, names) {
  const arr = []
  const input = {
    aspect: null,
    factor: null
  }
  buildInput(build, cause, input, fields)
  arr.push(`${input.aspect} = ${input.factor}`)
  return arr
}

function writeCause(build, fields, names, cause) {
  let arr = []
  let brand = cause.force
  switch (brand) {
    case 'call-method':
      writeCallMethod(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-function':
      writeCallFunction(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-dynamic-function':
      writeCallDynamicFunction(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-binary-operation':
      writeCallBinaryFunction(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-unary-operation':
      writeCallUnaryFunction(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'invoke-constructor':
      writeInvokeConstructor(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'delete':
      writeApplyDelete(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'throw-error':
      writeThrowError(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'loop-count':
      writeLoopCount(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'debug':
      writeApplyDebug(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-keyword':
      writeCallKeyword(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-keyword-2':
      writeCallKeyword2(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'call-try':
      writeCallTry(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'loop':
      writeApplyLoop(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'test':
      writeApplyTest(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'test-else':
      writeApplyTestElse(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'create-literal':
      writeCreateLiteral(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'set-aspect':
      writeSetAspect(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'set-dynamic-aspect':
      writeSetDynamicAspect(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'get-aspect':
      writeGetAspect(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'get-dynamic-aspect':
      writeGetDynamicAspect(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'get-variable':
      writeGetVariable(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'set-variable':
      writeSetVariable(build, cause, fields, names).forEach(str => {
        arr.push(str)
      })
      break
    case 'create-variable':
      let e10 = {
        value: null
      }
      share.wheel(cause.hitch, h => {
        let key
        share.write_js_brand(h.brand).forEach(str => {
          key = str
        })
        let val
        switch (h.block.class) {
          case 'reach':
            let reach = share.write_js_brand(h.block.brand).join('')
            val = fields[reach]
            break
          case 'chord':
            val = h.block.earth
            break
          case 'count':
            val = convertDecimalToHex(h.block.earth, 4)
            break
          default:
            // console.log(h.block)
            break
        }
        e10[key] = val
      })
      let brand2 = share.write_js_brand(cause.store)
      let name = fields[brand2] = names.shift()
      const prefix12 = `const ${name} = `
      arr.push(`${prefix12}${e10.value}`)
      break
    default:
      throw `${brand} - ${build.trace}`
      break
  }
  return arr
}

function writeFooter(build) {
  let arr = [footerJS]
  return arr
}

function writeCallBinaryFunction(build, cause, fields, names) {
  const arr = []
  const input = {
    left: null,
    operation: null,
    right: null
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.left} ${input.operation} ${input.right}`)
  return arr
}

function writeCallDynamicFunction(build, cause, fields, names) {
  const arr = []
  const input = {
    object: null,
    aspect: null,
    factor: []
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.object}[${input.aspect}](${input.factor.join(', ')})`)
  return arr
}

function writeCallFunction(build, cause, fields, names) {
  const arr = []
  const input = {
    force: null,
    factor: []
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.force}(${input.factor.join(', ')})`)
  return arr
}

function writeCallMethod(build, cause, fields, names) {
  const arr = []
  const input = {
    object: null,
    method: null,
    factor: []
  }
  buildInput(build, cause, input, fields)
  const prefix = fetchPrefix(cause, fields, names)
  arr.push(`${prefix}${input.object}.${input.method}(${input.factor.join(', ')})`)
  return arr
}

function writeThrowError(build, cause, fields, names) {
  const arr = []
  const input = {
    factor: []
  }
  buildInput(build, cause, input, fields)
  arr.push(`throw ${input.factor.join(', ')}`)
  return arr
}

function fetchPrefix(cause, fields, names) {
  let prefix = ``

  if (cause.catch.build) {
    prefix = `return `
  } else if (cause.store) {
    let brand = fetchBrand(cause.store)
    let name = fields[brand] = names.shift()
    prefix = `const ${name} = `
  }

  return prefix
}

function buildInput(build, cause, input, fields) {
  cause.mount.forEach(drive => {
    const key = drive.brand
    const val = fetchValue(build, drive, fields)

    if (Array.isArray(input[key])) {
      input[key].push(val)
    } else {
      input[key] = val
    }
  })
}

function fetchValue(build, mount, fields) {
  if (mount.build) {
    switch (mount.build.field) {
      case 'write':
        return mount.build.build
      case 'count':
        return convertDecimalToHex(mount.build.build, 4)
      default:
        return fields[mount.build.trace]
    }
  } else {
    throw build.trace
  }
}

function fetchBrand(brand, prefix = '_') {
  return writeBrandComment(brand).join(prefix)
}

function writeBrandComment(verse) {
  const arr = []
  while (verse) {
    arr.push(verse.brand)
    verse = verse.verse[0]
  }
  return arr
}
