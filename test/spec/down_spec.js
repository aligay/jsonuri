/* global describe beforeEach it expect */
const jsonuri = require('../../src/index.js')
describe('jsonuri.down', () => {
  let obj
  let origin = {
    a: [1, 2, 3, 4, 5, 6],
    b: null
  }
  beforeEach(() => {
    obj = JSON.parse(JSON.stringify(origin))
  })

  it('`-1`', () => {
    jsonuri.down(obj, 'a/-1')
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('`0`', () => {
    jsonuri.down(obj, 'a/0')
    expect(obj.a).toEqual([2, 1, 3, 4, 5, 6])
  })

  it('1, `1`', () => {
    jsonuri.down(obj, 'a/1')
    expect(obj.a).toEqual([1, 3, 2, 4, 5, 6])
  })

  it('3, `1`', () => {
    jsonuri.down(obj, 'a/3', 1)
    expect(obj.a).toEqual([1, 2, 3, 5, 4, 6])
  })

  it('3,`2`', () => {
    jsonuri.down(obj, 'a/3', 2)
    expect(obj.a).toEqual([1, 2, 3, 5, 6, 4])
  })

  it('out gap', () => {
    jsonuri.down(obj, 'a/3', 999)
    expect(obj.a).toEqual([1, 2, 3, 5, 6, 4])
  })

  it('out `100`', () => {
    jsonuri.down(obj, 'a/100')
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('bad gap', () => {
    jsonuri.down(obj, 'a/4', -1)
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('not array', () => {
    jsonuri.down(obj, 'b/4')
    expect(obj).toEqual(origin)
  })
})
