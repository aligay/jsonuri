/* global describe beforeEach it expect */
const jsonuri = require('../../dist/index.js')
describe('jsonuri.up', () => {
  let obj
  let origin = {
    a: [1, 2, 3, 4, 5, 6],
    b: null
  }
  beforeEach(() => {
    obj = JSON.parse(JSON.stringify(origin))
  })

  it('`0`', () => {
    jsonuri.up(obj, 'a/0')
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('`1`', () => {
    jsonuri.up(obj, 'a/1')
    expect(obj.a).toEqual([2, 1, 3, 4, 5, 6])
  })

  it('`5`', () => {
    jsonuri.up(obj, 'a/5', 3)
    expect(obj.a).toEqual([1, 2, 6, 3, 4, 5])
  })

  it('out `100`', () => {
    jsonuri.up(obj, 'a/100')
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('out `100`', () => {
    jsonuri.up(obj, 'a/4', 999)
    expect(obj.a).toEqual([5, 1, 2, 3, 4, 6])
  })

  it('out `100`', () => {
    jsonuri.up(obj, 'a/4', -1)
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('not array', () => {
    jsonuri.up(obj, 'b/4')
    expect(obj).toEqual(origin)
  })
})
