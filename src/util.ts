
export const IS_NOT_A_NATURAL_NUMBER = 'is not a natural number'
export const MUST_BE_ARRAY = 'must be a Array'
export const THE_PARAMETER_IS_ILLEGAL = 'the parameter is illegal'
export const DIRECTION_REQUIRED = `direction must be 'before' | 'after' | 'append'`
export const THE_INDEX_OUT_OF_BOUNDS = 'the Index Out of Bounds'

export const noop = () => { /* noop */ }

export const isArray = Array.isArray

export const isString = (s) => {
  return typeof s === 'string'
}

export const isInteger = (n) => {
  return Number.isInteger(n) // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
}

export const isNatural = (n) => {
  return isInteger(n) && n >= 0
}

const pathReg = /\//
export const isComplexPath = (s) => {
  return pathReg.test(s)
}

export const isObject = (o) => {
  // [^Undefined, Null, boolean, Number, String, Symbol]
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
  const type = typeof o
  return o != null && (type === 'object' || type === 'function')
}

export const toString = (s) => {
  return s + ''
}

export const showError = (s) => {
  console.error(s)
}

export const throwError = (s) => {
  throw new Error(s)
}
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
export const setValue = (obj, key: string | number, value) => {
  if (!isArray(obj)) {
    obj[key] = value
    return
  }

  if (key === 'length') {
    if (!isNatural(value)) throw new Error(`value: ${value} ${IS_NOT_A_NATURAL_NUMBER}`)

    if (value > obj.length) obj.length = value

    obj.splice(value)
    return
  }

  // if isArray, key should be a number
  let index: number = +key
  if (!isNatural(index)) {
    showError(`key: ${key} ${IS_NOT_A_NATURAL_NUMBER}`)
    return
  }

  obj.length = Math.max(obj.length, index)
  obj.splice(index, 1, value)
}

/**
 * 让数组的删除可被监听
 */
export const delValue = (obj, key: string | number) => {
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
export const insertValue = (arr: any[], key: number, value, direction: 'before' | 'after' | 'append' = 'after') => {
  if (key < 0 || key > arr.length) throw new Error(THE_INDEX_OUT_OF_BOUNDS)
  switch (direction) {
    case 'before':
      key = key - 1
      break
    case 'append':
      showError('TODO')
  }

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
const REG_PATH_SPLIT = '/'
// let combingCache: any = {}
export const combingPathKey = (param: CombingOptions): { keys: string[], path: string } => {
  const path = param.path || ''
  // if (combingCache[path]) {
  //   return combingCache[path]
  // }
  let keys
  if (!param.keys) {
    keys = (param.path as string).split(REG_PATH_SPLIT)
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
    path: keys.join(REG_PATH_SPLIT)
  }

  return ret
}
