
function compileCloud(cloud, chain, track) {
  let startNode
  chain.forEach(sheet => {
    if (sheet.trace.match(/node\/verse.xo/)) {
      startNode = sheet
      sheet.cloud = cloud
      cloud.shard = startNode.houseField['shard-32-6']
      cloud.field = startNode.houseField.cloud
      for (let key in cloud.house) {
        let house = cloud.house[key]
        house.shard = startNode.houseField['shard-32-6']
        house.field = startNode.houseField.house
        for (let stackKey in house.stack) {
          let stack = house.stack[stackKey]
          stack.shard = startNode.houseField['shard-32-6']
          stack.field = startNode.houseField.stack
        }
      }
      sheet.track = track
    }
  })
  return startNode
}

module.exports = compileCloud
