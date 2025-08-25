import { describe, expect, it } from 'vitest'
import { parseUri } from '../src'

const obj = {
  a: {
    b: [10, 20, 30],
    c: {
      d: 'hello',
    },
    'b/c': {
      d: 'slash',
    },
  },
}

describe('jsonuri.parseUri', () => {
  it('should parse basic paths', () => {
    expect(parseUri('a')).toEqual(['a'])
    expect(parseUri('a/b')).toEqual(['a', 'b'])
    expect(parseUri('a/b///c')).toEqual(['a', 'b', 'c'])
  })
  it('should split basic paths', () => {
    expect(parseUri('a/b/c')).toEqual(['a', 'b', 'c'])
    expect(parseUri('a/b/0')).toEqual(['a', 'b', '0'])
  })

  it('should handle ".." for going up', () => {
    expect(parseUri('a/b/c/..')).toEqual(['a', 'b'])
    expect(parseUri('/a/b/c/../..')).toEqual(['a'])
  })

  it('should handle escaped slashes', () => {
    expect(parseUri('a/b\\/c/d')).toEqual(['a', 'b/c', 'd'])
    expect(parseUri('a\\/b\\/c')).toEqual(['a/b/c'])
  })

  it('should handle empty segments', () => {
    expect(parseUri('a/b')).toEqual(['a', 'b'])
    expect(parseUri(['a/b', '..', ['ccc', 'ddd']])).toEqual(['a', 'ccc', 'ddd'])
  })

  it('should handle expressions like [@length-1]', () => {
    expect(parseUri('a/b/[@length-1]')).toEqual(['a', 'b', '@length-1'])
    expect(parseUri('a/b/[@length-2]')).toEqual(['a', 'b', '@length-2'])
    expect(parseUri('a/b/[@length-1]/..')).toEqual(['a', 'b'])
    expect(parseUri('a/b/[@length-1]/../..')).toEqual(['a'])
    expect(parseUri('a/b/[@length-1]/../../..///')).toEqual([])
    expect(parseUri('a/b/[@last]')).toEqual(['a', 'b', '@last'])
  })

  it('should support array input', () => {
    expect(parseUri(['a', 'b', '..', 'c'])).toEqual(['a', 'c'])
    expect(parseUri(['a', '..', '..', '../', 'c'])).toEqual([])
    expect(parseUri(['..', 'a'])).toEqual([])
  })

  it('should return empty array for empty input', () => {
    expect(parseUri('')).toEqual([])
    expect(parseUri([])).toEqual([])
  })

  it('string', () => {
    expect(parseUri(['a', 'b/b1/b2/../../c'])).toEqual(['a', 'b', 'c'])
  })

  expect(parseUri(['a', 'b', '../'])).toEqual(['a'])

  expect(parseUri([['a', 'b', '../'], 'c'])).toEqual(['a', 'c'])

  expect(parseUri([['a', 'b', '../'], 'c', '../d'])).toEqual(['a', 'd'])

  expect(parseUri([['a', 'b', '../'], 'c', ['../d'], 'e', 'f'])).toEqual([
    'a',
    'd',
    'e',
    'f',
  ])

  expect(parseUri(['1', '2'])).toEqual(['1', '2'])
  expect(parseUri(['1', 2])).toEqual(['1', '2'])
  expect(parseUri([1, 2])).toEqual(['1', '2'])
})
