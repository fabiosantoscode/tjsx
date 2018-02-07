'use strict'

var parseHTML = require('./parse')
var createReactElements = require('./create-elements')
var options = require('./options')

// This function is meant to be used as an ES6 string template tag
// tjsx`<div id=${foo} />` is the same as tjsx(['<div id=', '/>'], foo)
function tjsx (source) {
  const interpolated = [].slice.call(arguments, 1)
  // First we join the pieces of the source string with our random guid:
  // [ '<div id=', ' />' ] ==> '<div id=tjsx-deadbeef />'
  var stringWithGuid = source.join(options.guid)
    // to enable SGML-like syntax, we need to turn '</>' into `<close-${guid}>`
    // htmlparser2 takes that as a closing tag for whatever is going on
    .replace(/<\/>/g, '</close-' + options.guid + '>')
  // Then we parse it into an HTML tree
  // '<div id=tjsx-deadbeef />' ==> { type: 'tag', name: 'div', attribs: { id: 'tjsx-deadbeef' } }
  var rootNode = parseHTML(stringWithGuid)
  if (interpolated.length > 1) {
    interpolated.reverse()  // we're popping from the end for added perf
  }
  // Then we create React elements using the React.createElement function
  // and replacing our random guid with items from the string interpolation array
  return createReactElements(rootNode, interpolated)
}

module.exports = tjsx
