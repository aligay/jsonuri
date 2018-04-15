import { isString, showError } from './util'
import get from './get'
import set from './set'

export default function swap (data, pathA: string, pathB: string) {
  if (!(data && pathA && pathB && isString(pathA) && isString(pathB))) return showError('参数不合法')

  const dataA = get(data, pathA)
  const dataB = get(data, pathB)
  set(data, pathB, dataA)
  set(data, pathA, dataB)
}
