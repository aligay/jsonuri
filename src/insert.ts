import { isString, isArray, combingPathKey, isNatural, showError, IS_NOT_A_NATURAL_NUMBER, throwError } from './util'
import get from './get'

export default function insert (data, path: string, value: any, direction: 'before' | 'after' = 'after') {
  if (!(data && isString(path))) return

  const parent = get(data, path + '/..')
  if (!isArray(parent)) throw new Error(`insert node must be a Array`)

  const index = +(combingPathKey({ path }).keys.pop() || '')

  let toIndex = index

  if (direction === 'after') {
    toIndex = index + 1
  } else {
    toIndex = Math.max(0, index)
  }

  parent.splice(toIndex, 0, value)
}
