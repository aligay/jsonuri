import { combingPathKey, isString, throwError, isComplexPath } from './util'

export default function get (data: any, path: string): any {
  if (!(data && isString(path))) return
  if (!isComplexPath(path)) return data.path

  let ret
  const keys = combingPathKey({ path }).keys
  const len = keys.length
  let i = 0
  for (; i < len; ++i) {
    ret = (ret || data)[keys[i]]
    if (ret == null) break
  }
  return ret
}
