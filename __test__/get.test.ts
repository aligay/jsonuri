import { describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'
describe('jsonuri.get', () => {
  const obj = {
    a: 2,
    b: {
      b1: {
        b11: 311,
        b12: 312,
      },
      b2: 32,
    },
    c: { d: 'hello' },
    'b/c': { d: 'escaped' },
    list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    NULL: null,
  }

  it('get number path', () => {
    expect(jsonuri.get([1, 2, 3], 1)).toEqual(2)
  })

  it('empty path', () => {
    expect(jsonuri.get(obj, '/')).toBe(obj)
    expect(jsonuri.get(obj, '')).toBeUndefined()
    expect(jsonuri.get(obj, [])).toBeUndefined()
  })

  it('object path', () => {
    expect(jsonuri.get(obj, 'a')).toEqual(2)
    expect(jsonuri.get(obj, '/a')).toEqual(2)
    expect(jsonuri.get(obj, '/a/')).toEqual(2)
    expect(jsonuri.get(obj, 'a/')).toEqual(2)

    expect(jsonuri.get(obj, 'b/b1/b11')).toEqual(311)
    expect(jsonuri.get(obj, '/b/b1/b11')).toEqual(311)
    expect(jsonuri.get(obj, '/b/b1/////b11')).toEqual(311)
    expect(jsonuri.get(obj, '/b/b1/b11/')).toEqual(311)
    expect(jsonuri.get(obj, 'b/b1/b11/../')).toEqual({ b11: 311, b12: 312 })
    expect(jsonuri.get(obj, 'b/b1/b11/../../b2/')).toEqual(32)
    expect(jsonuri.get(obj, 'b/b1/b11/../../b2')).toEqual(32)
  })
  it('array path', () => {
    expect(jsonuri.get(obj, 'list/2')).toEqual(2)
    expect(jsonuri.get(obj, 'list/100')).not.toBeDefined()
    expect(jsonuri.get(obj, 'list/-1')).not.toBeDefined()
  })
  it('error path', () => {
    expect(jsonuri.get(obj, 'oo/xx/yy/zz')).not.toBeDefined()
  })
  it('return null', () => {
    expect(jsonuri.get(obj, '/NULL')).toBeNull()
    expect(jsonuri.get(obj, 'NULL')).toBeNull()
  })
  it('bad arg', () => {
    expect(jsonuri.get(obj, { foo: 'bar' } as any)).not.toBeDefined()
  })
  it('get from null', () => {
    expect(jsonuri.get(null, 'a')).toBeUndefined()
    expect(jsonuri.get(null, 1)).toBeUndefined()
    expect(jsonuri.get(undefined, 'a/b/c')).toBeUndefined()
  })

  it('get false value', () => {
    expect(jsonuri.get({ a: 0 }, 'a/toFixed')).toEqual(Number.prototype.toFixed)
  })

  it('get key has `/`', () => {
    expect(jsonuri.get({ a: { 'b/c': 1 } }, 'a/b\\/c')).toEqual(1)
  })

  it('should get simple values', () => {
    expect(jsonuri.get(obj, 'c/d')).toBe('hello')
    expect(jsonuri.get(obj, ['c', 'd'])).toBe('hello')
  })

  it('should support escaped path keys', () => {
    expect(jsonuri.get(obj, 'b\\/c/d')).toBe('escaped')
  })

  it('should support array expressions', () => {
    expect(jsonuri.get(obj, 'list/[@length-1]')).toBe(8)
    expect(jsonuri.get(obj, 'list/[@length-2]')).toBe(7)
    expect(jsonuri.get(obj, 'list/[@length-100]')).toBeUndefined()
    expect(jsonuri.get(obj, 'list/aaa/bbb/[@length-1]')).toBeUndefined()
    expect(jsonuri.get(obj, 'a/b/[@foo]')).toBeUndefined() // unknown expr
    expect(jsonuri.get(obj, 'x/y/z')).toBeUndefined()
    expect(jsonuri.get(obj, 'list/[@first]')).toBe(0)
    expect(jsonuri.get(obj, 'list/0')).toBe(0)
    expect(jsonuri.get(obj, 'list/[@last]')).toBe(8)
  })

  const data = {
    users: [
      { name: 'John', age: 30 },
      { name: 'Mike', age: 25 },
    ],
  }

  it('should get the name of the first user using index', () => {
    expect(jsonuri.get<string>(data, 'users/0/name')).toBe('John')
  })

  it('should get the name of the first user using @first', () => {
    expect(jsonuri.get<string>(data, 'users/@first/name')).toBe('John')
  })

  it('should get the age of the last user using @last', () => {
    expect(jsonuri.get<number>(data, 'users/@last/age')).toBe(25)
  })

  it('should return undefined for a non-existent path', () => {
    expect(jsonuri.get(data, 'nonexistent/path/here')).toBeUndefined()
  })
})
