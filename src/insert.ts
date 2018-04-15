import { isString, isArray, combingPathKey, insertValue, MUST_BE_ARRAY } from './util'
import get from './get'

export default function insert (data, path: string, value: any, direction: 'before' | 'after' = 'after') {
  if (!(data && isString(path))) return

  const parent = get(data, path + '/..')
  if (!isArray(parent)) throw new Error(`insert node ${MUST_BE_ARRAY}`)

  const index = +(combingPathKey({ path }).keys.pop() || '')

  let toIndex = index

  if (direction === 'after') {
    toIndex = index + 1
  } else {
    toIndex = Math.max(0, index)
  }
  insertValue(parent, toIndex, value)
}
