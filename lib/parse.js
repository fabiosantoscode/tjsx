'use strict'

var assert = require('assert')
var htmlparser2 = require('htmlparser2')

module.exports = function parseHTML (source) {
  var handler = new htmlparser2.DomHandler()
  var parser = new htmlparser2.Parser(handler, { lowerCaseTags: false, lowerCaseAttributeNames: false, xmlMode: true })
  parser.write(source)
  parser.done()
  trimWhitespace(handler.dom)
  if (handler.dom.length === 0) {
    assert(false, 'rel: no DOM elements returned!')
  }
  assert.equal(handler.dom[0].type, 'tag',
    'rel: you need to pass HTML elements into rel`...`!'
  )
  assert.equal(handler.dom.length, 1,
    'rel: like with JSX, you can only create a single element. Try returning an array of rel`...` strings instead!')
  return handler.dom[0]
}

function trimWhitespace (tree) {
  for (var i = 0; i < tree.length; i++) {
    if (tree[i].type === 'text' && tree[i].data.trim() === '') {
      tree.splice(i, 1)
      i--
    }
  }
}

