import { THE_PARAMETER_IS_ILLEGAL, DIRECTION_REQUIRED, isObject, isArray, isString, showError, delValue, combingPathKey, toString } from '../util'
import get from './get'
import set from './set'
import rm from './rm'
import insert from './insert'
import normalizePath from './normalizePath'

const formPathIsPartOfToParentPath = (from: string, to: string) => {
  const pathTo = to.split('/')
  const pathFrom = from.split('/')
  const parentPathTo = pathTo.slice(0, pathTo.length - 1)
  const parentPathForm = pathFrom.slice(0, pathTo.length - 1)

  if (pathTo.length > pathFrom.length) return false

  return parentPathTo.join('/') === parentPathForm.join('/')
}

export default (data, from: string | number, to: string | number, direction: 'before' | 'after' | 'append'): void => {
  from = toString(from)
  to = toString(to)

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

    if (isInSameArray) {
      insert(data, to, dataFrom, direction)
      delValue(parentTo, fromIndex + (toIndex > fromIndex ? 0 : 1))
      return
    }

    const isParentInSameArray = formPathIsPartOfToParentPath(from, to)

    if (isParentInSameArray) {
      const _fromIndex = +(from.split('/').slice(0, to.split('/').length).pop() || '')
      if (toIndex < _fromIndex) {
        // 如果把 from 插入 to 位置后，改变了原来 from 的位置，则要先删除后添加
        rm(data, from)
        insert(data, to, dataFrom, direction)
        return
      }
    }

    insert(data, to, dataFrom, direction)
    rm(data, from)

    return
  }

  if (!isObject(DataTo)) {
    throw new Error(`'${to}': ${DataTo} is primitive values`)
  }

  set(data, to + '/' + from, dataFrom)
  rm(data, from)
}
