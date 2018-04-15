/* global describe it expect */
const jsonuri = require('../../src/index.js')
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
    expect(jsonuri.normalizePath('a', 'b/b1/b2/../../c')).toEqual('a/b/c')
  })

  it('array', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'])).toEqual('a')
  })

  it('mix', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'], 'c')).toEqual('a/c')
  })

  it('mix 2', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'], 'c', '../d')).toEqual('a/d')
  })

  it('mix 3', () => {
    expect(jsonuri.normalizePath(['a', 'b', '../'], 'c', ['../d'], 'e', 'f')).toEqual('a/d/e/f')
  })
})
