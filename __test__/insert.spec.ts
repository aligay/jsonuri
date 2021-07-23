import * as jsonuri from '../dist/index.js'

describe('insert', () => {
  let arr
  beforeEach(() => {
    arr = [0, 1, 2, 3]
  })

  it('insert after', () => {
    jsonuri.insert(arr, '/1/', 'hello kitty', 'after')
    expect(arr).toEqual([0, 1, 'hello kitty', 2, 3])
  })

  it('insert before', () => {
    jsonuri.insert(arr, '/1/', 'hello kitty', 'before')
    expect(arr).toEqual([0, 'hello kitty', 1, 2, 3])
  })

  it('insert before `0`', () => {
    jsonuri.insert(arr, '/0/', 'hello kitty', 'before')
    expect(arr).toEqual(['hello kitty', 0, 1, 2, 3])
  })

  it('insert before `1`', () => {
    jsonuri.insert(arr, '/1/', 'hello kitty', 'before')
    expect(arr).toEqual([0, 'hello kitty', 1, 2, 3])
  })

  it('insert before `2`', () => {
    jsonuri.insert(arr, '/2/', 'hello kitty', 'before')
    expect(arr).toEqual([0, 1, 'hello kitty', 2, 3])
  })

  it('insert before `3`', () => {
    jsonuri.insert(arr, '/3/', 'hello kitty', 'before')
    expect(arr).toEqual([0, 1, 2, 'hello kitty', 3])
  })

  it('insert before `4`', () => {
    jsonuri.insert(arr, '/4/', 'hello kitty', 'before')
    expect(arr).toEqual([0, 1, 2, 3, 'hello kitty'])
  })

  it('insert after `0`', () => {
    jsonuri.insert(arr, '/0/', 'hello kitty', 'after')
    expect(arr).toEqual([0, 'hello kitty', 1, 2, 3])
  })

  it('out of range', () => {
    expect(() => {
      jsonuri.insert(arr, '/-100/', 'hello kitty', 'after')
    }).toThrow()
  })

  it('out of range 2', () => {
    expect(() => {
      jsonuri.insert(arr, '/999/', 'hello kitty', 'before')
    }).toThrow()
  })

  it('get number path', () => {
    const arr = [1, 2]
    jsonuri.insert(arr, 0, 'hello kitty', 'after')
    expect(arr).toEqual([1, 'hello kitty', 2])
  })
})
