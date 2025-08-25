import { NULL } from '../util'
import { type UriSegment, parseUri } from './parseUri'
export const parents = (path: UriSegment): string[] => {
  const paths = parseUri(path)
  const result: string[] = []
  for (let i = paths.length - 2; i >= 0; --i) {
    const current = paths.slice(0, i + 1).join('/')
    result.push(current)
  }
  return result
}

export const parent = (path: UriSegment): string | null => {
  const paths = parseUri(path)
  if (paths.length < 2) return NULL
  return paths.slice(0, paths.length - 1).join('/')
}
