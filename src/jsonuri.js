import {combingPathKey, isObject, isArray} from './util'

/**
 * Jsonuri
 * @author Linkjun
 * @param {Object | Array}    data  {k:1,s:[..]}
 * @param {String}            path  '/s/0/'
 * @param {Any}               value [0,{s:0},2,3,4]
 */
function Jsonuri(data, path, value) {
  //Data must be Object.
  if (!(data instanceof Object)) return

  //Path must be valid.
  if (!path) return data

  //Combing Path Key.
  let keys = combingPathKey(String(path).split('/'))
  //Initialize data to the pointer.
  let cur = data

  for (let i = 0; i < keys.length; i++) {
    //Key must be valid.
    if (!keys[i]) continue

    if (i === keys.length - 1) {
      if (value !== undefined) {
        //set value.
        cur[keys[i]] = value
      } else if (value === null) {
        //delete value in the object.
        if (isObject(cur)) {
          cur[keys[i]] = null
          delete cur[keys[i]]
        }

        //delete value in the array.
        if (isArray(cur)) {
          cur[keys[i]] = null
          cur.splice(keys[i], 1)
        }
      }
    } else if (value) {
      //if set value
      let _nextKey = keys[i + 1]

      //curData is undefined.
      if (!cur[keys[i]]) {
        //create data container.
        let _curType = (_nextKey * 0 === 0) ? 'Array' : 'Object'
        if (_curType === 'Array') {
          cur[keys[i]] = []
        } else if (_curType === 'Object') {
          cur[keys[i]] = {}
        }
      }
    } else {
      if (cur[keys[i]] === undefined) {
        //Data path is undefined and return.
        return undefined
      } else if (cur[keys[i]] === null) {
        return null
      }
    }

    cur = cur[keys[i]]
  }

  return cur
}

export default Jsonuri
