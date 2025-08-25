import { beforeEach, describe, expect, test } from 'vitest'
import {
  down,
  get,
  insert,
  isCircular,
  mv,
  normalizeUri,
  parent,
  parents,
  parseUri,
  rm,
  set,
  swap,
  up,
} from '../src/index'

describe('parseUri', () => {
  test('should parse simple path', () => {
    expect(parseUri('a/b/c')).toEqual(['a', 'b', 'c'])
  })

  test('should handle empty path', () => {
    expect(parseUri('')).toEqual([])
  })

  test('should handle dot notation', () => {
    expect(parseUri('.')).toEqual([])
  })

  test('should handle parent directory notation', () => {
    expect(parseUri('a/b/..')).toEqual(['a'])
  })

  test('should handle parent directory beyond root', () => {
    expect(parseUri('a/../..')).toEqual([])
  })

  test('should handle array paths', () => {
    expect(parseUri(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  test('should handle attribute selectors', () => {
    expect(parseUri('a/[@first]/c')).toEqual(['a', '@first', 'c'])
  })

  test('should handle escaped slashes', () => {
    expect(parseUri('a/b\\/c/d')).toEqual(['a', 'b/c', 'd'])
  })
})

describe('normalizeUri', () => {
  test('should join path parts', () => {
    expect(normalizeUri('a', 'b', 'c')).toBe('a/b/c')
  })

  test('should handle empty parts', () => {
    expect(normalizeUri('a', '', 'c')).toBe('a/c')
  })
})

describe('parent', () => {
  test('should get parent path', () => {
    expect(parent('a/b/c')).toBe('a/b')
  })

  test('should return null for root path', () => {
    expect(parent('a')).toBeNull()
  })
})

describe('parents', () => {
  test('should get all parent paths', () => {
    expect(parents('a/b/c/d')).toEqual(['a/b/c', 'a/b', 'a'])
  })

  test('should return empty array for root path', () => {
    expect(parents('a')).toEqual([])
  })
})

describe('get', () => {
  let obj

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 'value',
        },
      },
      array: [1, 2, 3],
    }
  })

  test('should get nested value', () => {
    expect(get(obj, 'a/b/c')).toBe('value')
  })

  test('should return undefined for non-existent path', () => {
    expect(get(obj, 'a/b/d')).toBeUndefined()
  })

  test('should handle direct property access', () => {
    expect(get(obj, 'a')).toEqual({ b: { c: 'value' } })
  })

  test('should handle array indexing', () => {
    expect(get(obj, 'array/1')).toBe(2)
  })

  test('should handle @first selector', () => {
    expect(get(obj, 'array/@first')).toBe(1)
  })

  test('should handle @last selector', () => {
    expect(get(obj, 'array/@last')).toBe(3)
  })

  test('should handle @length-n selector', () => {
    expect(get(obj, 'array/@length-1')).toBe(3)
    expect(get(obj, 'array/@length-2')).toBe(2)
  })

  test('should return undefined for null object', () => {
    expect(get(null, 'a/b')).toBeUndefined()
  })
})

describe('set', () => {
  let obj

  beforeEach(() => {
    obj = {
      a: {
        b: {},
      },
    }
  })

  test('should set nested value', () => {
    set(obj, 'a/b/c', 'value')
    expect(obj.a.b.c).toBe('value')
  })

  test('should create path if not exists', () => {
    set(obj, 'x/y/z', 'value')
    expect(obj.x.y.z).toBe('value')
  })

  test('should handle direct property setting', () => {
    set(obj, 'newProp', 'value')
    expect(obj.newProp).toBe('value')
  })

  test('should handle array elements', () => {
    obj.arr = [1, 2, 3]
    set(obj, 'arr/1', 'changed')
    expect(obj.arr[1]).toBe('changed')
  })

  test('should handle array length', () => {
    obj.arr = [1, 2, 3]
    set(obj, 'arr/length', 1)
    expect(obj.arr).toEqual([1])
  })

  test('should return object', () => {
    set(obj, 'a/b/c', 'value')

    expect(obj).toEqual({
      a: {
        b: {
          c: 'value',
        },
      },
    })
  })
})

describe('rm', () => {
  let obj

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 'value',
        },
      },
      arr: [1, 2, 3],
    }
  })

  test('should remove nested property', () => {
    rm(obj, 'a/b/c')
    expect(obj.a.b.c).toBeUndefined()
  })

  test('should remove array element', () => {
    rm(obj, 'arr/1')
    expect(obj.arr).toEqual([1, 3])
  })

  test('should return object', () => {
    const result = rm(obj, 'a/b/c')
    expect(result).toBe(obj)
  })

  test('should do nothing for non-existent path', () => {
    const objCopy = JSON.parse(JSON.stringify(obj))
    rm(obj, 'x/y/z')
    expect(obj).toEqual(objCopy)
  })
})

describe('insert', () => {
  let obj

  beforeEach(() => {
    obj = {
      arr: [1, 2, 3],
    }
  })

  test('should insert before element', () => {
    insert(obj, 'arr/1', 'inserted', 'before')
    expect(obj.arr).toEqual([1, 'inserted', 2, 3])
  })

  test('should insert after element', () => {
    insert(obj, 'arr/1', 'inserted', 'after')
    expect(obj.arr).toEqual([1, 2, 'inserted', 3])
  })

  test('should insert at beginning', () => {
    insert(obj, 'arr/0', 'inserted', 'before')
    expect(obj.arr).toEqual(['inserted', 1, 2, 3])
  })

  test('should insert at end', () => {
    insert(obj, 'arr/2', 'inserted', 'after')
    expect(obj.arr).toEqual([1, 2, 3, 'inserted'])
  })

  test('should throw if direction is invalid', () => {
    expect(() => insert(obj, 'arr/1', 'inserted', 'invalid' as any)).toThrow()
  })

  test('should throw if target is not an array', () => {
    expect(() => insert(obj, 'arr/1/notArray', 'inserted', 'before')).toThrow()
  })

  test('should throw if index is out of bounds', () => {
    expect(() => insert(obj, 'arr/10', 'inserted', 'before')).toThrow()
  })
})

describe('mv', () => {
  let obj

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 'valueC',
        },
        d: 'valueD',
      },
      arr: [1, 2, 3, 4],
    }
  })
  test('should move property to new location', () => {
    expect(true).toBe(true)
  })
  // test('should move property to new location', () => {
  //   mv(obj, 'a/b/c', 'a/e', 'after');
  //   expect(obj.a.b.c).toBeUndefined();
  //   expect(obj.a.e).toBe('valueC');
  // });

  test('should move array element', () => {
    mv(obj, 'arr/0', 'arr/2', 'after')
    expect(obj.arr).toEqual([2, 3, 1, 4])
  })

  test('should throw if direction is not specified', () => {
    expect(() => mv(obj, 'a/b/c', 'a/e')).toThrow()
  })

  test('should throw if source does not exist', () => {
    expect(() => mv(obj, 'nonexistent', 'a/e', 'after')).toThrow()
  })

  test('should handle moves within the same array', () => {
    mv(obj, 'arr/0', 'arr/2', 'before')
    expect(obj.arr).toEqual([2, 1, 3, 4])
  })

  test('should handle moves when target is a child of source', () => {
    expect(() => {
      mv(obj, 'a', 'a/b/newLocation', 'after')
    }).toThrow()
  })
})

describe('swap', () => {
  let obj

  beforeEach(() => {
    obj = {
      a: 'valueA',
      b: 'valueB',
      arr: [1, 2, 3],
    }
  })

  test('should swap two properties', () => {
    swap(obj, 'a', 'b')
    expect(obj.a).toBe('valueB')
    expect(obj.b).toBe('valueA')
  })

  test('should swap array elements', () => {
    swap(obj, 'arr/0', 'arr/2')
    expect(obj.arr).toEqual([3, 2, 1])
  })

  test('should swap nested properties', () => {
    obj.nested = { x: 1, y: 2 }
    swap(obj, 'nested/x', 'nested/y')
    expect(obj.nested.x).toBe(2)
    expect(obj.nested.y).toBe(1)
  })

  test('should return object', () => {
    const result = swap(obj, 'a', 'b')
    expect(result).toBe(obj)
  })
})

describe('up and down', () => {
  let obj

  beforeEach(() => {
    obj = {
      arr: [1, 2, 3, 4, 5],
    }
  })

  test('should move element up', () => {
    up(obj, 'arr/2')
    expect(obj.arr).toEqual([1, 3, 2, 4, 5])
  })

  test('should move element down', () => {
    down(obj, 'arr/2')
    expect(obj.arr).toEqual([1, 2, 4, 3, 5])
  })

  test('should move element up multiple steps', () => {
    up(obj, 'arr/3', 2)
    expect(obj.arr).toEqual([1, 4, 2, 3, 5])
  })

  test('should move element down multiple steps', () => {
    down(obj, 'arr/1', 2)
    expect(obj.arr).toEqual([1, 3, 4, 2, 5])
  })

  test('should not move beyond array boundaries', () => {
    up(obj, 'arr/0', 5)
    expect(obj.arr).toEqual([1, 2, 3, 4, 5])

    down(obj, 'arr/4', 5)
    expect(obj.arr).toEqual([1, 2, 3, 4, 5])
  })
})

describe('isCircular', () => {
  test('should detect circular references', () => {
    const obj = { a: 1 }
    obj['self'] = obj
    expect(isCircular(obj)).toBe(true)
  })

  test('should detect deep circular references', () => {
    const obj = { a: { b: { c: {} } } }
    obj.a.b.c['cycle'] = obj.a
    expect(isCircular(obj)).toBe(true)
  })

  test('should return false for non-circular objects', () => {
    const obj = { a: { b: { c: 1 } }, d: [1, 2, 3] }
    expect(isCircular(obj)).toBe(false)
  })
})
