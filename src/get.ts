import normalizePath from './normalizePath'
import { isString, throwError } from './util'
export default function get (data, path: string): any {
  if (!(data && isString(path))) return

  path = normalizePath(path)
  let ret
  const p = path.split('/')
  const len = p.length
  let i = 0
  for (; i < len; ++i) {
    ret = (ret || data)[p[i]]
    if (ret == null) break
  }
  return ret
}
