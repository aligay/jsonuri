import { isString, isArray, isObject, setValue, showError } from './util'
import get from './get'
import set from './set'
import rm from './rm'

export default function mv (data, from: string, to: string) {
  if (!(data && from && to && isString(from) && isString(to))) return showError('参数不合法')
  const DataTo = get(data, to)
  if (!isObject(DataTo)) {
    throw new Error(`'${to}': ${DataTo} is primitive values`)
  }
  const dataFrom = get(data, from)

  set(data, to + '/' + from, dataFrom)
  rm(data, from)
}
