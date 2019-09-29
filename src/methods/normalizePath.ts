const arrPro = Array.prototype
import { combingPathKey } from '../util'

export default (...path): string => {
  const pathArr: (string | null)[] = arrPro.concat.apply(arrPro, path).join('/').split('/')
  const pathStr: string = combingPathKey({ keys: pathArr }).path

  return pathStr
}
