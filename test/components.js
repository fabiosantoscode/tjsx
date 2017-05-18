'use strict'

var ok = require('assert')
var rel = require('..')
var options = require('../lib/options')

describe('components', () => {
  before(() => {
    // instrument rel for tests
    options._configure({
      createElement: (...args) => args,
      guid: 'rel-guid',  // just for console.logs in the middle of the code to not get confusing
    })
  })
  function SomeComponent (props) {
    return rel`<div style=${{ fontSize: props.porp }}>foo!</div>`
  }
  function AnotherComponent (props) {
    return rel`
      <div onClick=${props.anotherPorp}>
        ${props.children}
      </div>
    `
  }
  it('work', () => {
    var fn = () => null
    ok.deepEqual(
      rel`
        <${SomeComponent} porp="1234">
          <${AnotherComponent} anotherPorp=${fn}>
            child
          </>
        </>
      `,
      [
        SomeComponent, { porp: "1234" },
        [
          AnotherComponent, { anotherPorp: fn },
          'child'
        ]
      ]
    )
  })
})

