import { isString, isArray, MUST_BE_ARRAY, showError, combingPathKey, isNatural , delValue, insertValue } from './util'
import get from './get'

function upDown (data, path, direction: 1 | -1, gap = 1) {
  if (!(isNatural(gap) && gap > 0)) return
  if (!(data && isString(path))) return

  const parent = get(data, path + '/..')
  if (!isArray(parent)) return showError(MUST_BE_ARRAY)
  const len = parent.length
  const index = +(combingPathKey({ path }).keys.pop() || '')
  if (!isNatural(index) || index > len - 1) return
  let toIndex = index + direction * gap
  if (toIndex <= 0) toIndex = 0

  const fromData = parent[index]
  delValue(parent, index)
  insertValue(parent, toIndex, fromData)
}

export function up (data, path, gap?) {
  upDown(data, path, -1, gap)
}

export function down (data, path, gap?) {
  upDown(data, path, 1, gap)
}
