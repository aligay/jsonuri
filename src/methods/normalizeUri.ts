import { parseUri, type UriSegment } from './parseUri'

export const normalizeUri = (...path: UriSegment[]) => {
  return parseUri(path as UriSegment).join('/')
}
