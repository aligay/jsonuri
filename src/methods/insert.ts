import { THE_PARAMETER_IS_ILLEGAL, DIRECTION_REQUIRED, MUST_BE_ARRAY, isArray, combingPathKey, insertValue, showError, toString } from '../util'
import get from './get'

export default (data, path: string | number, value: any, direction: 'before' | 'after' | 'append'): void => {
  path = toString(path)
  if (!data) { showError(THE_PARAMETER_IS_ILLEGAL); return }
  if (!direction) throw new Error(DIRECTION_REQUIRED)

  const parent = get(data, path + '/..')
  if (!isArray(parent)) throw new Error(`insert node ${MUST_BE_ARRAY}`)

  const index = +(combingPathKey({ path }).keys.pop() as string)

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
