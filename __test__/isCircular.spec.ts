import * as jsonuri from '../dist/index.js'

describe('jsonuri.isCircular', () => {
  it('1', () => {
    expect(jsonuri.isCircular({})).toBeFalsy()
    expect(jsonuri.isCircular(global)).toBeTruthy()
  })
  it('2', () => {
    const a = {}
    jsonuri.set(a, '/b/c/d/e/f/g', a)
    expect(jsonuri.isCircular(a)).toBeTruthy()
  })
})
