import { THE_PARAMETER_IS_ILLEGAL, DIRECTION_REQUIRED, isString, isObject, isArray, showError, delValue, combingPathKey } from './util'
import get from './get'
import set from './set'
import rm from './rm'
import insert from './insert'
import normalizePath from './normalizePath'

export default function mv (data, from: string | number, to: string | number, direction: 'before' | 'after' | 'append') {
  from = from + ''
  to = to + ''

  if (!(data && from && to && isString(from) && isString(to))) return showError(THE_PARAMETER_IS_ILLEGAL)
  if (from === to) return

  const DataTo = get(data, to)
  const dataFrom = get(data, from)
  const parentTo = get(data, to + '/..')
  const fromIndex: number = +(combingPathKey({ path: from }).keys.pop() || '')
  const toIndex: number = +(combingPathKey({ path: to }).keys.pop() || '')

  if (isArray(parentTo)) {
    if (!direction) throw new Error(DIRECTION_REQUIRED)
    const isInSameArray = normalizePath(from + '/..') === normalizePath(to + '/..')

    insert(data, to, dataFrom, direction)
    if (isInSameArray) {
      delValue(parentTo, fromIndex + (toIndex > fromIndex ? 0 : 1))
      return
    }

    rm(data, from)

    return
  }

  if (!isObject(DataTo)) {
    throw new Error(`'${to}': ${DataTo} is primitive values`)
  }

  set(data, to + '/' + from, dataFrom)
  rm(data, from)
}
