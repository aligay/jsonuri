import { THE_PARAMETER_IS_ILLEGAL, setValue, combingPathKey, isComplexPath, showError, toString } from '../util'

/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */
const isPrototypePolluted = (key: string): boolean => ['__proto__', 'prototype', 'constructor'].includes(key)

export default <T = any>(data: T, path: string | number, value: any): T => {
  path = toString(path)
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  if (!(data && path)) return showError(THE_PARAMETER_IS_ILLEGAL) as any
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  if (!isComplexPath(path)) return setValue(data, path, value) as any

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
  return data
}
