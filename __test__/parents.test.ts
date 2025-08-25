import { describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'

describe('parents', () => {
  it('should return all parent paths', () => {
    expect(jsonuri.parents('a/b/c')).toEqual(['a/b', 'a'])
    expect(jsonuri.parents(['a/b', 'c'])).toEqual(['a/b', 'a'])
    expect(jsonuri.parents(['a/b', '../c'])).toEqual(['a'])
    expect(jsonuri.parents('a')).toEqual([])
    expect(jsonuri.parents('')).toEqual([])
    expect(jsonuri.parents('../../')).toEqual([])
    expect(jsonuri.parents('a/b/c/d')).toEqual(['a/b/c', 'a/b', 'a'])
  })
})

describe('parent', () => {
  it('should return direct parent path', () => {
    expect(jsonuri.parent('a/b/c')).toBe('a/b')
    expect(jsonuri.parent('a')).toBeNull()
    expect(jsonuri.parent('')).toBeNull()
    expect(jsonuri.parent('a/b/c/d')).toBe('a/b/c')
    expect(jsonuri.parent('a/b/c')).toEqual('a/b')
    expect(jsonuri.parent(['a/b', 'c'])).toEqual('a/b')
    expect(jsonuri.parent(['a/b', '../c'])).toEqual('a')
    expect(jsonuri.parent('a')).toBeNull()
    expect(jsonuri.parent('')).toBeNull()
    expect(jsonuri.parent('../../')).toBeNull()
    expect(jsonuri.parent('a/b/c/d')).toEqual('a/b/c')
  })
})
