import { THE_PARAMETER_IS_ILLEGAL, DIRECTION_REQUIRED, MUST_BE_ARRAY, isString, isArray, combingPathKey, insertValue, showError } from './util'
import get from './get'

export default function insert (data, path: string | number, value: any, direction: 'before' | 'after' | 'append') {
  path = path + ''
  if (!(data && isString(path))) return showError(THE_PARAMETER_IS_ILLEGAL)
  if (!direction) throw new Error(DIRECTION_REQUIRED)

  const parent = get(data, path + '/..')
  if (!isArray(parent)) throw new Error(`insert node ${MUST_BE_ARRAY}`)

  const index = +(combingPathKey({ path }).keys.pop() || '')

  let toIndex = index

  if (direction === 'after') {
    toIndex = index + 1
  } else if (direction === 'before') {
    toIndex = index
  } else if (direction === 'append') {
    // TODO
  }
  insertValue(parent, toIndex, value)
}
