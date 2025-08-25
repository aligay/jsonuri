import { isArray, isComplexPath, isString, NULL, UNDEFINED } from '../util'
import { parseUri, type UriSegment } from './parseUri'

// "a/b/c" => ['a', 'b', 'c']
// type SplitPath<S extends string> = S extends `${infer Head}/${infer Rest}`
//   ? [Head, ...SplitPath<Rest>]
//   : [S]

// TS 工具类型：从类型 T 按路径数组 P 获取结果类型
// type GetPathValue<T, P extends readonly any[]> = P extends [
//   infer Head,
//   ...infer Rest,
// ]
//   ? Head extends keyof T
//     ? GetPathValue<T[Head], Rest>
//     : T extends readonly any[]
//       ? Head extends `${number}` | number
//         ? GetPathValue<T[number], Rest>
//         : undefined
//       : undefined
//   : T

// export default function get<T, P extends string>(data: any, path: P): GetPathValue<T, SplitPath<P>>
// export default function get<T, P extends UriSegment>(data: any, path: P): any

export default function get<T = any>(data: any, path: UriSegment): T {
  if (path === '/') return data
  if (path === '') return UNDEFINED
  if (data == NULL) return UNDEFINED
  if (!isComplexPath(path)) return data[path as string]

  const keys = parseUri(path)
  if (keys.length === 0) return UNDEFINED

  let current = data

  for (const key of keys) {
    if (isString(key) && key.startsWith('@')) {
      const expr = key.slice(1)

      if (!isArray(current)) return UNDEFINED
      if (expr === 'first') current = current[0]
      else if (expr === 'last' || expr === 'length-1')
        current = current[current.length - 1]
      else if (/^length-(\d+)$/.test(expr)) {
        const offset = parseInt(expr.split('-')[1])
        const index = current.length - offset
        current = current[index]
      } else {
        return UNDEFINED
      }
    } else {
      if (current == NULL) return current
      current = current[key as keyof typeof current]
    }
  }
  return current as T
}
