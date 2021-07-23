import { THE_PARAMETER_IS_ILLEGAL, setValue, combingPathKey, isComplexPath, showError, toString } from '../util'

/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */
const isPrototypePolluted = (key: string): Boolean => ['__proto__', 'prototype', 'constructor'].includes(key)

export default (data: any, path: string | number, value: any): void => {
  path = toString(path)
  if (!(data && path)) return showError(THE_PARAMETER_IS_ILLEGAL)
  if (!isComplexPath(path)) return setValue(data, path, value)

  const keys = combingPathKey({ path }).keys

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]

    if (isPrototypePolluted(key)) continue

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
