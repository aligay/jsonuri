/* global describe it beforeEach expect */
const jsonuri = require('../../dist/index.js')
describe('jsonuri.swap', () => {
  let obj
  beforeEach(() => {
    obj = {
      a: [1, 2, 3],
      b: {
        c: 'c'
      }
    }
  })

  it('arr', () => {
    jsonuri.swap(obj, 'a/2', 'a/0')
    expect(obj).toEqual({'a': [3, 2, 1], 'b': {'c': 'c'}})
  })

  it('arr 2', () => {
    let arr = [1, 2, 3]
    jsonuri.swap(arr, '2', '0')
    expect(arr).toEqual([3, 2, 1])
  })

  it('mix', () => {
    jsonuri.swap(obj, 'a/1', 'b')
    expect(obj).toEqual({'a': [1, {c: 'c'}, 3], 'b': 2})
  })

  it('obj', () => {
    jsonuri.swap(obj, 'b', 'a')
    expect(obj).toEqual({'a': {'c': 'c'}, 'b': [1, 2, 3]})
  })

  it('obj', () => {
    jsonuri.swap(obj, 'a', 'b/c')
    expect(obj).toEqual({'a': 'c', 'b': { c: [1, 2, 3] }})
  })
})
