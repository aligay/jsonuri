
export const IS_NOT_A_NATURAL_NUMBER = 'is not a natural number'
export const MUST_BE_ARRAY = 'must be a Array'

export function noop () { /* noop */ }

export const isArray = Array.isArray

export function isString (s) {
  return typeof s === 'string'
}

function isInteger (n) {
  return typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
}

export function isNatural (n) {
  return isInteger(n) && n >= 0
}

const pathReg = /\//
export function isComplexPath (s) {
  return pathReg.test(s)
}

export function isObject (o) {
  // [^Undefined, Null, boolean, Number, String, Symbol]
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
  const type = typeof o
  return o != null && (type === 'object' || type === 'function')
}

export function showError (s) {
  console.error(s)
}

export function throwError (s) {
  throw new Error(s)
}
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
export function setValue (obj, key: string | number, value) {
  if (!isArray(obj)) {
    obj[key] = value
    return
  }
  const msg = 'must be a natural number'
  if (key === 'length') {
    if (!isNatural(value)) {
      showError(`value: ${value} ${msg}`)
      return
    }

    if (value > obj.length) {
      obj.length = value
      return
    }

    obj.splice(value)
    return
  }

  // if isArray, key should be a number
  let index: number = +key
  if (!isNatural(index)) {
    showError(`key: ${key} ${msg}`)
    return
  }

  obj.length = Math.max(obj.length, index)
  obj.splice(index, 1, value)
}

/**
 * 让数组的删除可被监听
 */
export function delValue (obj, key: string | number) {
  if (isArray(obj)) {
    let index: number = +key
    if (!isNatural(index)) return
    obj.splice(index, 1)
  } else {
    delete obj[key]
  }
}

/**
 * insertValue
 */
export function insertValue (arr: any[], key: number, value) {
  arr.splice(key, 0, value)
}

/**
 * Combing path keys
 * @author @linkjun
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
export interface CombingOptions {
  keys?: (string | null)[]
  path?: string
}

// let combingCache: any = {}
export function combingPathKey (param: CombingOptions): { keys: string[], path: string } {
  const path = param.path || ''
  // if (combingCache[path]) {
  //   return combingCache[path]
  // }
  let keys
  if (!param.keys) {
    keys = (param.path as string).split('/')
  } else if (!path) {
    keys = param.keys
  }
  keys = keys.filter(Boolean)

  // // 处理 a../,  ../b../ 此类错误路径 待优化
  // if (/\b\.\.+\/*/.test(keys.join(''))) {
  //   throw new Error(`error path ${path || keys.join('')}`)
  // }

  // {empty}
  while (~keys.indexOf('')) {
    let _i = keys.indexOf('')
    keys.splice(_i, 1)
  }

  // .
  while (~keys.indexOf('.')) {
    let _i = keys.indexOf('.')
    keys.splice(_i, 1)
  }

  // ..
  while (~keys.indexOf('..')) {
    let _i = keys.indexOf('..')
    keys[_i] = keys[_i - 1] = ''
    delete keys[_i]
    delete keys[_i - 1]
    keys.splice(_i, 1)
    keys.splice(_i - 1, 1)
  }
  const ret = {
    keys,
    path: keys.join('/')
  }

  return ret
}
