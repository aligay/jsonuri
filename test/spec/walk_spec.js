/* global describe beforeEach it expect */
const jsonuri = require('../../dist/index.js')
describe('jsonuri.walk', () => {
  let obj
  beforeEach(() => {
    obj = {
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
  })

  it('get', () => {
    let ret
    jsonuri.walk(obj, (val, key, parent, { path }) => {
      if (path === 'b/b1/b11') {
        ret = val
      }
    })
    expect(ret).toEqual(311)
  })

  it('get 2', () => {
    let ret
    jsonuri.walk(obj, (val, key, parent, { path }) => {
      if (key === 'list') {
        ret = val
      }
    })
    expect(ret).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('walk circular object', () => {
    expect(() => {
      jsonuri.walk(global)
    }).toThrow()
  })

  it('walk circular object 2', () => {
    const a = {}
    let b = { a }
    b.a = a
    expect(() => {
      jsonuri.walk(b)
    }).not.toThrow()
  })

  it('walk circular object 3', () => {
    const a = {}
    a.b = a
    expect(() => {
      jsonuri.walk(a)
    }).toThrow()
  })

  it('fourth arg {path}', () => {
    const obj = {
      a: {
        b: 'b'
      }
    }
    jsonuri.walk(obj, (val, key, parent, {path}) => {
      if (val === 'b') {
        expect(path).toEqual('a/b')
      }
    })
  })
})
