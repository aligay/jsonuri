import { THE_PARAMETER_IS_ILLEGAL, UNDEFINED, showError } from '../util'
import get from './get'
import set from './set'

export default <T = any>(
  data: T,
  pathA: string | number,
  pathB: string | number,
): T => {
  if (!data) return data
  const dataA = get(data, pathA)
  const dataB = get(data, pathB)

  if (dataA === UNDEFINED) {
    // null 会移动
    showError(THE_PARAMETER_IS_ILLEGAL)
    return data
  }

  set(data, pathB, dataA)
  set(data, pathA, dataB)

  return data
}
