import { describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'

describe('jsonuri.normalizeUri', () => {
  it('bad path', () => {
    expect(jsonuri.normalizeUri('a../')).toBe('a..')
  })

  it('string', () => {
    expect(jsonuri.normalizeUri('a', 'b/b1/b2/../../c')).toBe('a/b/c')
    expect(jsonuri.normalizeUri('a', 'b/b1/b2//\//../../c')).toBe('a/b/c')
  })

  it('array', () => {
    expect(jsonuri.normalizeUri(['a', 'b', '../'])).toBe('a')
  })

  it('mix', () => {
    expect(jsonuri.normalizeUri(['a', 'b', '../'], 'c')).toBe('a/c')
  })

  it('mix 2', () => {
    expect(jsonuri.normalizeUri(['a', 'b', '../'], 'c', '../d')).toBe('a/d')
  })

  it('mix 3', () => {
    expect(
      jsonuri.normalizeUri(['a', 'b', '../'], 'c', ['../d'], 'e', 'f'),
    ).toBe('a/d/e/f')
  })

  it('number path', () => {
    expect(jsonuri.normalizeUri(1, 2)).toBe('1/2')
  })
})
