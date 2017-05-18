'use strict';

var React = require('react')
var parseHTML = require('./lib/parse')
var hop = ({}).hasOwnProperty

var options = {
  guid: 'rel-' + Math.random().toString(16).split('.')[1] + '',
  createElement: React.createElement,
}

// This function is meant to be used as an ES6 string template tag
// rel`<div id=${foo} />` is the same as rel(['<div id=', '/>'], foo)
function rel (source, ...interpolated) {
  // First we join the pieces of the source string with our random guid:
  // [ '<div id=', ' />' ] ==> '<div id=rel-deadbeef />'
  var stringWithGuid = source.join(options.guid)
  // Then we parse it into an HTML tree
  // '<div id=rel-deadbeef />' ==> { type: 'tag', name: 'div', attribs: { id: 'rel-deadbeef' } }
  var rootNode = parseHTML(stringWithGuid)
  if (interpolated.length > 1) {
    interpolated.reverse()  // we're popping from the end for added perf
  }
  // Then we create React elements using the React.createElement function
  // and replacing our random guid with items from the string interpolation array
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
  // The text *is* the guid. just return early.
  if (string === options.guid) {
    return interpolated.pop()
  }
  // found the guid in the text, but it's not alone
  var spl = string.split(options.guid)
  var out = []
  for (var i = 0; i < spl.length; i++) {
    if (!(spl[i] == '' && (i == 0 || i == spl.length - 1))) out.push(spl[i])
    if (i < spl.length - 1) out.push(interpolated.pop())
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

  if (node.children) {
    var children = node.children
      .map(node => createReactElements(node, interpolated))
      .filter(c => c != null)
    return createAnElement(tag, props, children)
  }

  return createAnElement(tag, props)
}

function createAnElement (tag, props, children) {
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

// for testing only
rel._configure = (_options) => {
  for (var k in _options) if (hop.call(_options, k)) {
    options[k] = _options[k]
  }
}

module.exports = rel

