/* global describe it beforeEach expect */
const jsonuri = require('../../dist/index.js')
describe('jsonuri.mv', () => {
  let obj
  beforeEach(() => {
    obj = {
      a: {
        a1: {
          a2: 'a2'
        }
      },
      c: {
        d: '666'
      }
    }
  })

  it('to is Object', () => {
    jsonuri.mv(obj, 'a', 'c')
    expect(obj).toEqual({'c': {'d': '666', 'a': {'a1': {'a2': 'a2'}}}})
  })

  it('to is Object 2', () => {
    jsonuri.mv(obj, 'a/a1', 'c')
    expect(obj).toEqual({ a: { }, c: { d: '666', a: { a1: { a2: 'a2' } } } })
  })

  it('to is Object same name', () => {
    let obj = {
      a: 1,
      b: {
        a: {}
      }
    }
    jsonuri.mv(obj, 'a', 'b/a')
    expect(obj).toEqual({ b: { a: { a: 1 } } })
  })

  it('to is not object', () => {
    let obj = {
      a: 1,
      b: {
        a: 2
      }
    }
    expect(() => {
      jsonuri.mv(obj, 'a', 'b/a')
    }).toThrow()
  })
})
