import { isComplexPath, combingPathKey, delValue, toString } from '../util'
import get from './get'

export default (data: any, path: string | number): void => {
  path = toString(path)
  if (!(data && path)) return
  if (!isComplexPath(path)) {
    delValue(data, path)
    return
  }

  const parent = get(data, path + '/..')
  if (!parent) return
  const key = combingPathKey({ path }).keys.pop() ?? ''

  delValue(parent, key)
}
