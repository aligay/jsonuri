import { isObject } from '../util'

// check circular obj
const isCircular = (obj, seen: any[] = []): boolean => {
  if (!isObject(obj)) {
    return false
  }

  seen.push(obj)

  for (const key in obj) {
    const val = obj[key]
    if (isObject(val)) {
      if (~seen.indexOf(val) || isCircular(val, seen.slice())) {
        return true
      }
    }
  }

  return false
}

export default isCircular
