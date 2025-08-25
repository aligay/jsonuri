import { isArray } from '../util'
export type UriSegment =
  | string
  | number
  | (string | number | (string | number)[])[]
export function parseUri(path: UriSegment): string[] {
  const segments: string[] = []
  let invalid = false

  function process(part: UriSegment) {
    if (invalid) return // 提前终止处理

    if (isArray(part)) {
      for (const p of part) {
        process(p)
        if (invalid) return // 提前退出嵌套
      }
    } else if (part === '' || part === '.') {
      return
    } else if (part === '..') {
      if (segments.length > 0) {
        segments.pop()
      } else {
        invalid = true
        return
      }
    } else {
      // 支持 a/b/c 分裂成 ['a', 'b', 'c']，转义 /\/ 跳过
      const split = `${part}`
        .split(/(?<!\\)\//)
        .map((s) => s.replace(/\\\//g, '/'))
      for (const s of split) {
        if (s === '' || s === '.') continue
        if (s === '..') {
          if (segments.length > 0) {
            segments.pop()
          } else {
            invalid = true
            return
          }
        } else if (/^\[@(.+)\]$/.test(s)) {
          const expr = s.match(/^\[@(.+)\]$/)![1]
          segments.push(`@${expr}`)
        } else {
          segments.push(s)
        }
      }
    }
  }

  process(path)

  return invalid ? [] : segments
}
