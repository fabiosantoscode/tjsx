'use strict';

var React = require('react')
var parseHTML = require('./parse')
var createReactElements = require('./create-elements')
var options = require('./options')

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

module.exports = rel

