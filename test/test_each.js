'use strict'
// const jsonuri = require('../dist/index')
//
// {get, set, rm, swap, mv, up, down, insert, walk, normalizePath}
module.exports = function (jsonuri) {
  /**
   * jsonuri.get
   */
  describe('get', () => {
    const obj = {
      a: 2,
      b: {
        b1: {
          b11: 311,
          b12: 312
        },
        b2: 32
      },
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      NULL: null
    }

    it('object path', () => {
      expect(jsonuri.get(obj, 'b/b1/b11')).toEqual(311)
      expect(jsonuri.get(obj, '/b/b1/b11')).toEqual(311)
      expect(jsonuri.get(obj, '/b/b1/////b11')).toEqual(311)
      expect(jsonuri.get(obj, '/b/b1/b11/')).toEqual(311)
      expect(jsonuri.get(obj, 'b/b1/b11/../')).toEqual({b11: 311, b12: 312})
      expect(jsonuri.get(obj, 'b/b1/b11/../../b2/')).toEqual(32)
      expect(jsonuri.get(obj, 'b/b1/b11/../../b2')).toEqual(32)
    })

    it('array path', () => {
      expect(jsonuri.get(obj, 'list/2')).toEqual(2)
      expect(jsonuri.get(obj, 'list/100')).not.toBeDefined()
      expect(jsonuri.get(obj, 'list/-1')).not.toBeDefined()
    })

    it('error path', () => {
      expect(jsonuri.get(obj, 'oo/xx/yy/zz')).not.toBeDefined()
    })

    it('return null', () => {
      expect(jsonuri.get(obj, 'NULL')).toBeNull()
    })

    it('bad arg', () => {
      expect(jsonuri.get(obj, {foo: 'bar'})).not.toBeDefined()
    })
  })

  /**
   * jsonuri.set
   */
  describe('set', () => {
    let obj
    beforeEach(() => {
      obj = {}
    })
    it('set string', () => {
      jsonuri.set(obj, '/a', '10')
      expect(obj).toEqual({a: '10'})
    })

    it('set object', () => {
      jsonuri.set(obj, '/a/b/c', {foo: 'bar', bar: 'baz'})
      expect(obj).toEqual({a: {b: {c: {bar: 'baz', foo: 'bar'}}}})
      jsonuri.set(obj, '/a/b/c/', {foo: 'bar', bar: 'baz'})
      expect(obj).toEqual({a: {b: {c: {bar: 'baz', foo: 'bar'}}}})
    })

    it('set object', () => {
      jsonuri.set(obj, '/a', {foo: 'bar', bar: 'baz'})
      expect(obj).toEqual({a: {bar: 'baz', foo: 'bar'}})
    })

    it('set array', () => {
      jsonuri.set(obj, '/a/b/5', 10)
      expect(obj, {a: {b: [undefined, undefined, undefined, undefined, 10]}})
    })

    it('set array error path', () => { // bad
      jsonuri.set(obj, '/a/b/-1', 10)
      expect(JSON.parse(JSON.stringify(obj))).toEqual({a: {b: []}})
    })
  })

  /**
   * jsonuri.rm
   */
  describe('rm', () => {
    let obj
    beforeEach(() => {
      obj = {
        a: 2,
        b: {
          b1: {
            b11: 311,
            b12: 312
          },
          b2: 32
        },
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        NULL: null
      }
    })

    it('object', () => {
      let ret = jsonuri.rm(obj, '/b')
      // expect(ret).toEqual(true)
      expect(obj).toEqual({a: 2, list: [0, 1, 2, 3, 4, 5, 6, 7, 8], NULL: null})
    })

    it('array will change index', () => {
      jsonuri.rm(obj, 'list/1')
      expect(obj).toEqual({a: 2, b: {b1: {b11: 311, b12: 312}, b2: 32}, list: [0, 2, 3, 4, 5, 6, 7, 8], NULL: null})
    })

    // it('array will keep index if has third arg', () => {
    //   jsonuri.rm(obj, 'list/1', {keepIndex: true})
    //   expect(obj).toEqual({a: 2, list: [0, undefined, 2, 3, 4, 5, 6, 7, 8], NULL: null})
    // })
  })

  /**
   * jsonuri.swap
   */
  describe('swap', () => {
    let arr
    beforeEach(() => {
      arr = [0, 1, 2, 3, 4, 5, 6]
    })
    it('normal', () => {
      jsonuri.swap(arr, '/1/', '/3/')
      expect(arr).toEqual([0, 3, 2, 1, 4, 5, 6])
    })

    it('when index out of range', () => {
      jsonuri.swap(arr, '1', '999')
      expect(arr).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    it('when index out of range', () => {
      jsonuri.swap(arr, '/-1', '/3')
      expect(arr).toEqual([0, 1, 2, 3, 4, 5, 6])
    })
  })

  /**
   * jsonuri.mv
   */
  describe('mv', () => {
    let arr, obj
    beforeEach(() => {
      arr = [0, 1, 2, 3, 4, 5, 6]
    })

    it('mv', () => {
      jsonuri.mv(arr, '/1/', '/3/')
      expect(arr).toEqual([0, 2, 3, 1, 4, 5, 6])
    })
    // TODO 越界
  })

  /**
   * jsonuri.up && jsonuri.down
   */
  describe('up and down', () => {
    let arr
    beforeEach(() => {
      arr = [0, 1, 2, 3, 4, 5, 6]
    })

    it('up', () => {
      jsonuri.up(arr, '/1/')
      expect(arr).toEqual([1, 0, 2, 3, 4, 5, 6])
    })
    it('up', () => {
      jsonuri.up(arr, '/0/')
      expect(arr).toEqual([0, 1, 2, 3, 4, 5, 6])
    })
    it('up', () => {
      jsonuri.up(arr, '/-1/')
      expect(arr).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    it('down', () => {
      jsonuri.down(arr, '/1/')
      expect(arr).toEqual([0, 2, 1, 3, 4, 5, 6])
    })
    it('down', () => {
      jsonuri.down(arr, '/6/')
      expect(arr).toEqual([0, 1, 2, 3, 4, 5, 6])
    })
    it('down', () => {
      jsonuri.down(arr, '/9999/')
      expect(arr).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    it('bad args do nothing', () => {
      jsonuri.up({}, '/a/')
    })
  })

  /**
   * jsonuri.insert
   */
  describe('insert', () => {
    let arr
    beforeEach(() => {
      arr = [0, 1, 2, 3]
    })
    const afterRet = [0, 1, 'hello kitty', 2, 3]

    it('insert default', () => {
      jsonuri.insert(arr, '/1/', 'hello kitty')
      expect(arr).toEqual(afterRet)
    })

    it('insert after', () => {
      jsonuri.insert(arr, '/1/', 'hello kitty', 'after')
      expect(arr).toEqual(afterRet)
    })

    it('insert before', () => {
      jsonuri.insert(arr, '/1/', 'hello kitty', 'before')
      expect(arr).toEqual([0, 'hello kitty', 1, 2, 3])
    })

    it('out of range', () => {
      jsonuri.insert(arr, '/-100/', 'hello kitty')
      expect(arr).toEqual(['hello kitty', 0, 1, 2, 3])
    })
    it('out of range', () => {
      jsonuri.insert(arr, '/999/', 'hello kitty')
      expect(arr).toEqual([0, 1, 2, 3, 'hello kitty'])
    })
  })

  /**
   * jsonuri.normalizePath
   */
  describe('jsonuri.normalizePath', () => {
    const n = jsonuri.normalizePath
    expect(n('a/b/c')).toEqual('/a/b/c/')
    expect(n('a/b/../')).toEqual('/a/')
    expect(n('a/./')).toEqual('/a/')
    expect(n(['a/b', 'c'])).toEqual('/a/b/c/')
    expect(n(['a/b', 'c'], 'd', 'e', '../')).toEqual('/a/b/c/d/')
  })

  /**
   * jsonuri.walk
   */
  describe('jsonuri.walk', () => {
    const w = jsonuri.walk
    let obj, emp
    beforeEach(() => {
      obj = {
        a: 2,
        b: {
          b1: {
            b11: 311,
            b12: 312
          },
          b2: 32
        },
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        NULL: null
      }
      emp = {}
    })
    w(emp, (val, key, parent, more) => {
      console.log(val)
    })
  })

  describe('bad args', () => {
    //it('{}', () => {
    //  expect(safeTrim({})).toEqual('[object Object]')
    //})
    //
    //it('[]', () => {
    //  expect(safeTrim([])).toEqual('')
    //})
    //
    //it('NaN', () => {
    //  expect(safeTrim(NaN)).toEqual('NaN')
    //})
    //
    //it('undefined', () => {
    //  expect(safeTrim(undefined)).toEqual('undefined')
    //})
    //
    //it('null', () => {
    //  expect(safeTrim(null)).toEqual('null')
    //})
    //
    //it('0', () => {
    //  expect(safeTrim(0)).toEqual('0')
    //})
    //
    //it('function', () => {
    //  let fun = () => {}
    //  let ret = safeTrim(fun)
    //  expect(ret).toEqual(String(fun))
    //})
  })
}
