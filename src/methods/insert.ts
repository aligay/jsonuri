import {
  DIRECTION_REQUIRED,
  type Direction,
  MUST_BE_ARRAY,
  THE_PARAMETER_IS_ILLEGAL,
  insertValue,
  isArray,
  showError,
  toString,
} from '../util'
import get from './get'
import { parent } from './parents'
import { parseUri } from './parseUri'

export default (
  data: any,
  path: string | number,
  value: any,
  direction: Direction = 'before',
): void => {
  path = toString(path)
  if (!data) {
    showError(THE_PARAMETER_IS_ILLEGAL)
    return
  }
  if (!direction) throw new Error(DIRECTION_REQUIRED)

  const parentPath = parent(path)
  const parentData = parentPath ? get(data, parentPath) : data

  if (!isArray(parentData)) throw new Error(`insert node ${MUST_BE_ARRAY}`)

  const index = +(parseUri(path).pop() as string)

  let toIndex = index

  insertValue(parentData, toIndex, value, direction)
}
