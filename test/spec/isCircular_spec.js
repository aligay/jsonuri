/* global describe it expect */
const jsonuri = require('../../dist/index.js')
describe('jsonuri.isCircular', () => {
  it('{}', () => {
    expect(jsonuri.isCircular({})).toBeFalsy()
    expect(jsonuri.isCircular(global)).toBeTruthy()
  })
  it('2', () => {
    const a = {}
    jsonuri.set(a, '/b/c/d/e/f/g', a)
    expect(jsonuri.isCircular(a)).toBeTruthy()
  })
})
