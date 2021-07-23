import * as jsonuri from '../dist/index.js'

describe('jsonuri.mv', () => {
  let obj
  beforeEach(() => {
    obj = {
      a: {
        a1: {
          a2: 'a2'
        }
      },
      c: {
        d: '666'
      }
    }
  })

  it('to is Object', () => {
    jsonuri.mv(obj, 'a', 'c')
    expect(obj).toEqual({ c: { d: '666', a: { a1: { a2: 'a2' } } } })
  })

  it('to is Object 2', () => {
    jsonuri.mv(obj, 'a/a1', 'c')
    expect(obj).toEqual({ a: { }, c: { d: '666', a: { a1: { a2: 'a2' } } } })
  })

  it('to is Object same name', () => {
    const obj = {
      a: 1,
      b: {
        a: {}
      }
    }
    jsonuri.mv(obj, 'a', 'b/a')
    expect(obj).toEqual({ b: { a: { a: 1 } } })
  })

  it('mv a array', () => {
    const arr = [0, 1, 2, 3, 4]
    jsonuri.mv(arr, '1', '3', 'before')
    expect(arr).toEqual([0, 2, 1, 3, 4])
  })

  it('mv a array 2', () => {
    const arr = [0, 1, 2, 3, 4]
    jsonuri.mv(arr, '1', '3', 'after')
    expect(arr).toEqual([0, 2, 3, 1, 4])
  })

  it('mv a array 3', () => {
    const o = { a: [0, 1, 2, 3, 4] }
    jsonuri.mv(o, 'a/1', 'a/3', 'after')
    expect(o.a).toEqual([0, 2, 3, 1, 4])
  })

  it('mv a array 4', () => {
    const o = { a: [0, 1, 2, 3, 4] }
    jsonuri.mv(o, 'a/3', 'a/1', 'before')
    expect(o.a).toEqual([0, 3, 1, 2, 4])
  })

  it('mv a array 5', () => {
    const o = { a: [0, 1, 2, 3, 4] }
    jsonuri.mv(o, 'a/3', 'a/1', 'after')
    expect(o.a).toEqual([0, 1, 3, 2, 4])
  })

  it('mv a array 6', () => {
    const o = { a: [0, 1, 2, 3, 4] }
    expect(() => {
      jsonuri.mv(o, 'a/3', 'a/-99', 'before')
    }).toThrow()
  })

  it('mv a array 7', () => {
    const o = { a: [0, 1, 2, 3, 4] }
    jsonuri.mv(o, 'a/3', 'a/3', 'before')
    expect(o.a).toEqual([0, 1, 2, 3, 4])
  })

  // ======
  it('mv a array to anothor array', () => {
    const o = {
      a: [0, 1, 2, 3, 4],
      b: ['a', 'b', 'c']
    }
    jsonuri.mv(o, 'a/3', 'b/1', 'before')
    expect(o).toEqual({
      a: [0, 1, 2, 4],
      b: ['a', 3, 'b', 'c']
    })
  })

  it('to is not object', () => {
    const obj = {
      a: 1,
      b: {
        a: 2
      }
    }
    expect(() => {
      jsonuri.mv(obj, 'a', 'b/a')
    }).toThrow()
  })

  // =====
  it('number path', () => {
    const arr = [1, 2, 3]
    jsonuri.mv(arr, 2, 1, 'before')
    expect(arr).toEqual([1, 3, 2])
  })
})
