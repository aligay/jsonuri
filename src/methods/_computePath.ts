import { combingPathKey, isInteger } from '../util'
import normalizePath from './normalizePath'

const _computePath = (path: string, direction: 'prev' | 'next'): string | null => {
  const index = +(combingPathKey({ path }).keys.pop() as string)

  if (!isInteger(index)) return null

  if (direction === 'prev') return normalizePath(path, '..', index - 1)
  if (direction === 'next') return normalizePath(path, '..', index + 1)
  return null
}

export default _computePath
