/* global describe it expect beforeEach */
const jsonuri = require('../../src/index.js')
function s (json) {
  return JSON.stringify(json)
}

describe('jsonuri.set', () => {
  let obj
  beforeEach(() => {
    obj = {}
  })
  it('set string', () => {
    jsonuri.set(obj, '/a', '10')
    expect(obj).toEqual({a: '10'})
  })
  // ============
  it('set root path', () => {
    jsonuri.set(obj, '', {root: 1})
    expect(obj).toEqual(obj)
  })

  it('set root path 2', () => {
    jsonuri.set(obj, '/', {root: 1})
    expect(obj).toEqual(obj)
  })
  // ============
  it('set object', () => {
    jsonuri.set(obj, '/a/b/c', {foo: 'bar', bar: 'baz'})
    expect(obj).toEqual({a: {b: {c: {bar: 'baz', foo: 'bar'}}}})
  })

  it('set object 2', () => {
    jsonuri.set(obj, '/a/b/c/', {foo: 'bar', bar: 'baz'})
    expect(obj).toEqual({a: {b: {c: {bar: 'baz', foo: 'bar'}}}})
  })

  it('set object 3', () => {
    jsonuri.set(obj, 'a/b/c', {foo: 'bar', bar: 'baz'})
    expect(obj).toEqual({a: {b: {c: {bar: 'baz', foo: 'bar'}}}})
  })

  it('set object 4', () => {
    jsonuri.set(obj, 'a/b/c/', {foo: 'bar', bar: 'baz'})
    expect(obj).toEqual({a: {b: {c: {bar: 'baz', foo: 'bar'}}}})
  })

  it('set object 5', () => {
    jsonuri.set(obj, '/a', {foo: 'bar', bar: 'baz'})
    expect(obj).toEqual({a: {bar: 'baz', foo: 'bar'}})
  })

  it('set array', () => {
    jsonuri.set(obj, '/a/b/5', 10) // if the parent is not defined, jsonuri.set number-path will be a object key
    expect(s(obj)).not.toEqual(s({a: {b: [undefined, undefined, undefined, undefined, undefined, 10]}}))
    expect(s(obj)).toEqual(s({a: { b: {'5': 10} }}))
  })

  it('set array 2', () => {
    jsonuri.set(obj, '/a/b/5/../', [])
    jsonuri.set(obj, '/a/b/5', 10)
    expect(s(obj)).toEqual(s({a: {b: [undefined, undefined, undefined, undefined, undefined, 10]}}))
    expect(s(obj)).not.toEqual(s({a: { b: {'5': 10} }}))
  })
  // =============
  it('set array error path', () => {
    global.console.error = () => {
    }
    jsonuri.set(obj, '/a/b/-1', 10)
    expect(s(obj)).toEqual(s({a: {b: {'-1': 10}}}))
  })

  it('set array error path 2', () => {
    jsonuri.set(obj, '/a/b', [])
    jsonuri.set(obj, '/a/b/-1', 10)
    expect(s(obj)).toEqual(s({a: {b: []}}))
  })
  // =============
  it('set array length', () => {
    jsonuri.set(obj, '/a', [])
    jsonuri.set(obj, '/a/length', 3)
    expect(s(obj)).toEqual(s({a: [undefined, undefined, undefined]}))
  })

  it('set array length 2', () => {
    jsonuri.set(obj, '/a', [1, 2, 3])
    jsonuri.set(obj, '/a/length', 3)
    expect(s(obj)).toEqual(s({a: [1, 2, 3]}))
  })

  it('set array length 2', () => {
    jsonuri.set(obj, '/a', [1, 2, 3])
    jsonuri.set(obj, '/a/length', 2)
    expect(s(obj)).toEqual(s({a: [1, 2]}))
  })
  // ==============
  it('set null', () => {
    let o = null
    jsonuri.set(o, '/a', [1, 2, 3])
    expect(o).toEqual(null)
  })
  // ========
  it('dot path', () => {
    let o = {}
    jsonuri.set(o, 'a/b/c.d.e/', {c: 1})
    expect(o).toEqual({ a: { b: { 'c.d.e': { c: 1 } } } })
  })
  it('dot path 2', () => {
    let o = {}
    jsonuri.set(o, 'a/b/c.d.e../', {c: 1})
    expect(o).toEqual({ a: { b: { 'c.d.e..': { c: 1 } } } })
  })
  it('dot path 3', () => {
    let o = {}
    jsonuri.set(o, 'a/b/c.d.e/../', {c: 1})
    expect(o).toEqual({ a: { b: { c: 1 } } })
  })
})
