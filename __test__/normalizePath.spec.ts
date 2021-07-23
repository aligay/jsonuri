import * as jsonuri from '../dist/index.js'

describe('jsonuri.normalizePath', () => {
  // it('bad path', () => {
  //   expect(() => {
  //     jsonuri.normalizePath('a../')
  //   }).toThrow()
  // })

  // it('bad path 2', () => {
  //   it('bad path', () => {
  //     expect(() => {
  //       jsonuri.normalizePath('a../')
  //     }).toThrow()
  //   })
  // })

  it('string', () => {
    expect(jsonuri.normalizePath('a', 'b/b1/b2/../../c')).toBe('a/b/c')
  })

  it('array', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'])).toBe('a')
  })

  it('mix', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'], 'c')).toBe('a/c')
  })

  it('mix 2', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'], 'c', '../d')).toBe('a/d')
  })

  it('mix 3', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'], 'c', ['../d'], 'e', 'f')).toBe('a/d/e/f')
  })

  it('number path', () => {
    expect(jsonuri.normalizePath(1, 2)).toBe('1/2')
  })
})
