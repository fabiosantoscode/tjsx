'use strict';

var assert = require('assert')
var rel = require('..')

describe('rel', () => {
  before(() => {
    // instrument rel for tests
    rel._configure({
      createElement: function () { return [].slice.call(arguments) },
      guid: 'rel-guid',  // just for console.logs in the middle of the code to not get confusing
    })
  })
  it('returns a createElement structure', () => {
    assert.deepEqual(rel`
      <div id="foo" />
    `, [ 'div', { id: 'foo' } ])
  })
  it('this structure can interpolate things', () => {
    assert.deepEqual(rel`<div>${'thing'}</div>`, [ 'div', { }, 'thing' ])
    var fn = () => null
    assert.deepEqual(rel`<div>${fn}</div>`, [ 'div', { }, fn ])
  })
  it('can interpolate parts of strings', () => {
    assert.deepEqual(rel`<div>${'thing'} is ${'great'}</div>`, [
      'div',
      { },
      'thing',
      ' is ',
      'great'
    ])
    assert.deepEqual(rel`<div> ${'thing'} is ${'great'} </div>`, [
      'div',
      { },
      ' ',
      'thing',
      ' is ',
      'great',
      ' ',
    ])
    assert.deepEqual(rel`<div> ${'thing'} is </div>`, [
      'div',
      { },
      ' ',
      'thing',
      ' is ',
    ])
    assert.deepEqual(rel`<div> is ${'thing'} </div>`, [
      'div',
      { },
      ' is ',
      'thing',
      ' ',
    ])
  })
  it('(actual examples)', () => {
    const lel = 'sloog'
    assert.deepEqual(rel`<div className="foo">
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
  it('crashes with invalid stuff', () => {
    const bar = 6, baz = 8
    console.log(rel`<div foo="${bar} ${baz}"></div>`)
    assert.throws(() => rel`<div foo="${bar} ${baz}"></div>`)
  })
})
