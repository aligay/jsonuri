import { THE_PARAMETER_IS_ILLEGAL, combingPathKey, isComplexPath, showError } from '../util'

export default function get (data: any, path: string | number): any {
  path = path + ''
  if (!data) {
    showError(THE_PARAMETER_IS_ILLEGAL)
    return data
  }

  if (path === '') return data
  if (!isComplexPath(path)) return data[path]

  let ret
  const keys = combingPathKey({ path }).keys

  if (!keys.length) {
    return data
  }

  const len = keys.length
  for (let i = 0; i < len; ++i) {
    ret = (ret || data)[keys[i]]
    if (ret == null) break
  }
  return ret
}
