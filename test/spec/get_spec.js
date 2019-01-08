/* global describe it expect */
const jsonuri = require('../../dist/index.js')
describe('jsonuri.get', () => {
  const obj = {
    a: 2,
    b: {
      b1: {
        b11: 311,
        b12: 312
      },
      b2: 32
    },
    list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    NULL: null
  }

  it('get number path', () => {
    expect(jsonuri.get([1, 2, 3], 1)).toEqual(2)
  })

  it('empty path', () => {
    expect(jsonuri.get(obj, '')).toBe(obj)
    expect(jsonuri.get(obj, '/')).toBe(obj)
  })

  it('object path', () => {
    expect(jsonuri.get(obj, 'a')).toEqual(2)
    expect(jsonuri.get(obj, '/a')).toEqual(2)
    expect(jsonuri.get(obj, '/a/')).toEqual(2)
    expect(jsonuri.get(obj, 'a/')).toEqual(2)

    expect(jsonuri.get(obj, 'b/b1/b11')).toEqual(311)
    expect(jsonuri.get(obj, '/b/b1/b11')).toEqual(311)
    expect(jsonuri.get(obj, '/b/b1/////b11')).toEqual(311)
    expect(jsonuri.get(obj, '/b/b1/b11/')).toEqual(311)
    expect(jsonuri.get(obj, 'b/b1/b11/../')).toEqual({ b11: 311, b12: 312 })
    expect(jsonuri.get(obj, 'b/b1/b11/../../b2/')).toEqual(32)
    expect(jsonuri.get(obj, 'b/b1/b11/../../b2')).toEqual(32)
  })
  it('array path', () => {
    expect(jsonuri.get(obj, 'list/2')).toEqual(2)
    expect(jsonuri.get(obj, 'list/100')).not.toBeDefined()
    expect(jsonuri.get(obj, 'list/-1')).not.toBeDefined()
  })
  it('error path', () => {
    expect(jsonuri.get(obj, 'oo/xx/yy/zz')).not.toBeDefined()
  })
  it('return null', () => {
    expect(jsonuri.get(obj, '/NULL')).toBeNull()
    expect(jsonuri.get(obj, 'NULL')).toBeNull()
  })
  it('bad arg', () => {
    expect(jsonuri.get(obj, { foo: 'bar' })).not.toBeDefined()
  })
  it('get from null', () => {
    expect(jsonuri.get(null, 'a')).toBeNull()
    expect(jsonuri.get(null, 1)).toBeNull()
    expect(jsonuri.get(undefined, 'a/b/c')).toBeUndefined()
  })

  it('get false value', () => {
    expect(jsonuri.get({a: 0}, 'a/toFixed')).toEqual(Number.prototype.toFixed)
  })
})
