import { beforeEach, describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'

describe('jsonuri.down', () => {
  let obj: any
  const origin = {
    a: [1, 2, 3, 4, 5, 6],
    b: null,
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

  it(`jsonuri.down(obj, 'a/3', 2)`, () => {
    jsonuri.down(obj, 'a/3', 2)
    // expect(obj.a).toEqual([1, 2, 3, 5, 6, 4])
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

  it('number path', () => {
    const arr = [1, 2, 3]
    jsonuri.down(arr, 1)
    expect(arr).toEqual([1, 3, 2])
  })

  it('number path', () => {
    const arr = [1, 2, 3]
    jsonuri.down(arr, '1')
    expect(arr).toEqual([1, 3, 2])
  })

  it('should move item down by one position', () => {
    const items = ['First', 'Second', 'Third']
    jsonuri.down(items, '0')
    expect(items).toEqual(['Second', 'First', 'Third'])
  })

  it('should move item down by one position', () => {
    const items = ['First', 'Second', 'Third']
    jsonuri.down(items, '1')
    expect(items).toEqual(['First', 'Third', 'Second'])
  })

  it('should move item down by one position', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.down(data, 'items/1')
    expect(data.items).toEqual(['First', 'Third', 'Second'])
  })

  it('should not modify data if index is already at the bottom', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.down(data, 'items/10000')
    expect(data.items).toEqual(['First', 'Second', 'Third'])
  })

  it('should not modify data if index is already at the bottom', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.down(data, 'items/2')
    expect(data.items).toEqual(['First', 'Second', 'Third'])
  })
})
