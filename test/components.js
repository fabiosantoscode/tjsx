'use strict'

var ok = require('assert')
var tjsx = require('..')
var options = require('../lib/options')

describe('components', () => {
  before(() => {
    // instrument tjsx for tests
    options._configure({
      createElement: function () { return [].slice.call(arguments) },
      guid: 'tjsx-guid'  // just for console.logs in the middle of the code to not get confusing
    })
  })
  function SomeComponent (props) {
    return tjsx`<div style=${{ fontSize: props.porp }}>foo!</div>`
  }
  function AnotherComponent (props) {
    return tjsx`
      <div onClick=${props.anotherPorp}>
        ${props.children}
      </div>
    `
  }
  it('work', () => {
    var fn = () => null
    ok.deepEqual(
      tjsx`
        <${SomeComponent} porp="1234">
          <${AnotherComponent} anotherPorp=${fn}>
            child
          </>
        </>
      `,
      [
        SomeComponent, { porp: '1234' },
        [
          AnotherComponent, { anotherPorp: fn },
          'child'
        ]
      ]
    )
  })
})
