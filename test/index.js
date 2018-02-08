'use strict'

var ok = require('assert')
var tjsx = require('..')
var options = require('../lib/options')

describe('tjsx', () => {
  before(() => {
    // instrument tjsx for tests
    options._configure({
      createElement: function () { return [].slice.call(arguments) },
      guid: 'tjsx-guid'  // just for console.logs in the middle of the code to not get confusing
    })
  })
  it('returns a createElement structure', () => {
    ok.deepEqual(tjsx`
      <div id="foo" />
    `, [ 'div', { id: 'foo' } ])
  })
  it('this structure can interpolate things', () => {
    ok.deepEqual(tjsx`<div>${'thing'}</div>`, [ 'div', { }, 'thing' ])
    var fn = () => null
    ok.deepEqual(tjsx`<div>${fn}</div>`, [ 'div', { }, fn ])
  })
  it('can interpolate attributes', () => {
    var fn = () => null
    ok.deepEqual(
      tjsx`<div onClick=${fn} />`,
      [ 'div', { onClick: fn } ]
    )
  })
  it('can interpolate parts of strings', () => {
    ok.deepEqual(tjsx`<div>${'thing'} is ${'great'}</div>`, [
      'div',
      { },
      'thing', ' is ', 'great'
    ])
    ok.deepEqual(tjsx`<div> ${'thing'} is ${'great'} </div>`, [
      'div',
      { },
      ' ', 'thing', ' is ', 'great', ' '
    ])
    ok.deepEqual(tjsx`<div> ${'thing'} is </div>`, [
      'div',
      { },
      ' ', 'thing', ' is '
    ])
    ok.deepEqual(tjsx`<div> is ${'thing'} </div>`, [
      'div',
      { },
      ' is ', 'thing', ' '
    ])
  })
  it('supports children arrays', () => {
    const children = [
      'foo',
      'bar'
    ]
    ok.deepEqual(
      tjsx`<div>${children}</div>`,
      [
        'div',
        { },
        children
      ]
    )
  })
  it('removes extraneous whitespace when it contains a \\n', () => {
    ok.deepEqual(tjsx`
      <div>
        foo
      </div>
    `, [ 'div', { }, 'foo' ])
    ok.deepEqual(tjsx`
      <div>
        ${'foo'}
      </div>
    `, [ 'div', { }, 'foo' ])
  })
  it('basic validations', () => {
    ok.throws(() => { tjsx`foo` })
    ok.throws(() => { tjsx`` })
    ok.throws(() => { tjsx` <div /> <div /> ` })
  })
  it('(actual examples)', () => {
    const lel = 'sloog'
    ok.deepEqual(tjsx`<div className="foo">
      <div className="bar baz">
        <img className="baz-avatar" src=${`/foo/${lel}/baz-avatar`} />
      </div>
      <div className="bar content">
        <h3 className="title">${'title'}</h3>
        <span className="date">${'datePublishedString'}</span>
        <div className="cta-wrapper">
          ${'source'}
        </div>
      </div>
    </div>
    `, [
      'div',
      { className: 'foo' },
      [
        'div',
        { className: 'bar baz' },
        [ 'img', { className: 'baz-avatar', src: '/foo/sloog/baz-avatar' } ]
      ],
      [
        'div',
        { className: 'bar content' },
        [ 'h3', { className: 'title' }, 'title' ],
        [ 'span', { className: 'date' }, 'datePublishedString' ],
        [ 'div', { className: 'cta-wrapper' }, 'source' ]
      ]
    ])
  })
})
