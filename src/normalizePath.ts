const arrPro = Array.prototype
import { combingPathKey } from './util'

export default function normalizePath (...path): string {
  const pathArr: (string | null)[] = arrPro.concat.apply(Array.prototype, path).join('/').split('/')
  const pathStr: string = combingPathKey({ keys: pathArr }).path

  return pathStr
}
