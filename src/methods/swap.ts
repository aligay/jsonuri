import { THE_PARAMETER_IS_ILLEGAL, showError, isString, toString } from '../util'
import get from './get'
import set from './set'

export default (data, pathA: string | number, pathB: string | number): void => {
  pathA = toString(pathA)
  pathB = toString(pathB)
  if (!(data && pathA && pathB && isString(pathA) && isString(pathB))) { showError(THE_PARAMETER_IS_ILLEGAL); return }

  const dataA = get(data, pathA)
  const dataB = get(data, pathB)
  set(data, pathB, dataA)
  set(data, pathA, dataB)
}
