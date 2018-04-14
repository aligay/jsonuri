import get from './get'
import set from './set'
import normalizePath from './normalizePath'
import isCircular from './isCircular'
import walk from './walk'

export {
  get,
  set,
  walk,
  normalizePath,
  isCircular
}
// debugger
// console.log(get({NULL: 'a'}, 'NULL'))
