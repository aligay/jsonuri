import { combingPathKey } from '../util'
const arrPro = Array.prototype

export default (...path): string => {
  const pathArr: Array<string | null> = arrPro.concat.apply(arrPro, path).join('/').split('/')
  const pathStr: string = combingPathKey({ keys: pathArr }).path

  return pathStr
}
