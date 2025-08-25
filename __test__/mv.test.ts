import { beforeEach, describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'
describe('jsonuri.mv', () => {
  let obj
  beforeEach(() => {
    obj = {
      a: {
        a1: {
          a2: 'a2',
        },
      },
      c: {
        d: '666',
      },
    }
  })

  it('to is Object', () => {
    jsonuri.mv(obj, 'a', 'c')
    expect(obj).toEqual({ c: { d: '666', a: { a1: { a2: 'a2' } } } })
  })

  it('to is Object 2', () => {
    jsonuri.mv(obj, 'a/a1', 'c')
    expect(obj).toEqual({ a: {}, c: { d: '666', a: { a1: { a2: 'a2' } } } })
  })

  it('to is Object same name', () => {
    const obj = {
      a: 1,
      b: {
        a: {},
      },
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
      b: ['a', 'b', 'c'],
    }
    jsonuri.mv(o, 'a/3', 'b/1', 'before')
    expect(o).toEqual({
      a: [0, 1, 2, 4],
      b: ['a', 3, 'b', 'c'],
    })
  })

  it('to is not object', () => {
    const obj = {
      a: 1,
      b: {
        a: 2,
      },
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

  it('should move value to another path', () => {
    const data = {
      source: { item: 'Important Data' },
      destination: {},
    }
    expect(() =>
      jsonuri.mv(data, 'source/item', 'destination/item', 'after'),
    ).toThrow()
  })

  it('should move value to another path when destination already has a value', () => {
    const data = {
      source: { item: 'Important Data' },
      destination: { item: 'Existing Data' },
    }
    expect(() =>
      jsonuri.mv(data, 'source/item', 'destination/item', 'after'),
    ).toThrow()
  })

  // it('should not move value if source path does not exist', () => {
  //   const data = {
  //     source: { item: 'Important Data' },
  //     destination: {},
  //   }
  //   jsonuri. mv(data, 'source/nonexistent', 'destination', 'after')
  //   console.log(22222, data)
  //   expect(data).toEqual({
  //     source: { item: 'Important Data' },
  //     destination: undefined,
  //   })
  // })

  // it('should not alter data if destination path is invalid', () => {
  //   const data = {
  //     source: { item: 'Important Data' },
  //     destination: {},
  //   }
  //   jsonuri.  mv(data, 'source/item', 'destination/nonexistent/item', 'after')
  //   expect(data).toEqual({
  //     source: {},
  //     destination: { nonexistent: { item: 'Important Data' } },
  //   })
  // })

  it('should move deeply nested node to new location and remove from original path', () => {
    const data = [
      {
        name: 'a',
        children: [
          { name: 'a-0' },
          {
            name: 'a-1',
            children: [
              { name: 'a-1-0' },
              { name: 'a-1-1' },
              { name: 'a-1-2' },
              { name: 'a-1-3' },
            ],
          },
          {
            name: 'a-2',
            children: [
              { name: 'a-2-0' },
              {
                name: 'a-2-1',
                children: [
                  { name: 'a-2-1-0' },
                  { name: 'a-2-1-1' },
                  { name: 'a-2-1-2' },
                  { name: 'a-2-1-3' },
                ],
              },
              { name: 'a-2-2' },
              { name: 'a-2-3' },
            ],
          },
        ],
      },
    ]

    jsonuri.mv(
      data,
      '0/children/2/children/1/children/1',
      '0/children/0',
      'before',
    )

    expect(data).toEqual([
      {
        name: 'a',
        children: [
          { name: 'a-2-1-1' },
          { name: 'a-0' },
          {
            name: 'a-1',
            children: [
              { name: 'a-1-0' },
              { name: 'a-1-1' },
              { name: 'a-1-2' },
              { name: 'a-1-3' },
            ],
          },
          {
            name: 'a-2',
            children: [
              { name: 'a-2-0' },
              {
                name: 'a-2-1',
                children: [
                  { name: 'a-2-1-0' },
                  { name: 'a-2-1-2' },
                  { name: 'a-2-1-3' },
                ],
              },
              { name: 'a-2-2' },
              { name: 'a-2-3' },
            ],
          },
        ],
      },
    ])

    const movedItem = jsonuri.get(data, '0/children/0')
    const sourceStillExists = jsonuri.get(
      data,
      '0/children/2/children/1/children/1',
    )

    expect(movedItem).toEqual({ name: 'a-2-1-1' })
    expect(sourceStillExists).toBeUndefined()
  })
})
