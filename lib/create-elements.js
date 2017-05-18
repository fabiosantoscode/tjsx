'use strict'

var options = require('./options')

var hop = ({}).hasOwnProperty

module.exports = function createReactElements(node, interpolated) {
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

