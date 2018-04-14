/**
 * Combing path keys
 * @author @linkjun
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
export default function normalizePath (path: string): string {
  let keys = path.split('/')
  // {empty}
  while (~keys.indexOf('')) {
    let _i = keys.indexOf('')
    keys.splice(_i, 1)
  }

  // .
  while (~keys.indexOf('.')) {
    let _i = keys.indexOf('.')
    keys.splice(_i, 1)
  }

  // ..
  while (~keys.indexOf('..')) {
    let _i = keys.indexOf('..')
    keys[_i] = keys[_i - 1] = ''
    delete keys[_i]
    delete keys[_i - 1]
    keys.splice(_i, 1)
    keys.splice(_i - 1, 1)
  }

  return keys.join('/')
}
