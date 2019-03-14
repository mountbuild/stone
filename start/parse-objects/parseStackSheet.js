
const shared = require('../shared')
const path = require('path')

function parseStack(stack) {
  stack.verse.verse.forEach(verse => {
    switch (verse.brand) {
      case 'stack':
        parseStack_stack(stack, verse)
        break
    }
  })
}

function parseStack_stack(sheet, verse) {
  const name = shared.getBrand(verse)
  const stack = {
    path: path.resolve(path.dirname(sheet.trace)),
    name,
    title: null,
    tags: [],
    authors: [],
    image: null,
    readme: null,
    match: [],
    mount: [],
    license: null
  }
  sheet.stack = stack
  verse.verse.slice(1).forEach(verse => {
    switch (verse.brand) {
      case 'brief':
        parseStack_stack_brief(sheet, stack, verse)
        break
      case 'brand':
        parseStack_stack_brand(sheet, stack, verse)
        break
      case 'brand':
        parseStack_stack_brand(sheet, stack, verse)
        break
      case 'brand':
        parseStack_stack_brand(sheet, stack, verse)
        break
      case 'trace':
        parseStack_stack_trace(sheet, stack, verse)
        break
      case 'flash':
        parseStack_stack_flash(sheet, stack, verse)
        break
      case 'match':
        parseStack_stack_match(sheet, stack, verse)
        break
      case 'mount':
        parseStack_stack_mount(sheet, stack, verse)
        break
      case 'draft':
        parseStack_stack_draft(sheet, stack, verse)
        break
      case 'share':
        parseStack_stack_share(sheet, stack, verse)
        break
    }
  })
}

function parseStack_stack_brief(sheet, stack, verse) {
  const string = shared.getStringFromFirst(verse)
  stack.title = string
}

function parseStack_stack_brand(sheet, stack, verse) {
  const tag = shared.getStringFromFirst(verse)
  stack.tags.push(tag)
}

function parseStack_stack_trace(sheet, stack, verse) {
  const author = shared.getStringFromFirst(verse)
  stack.authors.push(author)
}

function parseStack_stack_flash(sheet, stack, verse) {
  const image = path.resolve(path.join(stack.path, shared.getPathFromFirst(verse)))
  stack.image = image
}

function parseStack_stack_match(sheet, stack, verse) {
  let match = path.resolve(path.join(stack.path, shared.getPathFromFirst(verse)))
  if (!match.match(/\.xo$/)) match = `${match}/verse.xo`
  stack.match.push(match)
}

function parseStack_stack_mount(sheet, stack, verse) {
  let v = path.resolve(path.join(stack.path, shared.getPathFromFirst(verse)))
  if (!v.match(/\.xo$/)) v = `${v}/verse.xo`
  stack.mount.push(v)
}

function parseStack_stack_draft(sheet, stack, verse) {
  let readme = path.resolve(path.join(stack.path, shared.getPathFromFirst(verse)))
  if (!readme.match(/\.xo$/)) readme = `${readme}/verse.xo`
  stack.readme = readme
}

function parseStack_stack_share(sheet, stack, verse) {
  const share = shared.getStringFromFirst(verse)
  stack.license = share
}

module.exports = parseStack
