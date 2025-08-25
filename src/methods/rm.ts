import { delValue, isComplexPath, NULL, toString, UNDEFINED } from '../util'
import get from './get'
import { parseUri } from './parseUri'

export default <T = any>(data: T, path?: string | number): T => {
  if (path == NULL) return data

  path = toString(path)
  if (!(data && path)) return data
  if (!isComplexPath(path)) {
    delValue(data, path)
    return data
  }

  const parent = get(data, path + '/..')
  if (parent === UNDEFINED) return data
  const key = parseUri(path).pop() ?? ''

  delValue(parent, key)
  return data
}
