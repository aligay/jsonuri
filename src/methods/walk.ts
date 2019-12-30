import { noop, isArray, isObject } from '../util'
import isCircular from './isCircular'
import normalizePath from './normalizePath'

const objectForeach = (obj, callback) => {
  let isBreak = false
  const _break = () => {
    isBreak = true
  }

  for (const prop of Object.keys(obj)) {
    if (isBreak) break
    callback(obj[prop], prop, obj, { _break })
  }
}

/**
 * [walk description] 遍历一个对象, 提供入栈和出栈两个回调, 操作原对象
 * @author haozi
 * @param  {object} obj          [description]
 * @param  {[type]} descentionFn [description]
 * @param  {[type]} ascentionFn  [description]
 * @return {[type]}              [description]
 */

export type WalkCallback = (val, key: string, parent, { _break, path }) => void

const walk = (obj = {}, descentionFn: WalkCallback = noop, ascentionFn: WalkCallback = noop): void => {
  if (isCircular(obj)) throw new Error('obj is a circular structure')

  const path: string[] = []
  const _walk = (obj) => {
    objectForeach(obj, (val, key, parent, { _break }) => {
      let isBreak = false

      const _gBreak = () => {
        _break()
        isBreak = true
        if (isArray(parent)) {
          path.pop()
        }
      }

      path.push(key)
      descentionFn(val, key, parent, { path: normalizePath(path), _break: _gBreak })
      path.pop()
      if (isObject(val)) {
        path.push(key)
        if (isBreak) return
        _walk(val)
        path.pop()
        ascentionFn(val, key, parent, { path: normalizePath(path), _break: _gBreak })
      }
    })
    return obj
  }

  return _walk(obj)
}

export default walk
