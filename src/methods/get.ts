import { THE_PARAMETER_IS_ILLEGAL, combingPathKey, isComplexPath, showError, toString } from '../util'

export default (data: any, path: string | number): any => {
  path = toString(path)
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
    ret = (i ? ret : data)[keys[i]]
    if (ret == null) break
  }
  return ret
}
