'use strict'

var ok = require('assert')
var rel = require('..')
var options = require('../lib/options')

describe('rel', () => {
  before(() => {
    // instrument rel for tests
    options._configure({
      createElement: (...args) => args,
      guid: 'rel-guid',  // just for console.logs in the middle of the code to not get confusing
    })
  })
  it('returns a createElement structure', () => {
    ok.deepEqual(rel`
      <div id="foo" />
    `, [ 'div', { id: 'foo' } ])
  })
  it('this structure can interpolate things', () => {
    ok.deepEqual(rel`<div>${'thing'}</div>`, [ 'div', { }, 'thing' ])
    var fn = () => null
    ok.deepEqual(rel`<div>${fn}</div>`, [ 'div', { }, fn ])
  })
  it('can interpolate attributes', () => {
    var fn = () => null
    ok.deepEqual(
      rel`<div onClick=${fn} />`,
      [ 'div', { onClick: fn } ]
    )
  })
  it('can interpolate parts of strings', () => {
    ok.deepEqual(rel`<div>${'thing'} is ${'great'}</div>`, [
      'div',
      { },
      'thing',
      ' is ',
      'great'
    ])
    ok.deepEqual(rel`<div> ${'thing'} is ${'great'} </div>`, [
      'div',
      { },
      ' ', 'thing', ' is ', 'great', ' ',
    ])
    ok.deepEqual(rel`<div> ${'thing'} is </div>`, [
      'div',
      { },
      ' ', 'thing', ' is ',
    ])
    ok.deepEqual(rel`<div> is ${'thing'} </div>`, [
      'div',
      { },
      ' is ', 'thing', ' ',
    ])
  })
  it('removes extraneous whitespace when it contains a \\n', () => {
    ok.deepEqual(rel`
      <div>
        foo
      </div>
    `, [ 'div', { }, 'foo' ])
    ok.deepEqual(rel`
      <div>
        ${'foo'}
      </div>
    `, [ 'div', { }, 'foo' ])
  })
  it('(actual examples)', () => {
    const lel = 'sloog'
    ok.deepEqual(rel`<div className="foo">
      <div className="bar baz">
        <img className="baz-avatar" src=${`/foo/${ lel }/baz-avatar`} />
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
        [ 'img', { className: 'baz-avatar', src: '/foo/sloog/baz-avatar' } ],
      ],
      [
        'div',
        { className: 'bar content' },
        [ 'h3', { className: 'title' }, 'title' ],
        [ 'span', { className: 'date' }, 'datePublishedString' ],
        [ 'div', { className: 'cta-wrapper' }, 'source' ],
      ]
    ])
  })
})
