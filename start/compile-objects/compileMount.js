
function compileMount(drives, mounts) {
  const mountMap = {
    drive: {},
    start: {},
    driveId: 1
  }
  drives.forEach(drive => {
    Object.values(drive.sheetForce).forEach(force => {
      mountMap.drive[force.id] = force
      force.driveId = mountMap.driveId++
    })
  })

  mounts.forEach(mount => {
    compileOneMount(mountMap, mount)
  })

  return mountMap
}

module.exports = compileMount

function compileOneMount(mountMap, sheet) {
  sheet.sheetMount.forEach(mount => {
    const start = sheet.houseForce[mount.start]
    const front = sheet.houseForce[mount.front]
    mountMap.start[start.id] = front
    mountMap.drive[front.id] = front
    front.driveId = front.driveId || mountMap.driveId++
    start.driveId = front.driveId
  })
}
