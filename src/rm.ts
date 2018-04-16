import { isComplexPath, combingPathKey, delValue } from './util'
import get from './get'

export default function rm (data: any, path: string | number): void {
  path = path + ''
  if (!(data && path)) return
  if (!isComplexPath(path)) {
    delValue(data, path)
    return
  }

  let parent = get(data, path + '/..')
  if (!parent) return
  let key = combingPathKey({ path }).keys.pop() || ''

  delValue(parent, key)
}
