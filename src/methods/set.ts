import { THE_PARAMETER_IS_ILLEGAL, setValue, combingPathKey, isComplexPath, showError, toString } from '../util'

export default (data: any, path: string | number, value: any): void => {
  path = toString(path)
  if (!(data && path)) return showError(THE_PARAMETER_IS_ILLEGAL)
  if (!isComplexPath(path)) return setValue(data, path, value)

  const keys = combingPathKey({ path }).keys

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]

    if (data[key] == null) {
      data[key] = {}
    }
    if (i === len - 1) {
      setValue(data, key, value)
    } else {
      data = data[key]
    }
  }
}
