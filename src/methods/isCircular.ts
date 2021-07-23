import { isObject } from '../util'

// check circular obj
const isCircular = (obj: any, _seen: any[] = []): boolean => {
  if (!isObject(obj)) {
    return false
  }

  _seen.push(obj)

  for (const key in obj) {
    /* eslint-disable-next-line */
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
