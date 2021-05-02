
module.exports = writeJSForces

function writeJSForces(sheet) {
  const arr = [`stone.mount('${sheet.sheet}', function(build){`]
  arr.push(`  const force = build.force`)
  for (const brand in sheet.sheetForce) {
    let force = sheet.sheetForce[brand]
    writeForce(force).forEach(line => {
      arr.push(`  ${line}`)
    })
  }
  arr.push('})')
  return arr.join('\n')
}

function writeForce(force) {
  const arr = []
  let alphabet = 'showlinkdrumbeat'
  let inputI = 0
  const mountMap = {}
  force.start.forEach(start => {
    mountMap[start.brand] = toRadixString(inputI++, alphabet)
  })
  const inputs = Object.values(mountMap).join(', ')
  arr.push(`force.${force.brand.replace(/\-/g, '_')} = function(${inputs}){`)
  force.cause.forEach(cause => {
    let force = `${cause.force.replace(/\-/g, '_')}`
    console.log(cause.catch && cause.catch.build)
    // let mounts = cause.mount.map(x => x.build)
    arr.push(`  ${force}()`)
  })
  arr.push('}')
  return arr
}

function parseInt(value, code) {
  return [...value].reduce((r, a) => r * code.length + code.indexOf(a), 0);
}

function toRadixString(value, code) {
  var digit,
      radix= code.length,
      result = '';

  do {
      digit = value % radix;
      result = code[digit] + result;
      value = Math.floor(value / radix);
  } while (value)

  return result;
}
