import {
  NULL,
  THE_PARAMETER_IS_ILLEGAL,
  isComplexPath,
  setValue,
  showError,
  toString,
} from '../util'
import { parseUri } from './parseUri'

/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */
const isPrototypePolluted = (key: string): boolean =>
  ['__proto__', 'prototype', 'constructor'].includes(key)

export default <T = any>(
  data: T,
  path: string | number,
  value: any,
): undefined => {
  path = toString(path)

  if (!(data && path)) return showError(THE_PARAMETER_IS_ILLEGAL) as any

  if (!isComplexPath(path)) {
    setValue(data, path, value)
    return
  }

  const keys = parseUri(path)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]

    if (isPrototypePolluted(key)) continue

    if ((data as any)[key] == NULL) {
      ;(data as any)[key] = {}
    }
    if (i === len - 1) {
      setValue(data, key, value)
    } else {
      data = (data as any)[key]
    }
  }
}
