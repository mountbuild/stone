
console.log('class:')
testClassAdd()
console.log('native:')
testNativeAdd()

function testNativeAdd() {
  let x = 1
  let y = 2
  let i = 0
  let start = new Date()
  let z = 0

  while (i < 1000000) {
    z = x + y
    i++
  }

  let end = new Date
  console.log(end - start, z)
}

function testClassAdd() {
  let x = 1
  let y = 2
  let i = 0
  class Adder {
    add(a, b) {
      return a + b
    }
  }
  const adder = new Adder
  const obj = { adder }
  let start = new Date()
  let z = 0
  let add = obj.adder.add

  while (i < 1000000) {
    z = add(x, y)
    i++
  }

  let end = new Date
  console.log(end - start, z)
}
