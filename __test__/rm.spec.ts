import * as jsonuri from '../dist/index.js'

describe('jsonuri.rm', () => {
  let obj
  const rawData = {
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

  beforeEach(() => {
    obj = JSON.parse(JSON.stringify(rawData))
  })

  it('empty path', () => {
    jsonuri.rm(obj, 'e/f/g')
    expect(obj).toEqual(rawData)
  })

  it('object', () => {
    jsonuri.rm(obj, 'b')
    expect(obj).toEqual({ a: 2, list: [0, 1, 2, 3, 4, 5, 6, 7, 8], NULL: null })
  })

  it('object deep', () => {
    jsonuri.rm(obj, 'b/b1')
    expect(obj).toEqual({ a: 2, b: { b2: 32 }, list: [0, 1, 2, 3, 4, 5, 6, 7, 8], NULL: null })
  })
  // =============
  it('arr', () => {
    const arr = [1, 2, 3]
    jsonuri.rm(arr, '1')
    expect(arr).toEqual([1, 3])
  })

  it('arr deep', () => {
    const arr = { a: [1, 2, 3] }
    jsonuri.rm(arr, 'a/1')
    expect(arr).toEqual({ a: [1, 3] })
  })

  it('number path', () => {
    const arr = [1, 2]
    jsonuri.rm(arr, 0)
    expect(arr).toEqual([2])
  })

  // ==============
  it('bad arg', () => {
    const arr = { a: [1, 2, 3] }
    jsonuri.rm(arr, null)
    expect(arr).toEqual({ a: [1, 2, 3] })
  })

  // ==============
  it('bad arg', () => {
    const arr = { a: [1, 2, 3] }
    jsonuri.rm(arr, 'a/b')
    expect(arr).toEqual({ a: [1, 2, 3] })
  })
})
