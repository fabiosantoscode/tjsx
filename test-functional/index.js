'use strict'

var ok = require('assert')
var tjsx = require('..')
var options = require('../lib/options')
var React = require('react')
var ReactDOMServer = require('react-dom/server')

describe('functional tests', () => {
  before(() => {
    options._configure({
      createElement: React.createElement
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
  it('basic test', () => {
    var fn = () => null
    ok.deepEqual(
      tjsx`
        <${SomeComponent} porp="1234">
          <${AnotherComponent} anotherPorp=${fn}>
            <span>child</span>
          </>
        </>
      `,
      <SomeComponent porp='1234'>
        <AnotherComponent anotherPorp={fn}>
          <span>child</span>
        </AnotherComponent>
      </SomeComponent>
    )
  })
  it('style', () => {
    ok.deepEqual(
      tjsx`<div style=${{ height: 10 }} />`,
      <div style={{ height: 10 }} />
    )
  })
})
