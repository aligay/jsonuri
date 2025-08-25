import { beforeEach, describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'
describe('jsonuri.up', () => {
  let obj
  const origin = {
    a: [1, 2, 3, 4, 5, 6],
    b: null,
  }
  beforeEach(() => {
    obj = JSON.parse(JSON.stringify(origin))
  })

  it('`a/0`', () => {
    jsonuri.up(obj, 'a/0')
    expect(obj.a).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('`a/5`', () => {
    jsonuri.up(obj, 'a/5')
    expect(obj.a).toEqual([1, 2, 3, 4, 6, 5])
  })

  it('`a/1`', () => {
    jsonuri.up(obj, 'a/1')
    expect(obj.a).toEqual([2, 1, 3, 4, 5, 6])
  })

  it('`a/2`', () => {
    jsonuri.up(obj, 'a/2')
    expect(obj.a).toEqual([1, 3, 2, 4, 5, 6])
  })

  it('`a/5`', () => {
    jsonuri.up(obj, 'a/5', 3)
    expect(obj.a).toEqual([1, 2, 6, 3, 4, 5])
  })

  it('out `a/100`', () => {
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

  it('number path', () => {
    const arr = [1, 2, 3]
    jsonuri.up(arr, 1)
    expect(arr).toEqual([2, 1, 3])
  })

  it('should move item up by one position', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.up(data, 'items/1')
    expect(data.items).toEqual(['Second', 'First', 'Third'])
  })

  it('should move item up by multiple positions', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.up(data, 'items/2', 2)
    expect(data.items).toEqual(['Third', 'First', 'Second'])
  })

  it('should move item up by multiple positions', () => {
    const data = { items: ['First', 'Second', 'Third', 'Fourth'] }
    jsonuri.up(data, 'items/3', 2)
    expect(data.items).toEqual(['First', 'Fourth', 'Second', 'Third'])
  })

  it('should not modify data if path is out of bounds', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.up(data, 'items/3')
    expect(data.items).toEqual(['First', 'Second', 'Third'])
  })

  it('should not modify data if index is already at the top', () => {
    const data = { items: ['First', 'Second', 'Third'] }
    jsonuri.up(data, 'items/0')
    expect(data.items).toEqual(['First', 'Second', 'Third'])
  })
})
