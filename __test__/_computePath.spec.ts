import * as jsonuri from '../dist/index.js'

describe('jsonuri._computePath', () => {
  it('NOT ARRAY', () => {
    const ret = jsonuri._computePath('a', 'prev')
    expect(ret).toBe(null)
  })

  it('BAD ARGS', () => {
    const ret = jsonuri._computePath('a')
    expect(ret).toBe(null)
  })

  it('prev -1', () => {
    const ret = jsonuri._computePath('a/-1', 'prev')
    expect(ret).toBe('a/-2')
  })

  it('prev 0', () => {
    const ret = jsonuri._computePath('a/0', 'prev')
    expect(ret).toBe('a/-1')
  })

  it('prev 1', () => {
    const ret = jsonuri._computePath('a/1', 'prev')
    expect(ret).toBe('a/0')
  })

  it('prev 100', () => {
    const ret = jsonuri._computePath('a/100', 'prev')
    expect(ret).toBe('a/99')
  })

  it('next -2', () => {
    const ret = jsonuri._computePath('a/-2', 'next')
    expect(ret).toBe('a/-1')
  })

  it('next -1', () => {
    const ret = jsonuri._computePath('a/-1', 'next')
    expect(ret).toBe('a/0')
  })

  it('next 0', () => {
    const ret = jsonuri._computePath('a/0', 'next')
    expect(ret).toBe('a/1')
  })

  it('next 1', () => {
    const ret = jsonuri._computePath('a/1', 'next')
    expect(ret).toBe('a/2')
  })

  it('next 100', () => {
    const ret = jsonuri._computePath('a/100', 'next')
    expect(ret).toBe('a/101')
  })
})
