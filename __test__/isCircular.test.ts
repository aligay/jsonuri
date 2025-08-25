import { describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'

describe('jsonuri.isCircular', () => {
  it('1', () => {
    expect(jsonuri.isCircular({})).toBeFalsy()
    expect(jsonuri.isCircular(globalThis)).toBeTruthy()
  })
  it('2', () => {
    const a = {}
    jsonuri.set(a, '/b/c/d/e/f/g', a)
    expect(jsonuri.isCircular(a)).toBeTruthy()
  })
})
