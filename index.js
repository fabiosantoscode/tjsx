'use strict';

var assert = require('assert')
var htmlparser2 = require('htmlparser2')
var React = require('react')
var hop = ({}).hasOwnProperty

var options = {
  guid: 'rel-' + Math.random().toString(16).split('.')[1] + '',
  createElement: React.createElement,
}

function parseHTML (source) {
  var handler = new htmlparser2.DomHandler()
  var parser = new htmlparser2.Parser(handler, { lowerCaseTags: false, lowerCaseAttributeNames: false })
  parser.write(source)
  parser.done()
  trimWhitespace(handler.dom)
  assert.equal(handler.dom.length, 1,
    'rel: like with JSX, you can only create a single element. Try returning an array of rel`...` strings instead!')
  return handler.dom[0]
}

function rel (source, ...interpolated) {
  var rootNode = parseHTML(source.join(options.guid))
  if (interpolated.length > 1) {
    interpolated.reverse()  // we're popping from the end for added perf
  }
  return createReactElements(rootNode, interpolated)
}

function children(ary) {
  ary.isChildren = true
  return ary
}

function interpolateString(string, interpolated, arrayMode) {
  var foundGuid = string.indexOf(options.guid)
  if (foundGuid === -1) {
    return string
  }
  if (string === options.guid) {
    return interpolated.pop()
  }
  // found the guid in the text, but it's not alone
  var spl = string.split(options.guid)
  var out = []
  for (var i = 0; i < spl.length; i++) {
    if (!(spl[i] == '' && (i == 0 || i == spl.length - 1))) out.push(spl[i])
    if (i < spl.length - 1)
    out.push(interpolated.pop())
  }
  if (arrayMode === 'none') {
    return out.join('')
  }
  if (arrayMode === 'children') {
    return children(out)
  }
  throw new Error('interpolateString: unknown arrayMode ' + arrayMode)
}

function createReactElements(node, interpolated) {
  if (node.type === 'text') {
    return cleanWhitespace(interpolateString(node.data, interpolated, 'children'))
  }
  if (node.type !== 'tag') {
    throw new Error('unknown node type ' + node.type)
  }
  var tag = node.name
  var props = node.attribs
  for (var k in node.attribs) if (hop.call(node.attribs, k)) {
    node.attribs[k] = interpolateString(node.attribs[k], interpolated, 'none')
  }
  var children = node.children
    ? node.children.map(node => createReactElements(node, interpolated)).filter(c => c != null)
    : undefined
  if (children && children.length === 1 && children[0] === undefined) {
    return options.createElement(tag, props)
  }
  if (children && children.length === 1 && children[0].isChildren) {
    return options.createElement(tag, props, ...children[0])
  }
  return options.createElement(tag, props, ...children)
}

function cleanWhitespace(str) {
  if (str && str.isChildren) {
    return stripDecorativeWhitespace(str)
  }
  if (typeof str !== 'string') {
    return str
  }
  return str.trim() || undefined
}

function stripDecorativeWhitespace(str) {
  str = str.filter(item => !(item.trim() == '' && item.indexOf('\n') != -1))
  return children(str)
}

function trimWhitespace(tree) {
  for (var i = 0; i < tree.length; i++) {
    if (tree[i].type === 'text' && tree[i].data.trim() === '') {
      tree.splice(i, 1)
      i--
    }
  }
}

// for testing only
rel._configure = (_options) => {
  for (var k in _options) if (hop.call(_options, k)) {
    options[k] = _options[k]
  }
}

module.exports = rel

