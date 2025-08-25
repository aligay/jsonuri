import {
  delValue,
  insertValue,
  isArray,
  isNatural,
  MUST_BE_ARRAY,
  showError,
  THE_PARAMETER_IS_ILLEGAL,
  toString,
} from '../util'
import get from './get'
import { parent } from './parents'
import { parseUri } from './parseUri'

const upDown = (
  data: any,
  path: string | number,
  direction: 1 | -1,
  gap = 1,
) => {
  path = toString(path)
  if (!(isNatural(gap) && gap > 0)) {
    showError(THE_PARAMETER_IS_ILLEGAL)
    return
  }
  if (!data) {
    showError(THE_PARAMETER_IS_ILLEGAL)
    return
  }

  // 找不到父级，就返回本身
  const parentPath = parent(path)
  const parentData = parentPath ? get(data, parentPath) : data

  if (!isArray(parentData)) {
    showError(MUST_BE_ARRAY)
    return
  }
  const len = parentData.length
  const fromIndex = +(parseUri(path).pop() as string)

  if (!isNatural(fromIndex) || fromIndex > len - 1) return
  let toIndex = fromIndex + direction * gap

  if (toIndex <= 0) toIndex = 0
  if (toIndex > len - 1) toIndex = len - 1

  if (toIndex === fromIndex) return

  const fromData = parentData[fromIndex]

  // console.log('toIndex', toIndex)
  // console.log('fromIndex', fromIndex)
  // console.log('fromData', fromData)
  // console.log('parentData', parentData)

  delValue(parentData, fromIndex)

  // console.log('parentData2', parentData)
  if (direction === -1) {
    insertValue(parentData, toIndex, fromData, 'before')
    return data
  }
  insertValue(parentData, toIndex - 1, fromData, 'after')
  return data
}

export const up = (data: any, path: string | number, gap?: number): void => {
  return upDown(data, path, -1, gap)
}

export const down = (data: any, path: string | number, gap?: number): void => {
  return upDown(data, path, 1, gap)
}
