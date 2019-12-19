import { isObject } from '../util'

// check circular obj
const isCircular = (obj: any, _seen: any[] = []) => {
  if (!isObject(obj)) {
    return false
  }

  _seen.push(obj)

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key]
      if (isObject(val)) {
        if (~_seen.indexOf(val) || isCircular(val, _seen.slice())) {
          return true
        }
      }
    }
  }

  return false
}

export default isCircular
