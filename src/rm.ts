import { isString, isArray, isComplexPath, combingPathKey, delValue } from './util'
import get from './get'

export default function rm (data: any, path: string) {
  if (!(data && path && isString(path))) return
  if (!isComplexPath(path)) {
    delValue(data, path)
  }

  let parent = get(data, path + '/..')
  if (!parent) return
  let key = combingPathKey({ path }).keys.pop() || ''

  delValue(parent, key)
}
