import get from './get'
import set from './set'

import rm from './rm'

import normalizePath from './normalizePath'
import isCircular from './isCircular'
import walk from './walk'

export {
  get,
  set,

  rm,

  walk,
  normalizePath,
  isCircular
}

/////////

// let obj
// let rawData = {
//   a: 2,
//   b: {
//     b1: {
//       b11: 311,
//       b12: 312
//     },
//     b2: 32
//   },
//   list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   NULL: null
// }
// obj = JSON.parse(JSON.stringify(rawData))
// rm(obj, 'list/5')
// console.log(JSON.stringify(obj, null, 2))
