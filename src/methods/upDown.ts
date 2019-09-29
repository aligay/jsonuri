import { THE_PARAMETER_IS_ILLEGAL, isArray, MUST_BE_ARRAY, showError, combingPathKey, isNatural, delValue, insertValue, toString } from '../util'
import get from './get'

const upDown = (data, path, direction: 1 | -1, gap = 1) => {
  path = toString(path)
  if (!(isNatural(gap) && gap > 0)) return showError(THE_PARAMETER_IS_ILLEGAL)
  if (!(data)) return showError(THE_PARAMETER_IS_ILLEGAL)

  const parent = get(data, path + '/..')
  if (!isArray(parent)) return showError(MUST_BE_ARRAY)
  const len = parent.length
  const index = +(combingPathKey({ path }).keys.pop() as string)
  if (!isNatural(index) || index > len - 1) return
  let toIndex = index + direction * gap
  if (toIndex <= 0) toIndex = 0
  if (toIndex > len - 1) toIndex = len - 1

  const fromData = parent[index]
  delValue(parent, index)
  insertValue(parent, toIndex, fromData)
}

export const up = (data, path: string | number, gap?: number): void => {
  upDown(data, path, -1, gap)
}

export const down = (data, path: string | number, gap?: number): void => {
  upDown(data, path, 1, gap)
}
