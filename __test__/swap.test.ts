import { beforeEach, describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'

describe('jsonuri.swap', () => {
  let obj: unknown
  beforeEach(() => {
    obj = {
      a: [1, 2, 3],
      b: {
        c: 'c',
      },
    }
  })

  it('arr', () => {
    jsonuri.swap(obj, 'a/2', 'a/0')
    expect(obj).toEqual({ a: [3, 2, 1], b: { c: 'c' } })
  })

  it('arr 2', () => {
    const arr = [1, 2, 3]
    jsonuri.swap(arr, '2', '0')
    expect(arr).toEqual([3, 2, 1])
  })

  it('mix', () => {
    jsonuri.swap(obj, 'a/1', 'b')
    expect(obj).toEqual({ a: [1, { c: 'c' }, 3], b: 2 })
  })

  it('obj', () => {
    jsonuri.swap(obj, 'b', 'a')
    expect(obj).toEqual({ a: { c: 'c' }, b: [1, 2, 3] })
  })

  it('obj', () => {
    jsonuri.swap(obj, 'a', 'b/c')
    expect(obj).toEqual({ a: 'c', b: { c: [1, 2, 3] } })
  })

  it('number path', () => {
    const arr = [1, 2, 3]
    jsonuri.swap(arr, 1, 2)
    expect(arr).toEqual([1, 3, 2])
  })

  it('should swap values between two paths', () => {
    const data = {
      users: [
        { name: 'John', position: 1 },
        { name: 'Mike', position: 2 },
        { name: 'Jerry', position: 3 },
      ],
    }
    jsonuri.swap(data, 'users/0/position', 'users/2/position')
    expect(data.users).toEqual([
      { name: 'John', position: 3 },
      { name: 'Mike', position: 2 },
      { name: 'Jerry', position: 1 },
    ])
  })

  it('should handle swapping positions with the same value', () => {
    const data = {
      users: [
        { name: 'John', position: 1 },
        { name: 'Mike', position: 1 },
      ],
    }
    jsonuri.swap(data, 'users/0/position', 'users/1/position')
    expect(data.users).toEqual([
      { name: 'John', position: 1 },
      { name: 'Mike', position: 1 },
    ])
  })

  it('should not alter data if paths do not exist', () => {
    const data = {
      users: [
        { name: 'John', position: 1 },
        { name: 'Mike', position: 2 },
      ],
    }
    jsonuri.swap(data, 'users/0/nonexistent', 'users/1/position')
    expect(data.users).toEqual([
      { name: 'John', position: 1 },
      { name: 'Mike', position: 2 },
    ])
  })

  it('should not alter data if paths do not exist', () => {
    const data = {
      users: [
        { name: 'John', position: 1 },
        { name: 'Mike', position: 2 },
      ],
    }
    jsonuri.swap(data, 'users/0/nonexistent', 'users/1/position')
    expect(data.users).toEqual([
      { name: 'John', position: 1 },
      { name: 'Mike', position: 2 },
    ])
  })

  it('should not alter data if paths do not exist', () => {
    const data = {
      users: [
        { name: 'John', position: 1 },
        { name: 'Mike', position: 2 },
      ],
    }
    jsonuri.swap(data, 'users/0/position', 'users2/3/4/5/position')

    expect(data).toEqual({
      users: [
        {
          name: 'John',
          position: undefined,
        },
        {
          name: 'Mike',
          position: 2,
        },
      ],
      users2: {
        '3': {
          '4': {
            '5': {
              position: 1,
            },
          },
        },
      },
    })
  })
})
