import { isString, combingPathKey, isArray, isComplexPath } from './util'

function setValue (obj, key, value) {
  if (isArray(obj)) {
    //
  } else {
    obj[key] = value
  }
}
export default function set (data: any, path: string, value: any): void {
  if (!(data && path && isString(path))) return
  if (!isComplexPath(path)) return setValue(data, path, value)

  const keys = combingPathKey({ path }).keys

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    data[key] = data[key] || {}
    if (i === len - 1) {
      setValue(data, key, value)
    } else {
      data = data[key]
    }
  }

  debugger
}
