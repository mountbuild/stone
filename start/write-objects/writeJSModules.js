
function writeJSModules(chain) {
  const arr = []
  chain.forEach(sheet => {
    writeSheet(sheet).forEach(x => arr.push(x))
  })
  return arr.join('\n')
}

module.exports = writeJSModules

function writeSheet(sheet) {
  let arr = [``, `stone.mount(function(){`]
  if (sheet.sheetForce) {
    writeSheetForces(sheet.sheetForce).forEach(x => arr.push(`  ${x}`))
  }
  arr.push('})')
  return arr
}

function writeSheetForces(forces) {
  let arr = []
  for (let key in forces) {
    let force = forces[key]
    let mounts = force.start.map(x => `mount_${x.brand}`)
    arr.push(`function force_${key.replace(/-/g, `_`)}(${mounts.join(`, `)}) {`)
    force.cause.forEach(cause => {
      if (!cause.force.brand) return
      let brand = 'force_' + cause.force.brand.replace(/-/g, '_')
      let mounts = cause.mount.map(x => x.build)
      arr.push(`  ${brand}(${mounts.join(`, `)})`)
    })
    arr.push(`}`)
  }
  return arr
}
