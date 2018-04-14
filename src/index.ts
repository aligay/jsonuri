// import { isCircular } from './util'
import get from './get'
import set from './set'
export { get, set }

let a = {}
set(a, 'arguments/a', 789)
set(a, 'arguments/b', 222)
console.log(JSON.stringify(a, null, 2))
