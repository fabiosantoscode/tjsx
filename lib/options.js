'use strict'

var React = require('react')

var options = {
  guid: 'rel-' + Math.random().toString(16).split('.')[1] + '',
  createElement: React.createElement
}

// for testing only
options._configure = (_options) => {
  for (var k in _options) {
    if (Object.prototype.hasOwnProperty.call(_options, k)) {
      options[k] = _options[k]
    }
  }
}

module.exports = options
