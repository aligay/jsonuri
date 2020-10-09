import { isString, isArray, isComplexPath, combingPathKey, delValue } from './util'
import get from './get'
import { debug } from 'util';

export default function rm (data: any, path: string): void {
  if (!(data && path && isString(path))) return
  if (!isComplexPath(path)) {
    delValue(data, path)
    return
  }

  let parent = get(data, path + '/..')
  if (!parent) return
  let key = combingPathKey({ path }).keys.pop() || ''

  delValue(parent, key)
}

// let arr = [1, 2, 3]
// debugger
// rm(arr, '1')
// console.log(arr)
