import { beforeEach, describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'

describe('jsonuri.rm', () => {
  let obj
  const rawData = {
    a: 2,
    b: {
      b1: {
        b11: 311,
        b12: 312,
      },
      b2: 32,
    },
    list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    NULL: null,
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
    expect(obj).toEqual({
      a: 2,
      b: { b2: 32 },
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      NULL: null,
    })
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
    jsonuri.rm(arr, null as any)
    expect(arr).toEqual({ a: [1, 2, 3] })
  })

  // ==============
  it('bad arg', () => {
    const arr = { a: [1, 2, 3] }
    jsonuri.rm(arr, 'a/b')
    expect(arr).toEqual({ a: [1, 2, 3] })
  })

  it('should remove the specified property', () => {
    const data = { user: { name: 'John', age: 30 } }
    jsonuri.rm(data, 'user/age')
    expect(data.user).toEqual({ name: 'John' })
  })

  it('should not modify data if property does not exist', () => {
    const data = { user: { name: 'John', age: 30 } }
    jsonuri.rm(data, 'user/address')
    expect(data.user).toEqual({ name: 'John', age: 30 })
  })

  it('should remove nested property', () => {
    const data = { user: { name: 'John', details: { address: 'Beijing' } } }
    jsonuri.rm(data, 'user/details/address')
    expect(data.user.details).toEqual({})
  })
})
