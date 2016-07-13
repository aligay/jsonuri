/**
 * JsonUri
 * @author Linkjun @linkjun.com
 * @description
 *   get(data, '/menu/id/');
 *   get(data, '/menu/id/../');
 *   get(data, '/menu/id/.../');
 *   get(data, '/menu/id/~/');
 *   set(data, '/menu/id/',[0,1,2,3,4]);
 *   mv(data, '/menu/id/0', '/menu/id/2');
 *   swap(data, '/menu/id/0', '/menu/id/1');
 *   rm(data, '/menu/value/');
 */


/**
 * require isObject,
 *         isArray,
 *         arrayMove
 */
import {isInteger, isObject, isArray, arrayMove, walk, combingPathKey, normalizePath} from './util';

/**
 * Get
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @param {[type]}        return value.
 */
function get(data, path) {
  return JsonUri(data, path);
}

/**
 * Set
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @param  {Any}    value ex: {}.
 * @param {[type]}        return data this.
 */
function set(data, path, value) {
  JsonUri(data, path, value);
  return data;
}

/**
 * Remove
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @return {Any}          The deleted value.
 */
function rm(data, path) {
  var tmp = JsonUri(data, path);
  JsonUri(data, path, null);
  return tmp;
}

/**
 * Swap
 * @param  {Object} data    data type can be object or array.
 * @param  {String} pathA   ex: '/menu/nav/list/0'.
 * @param  {String} pathB   ex: '/menu/nav/list/2'.
 * @return {Object}         return data this.
 * @description  `pathA` the data swap `pathB`.
 */
function swap(data, pathA, pathB) {
  var _a = JsonUri(data, pathA);
  var _b = JsonUri(data, pathB);

  JsonUri(data, pathA, _b);
  JsonUri(data, pathB, _a);
  return data;
}

/**
 * Move
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @param  {String} pathB     ex: '/menu/nav/list/2'.
 * @param  {String} sequence  ex: 'before', default 'after'.
 * @description Move data in the array.
 */
function mv(data, pathA, pathB, sequence) {
  var a_parent = JsonUri(data, pathA + '/../');
  var b_parent = JsonUri(data, pathB + '/../');
  var _index = sequence === 'before' ? -1 : 0;

  if (a_parent != b_parent) {
    console.error(`${pathA} , ${pathB} not in the same Array.`);
    return;
  }
  if (!isArray(a_parent)) {
    console.error(`target parent not Array.`);
    return;
  }

  var _a = JsonUri(data, pathA);
  var _b = JsonUri(data, pathB);
  var a_index = a_parent.indexOf(_a);
  var b_index = a_parent.indexOf(_b);

  //target index
  _index += b_index;

  //target index the overflow
  if (_index >= a_parent.length) _index = a_parent.length;
  if (_index <= 0) _index = 0;

  a_parent = arrayMove(a_parent, a_index, _index);
}

/**
 * Up
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function up(data, path, gap) {
  var dataItem = get(data, path);
  var dataArray = get(data, path + '/../');
  var targetIndex = dataArray.indexOf(dataItem);

  var gap = gap || 1;

  if (!isArray(dataArray)) return;
  targetIndex = (targetIndex - gap) >= 0 ? targetIndex - gap : 0;

  var pathA = path;
  var pathB = path + `/../${targetIndex}/`;
  mv(data, pathA, pathB, 'before');
}

/**
 * Down
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function down(data, path, gap) {
  var dataItem = get(data, path);
  var dataArray = get(data, path + '/../');
  var targetIndex = dataArray.indexOf(dataItem);
  var gap = gap || 1;

  if (!isArray(dataArray)) return false;
  targetIndex = (targetIndex + gap) >= dataArray.length - 1 ? dataArray.length - 1 : targetIndex + gap;

  var pathA = path;
  var pathB = path + `/../${targetIndex}/`;
  mv(data, pathA, pathB, 'after');
}

/**
 * 在 path 之前 或者之后插入一个数据, 如果不是数组,控制台报错
 * @param  {[type]} data      [description]
 * @param  {[type]} path      [description]
 * @param  {String} direction [description]
 * @return {[type]}           [description]
 */
const [max, min] = [Math.max, Math.min]

function insert(data, path, value, direction = 'after') {
  let parent = get(data, path + '/../')
  let index = path.split('/').filter(item => item).slice(-1)[0] - 0

  if (!isInteger(index)) {
    console.error(path + '不是数字')
    return
  }

  if (!isArray(parent)) {
    console.error(path + '不是数组')
    return
  }

  let isAfter = direction === 'after'
  let target = isAfter ? index + 1 : index
  target = min(parent.length, target)
  target = max(0, target)
  parent.splice(target, 0, value)
  return data
}

/**
 * JsonUri
 * @author Linkjun
 * @param {Object | Array}    data  {k:1,s:[..]}
 * @param {String}            path  '/s/0/'
 * @param {Any}               value [0,{s:0},2,3,4]
 */
function JsonUri(data, path, value) {
  //Data must be Object.
  if (!(data instanceof Object)) return;

  //Path must be valid.
  if (!path) return data;

  //Combing Path Key.
  var keys = combingPathKey(String(path).split('/'));
  //Initialize data to the pointer.
  var cur = data;

  for (var i = 0; i < keys.length; i++) {
    //Key must be valid.
    if (!keys[i]) continue;

    if (i === keys.length - 1) {
      if (value != undefined) {

        //set value.
        cur[keys[i]] = value;
      } else if (value === null) {

        //delete value in the object.
        if (isObject(cur)) {
          cur[keys[i]] = null;
          delete cur[keys[i]];
        }

        //delete value in the array.
        if (isArray(cur)) {
          cur[keys[i]] = null;
          cur.splice(keys[i], 1);
        }
      }
    } else if (value) {

      //if set value
      var _nextKey = keys[i + 1];

      //curData is undefined.
      if (!cur[keys[i]]) {

        //create data container.
        var _curType = (_nextKey * 0 === 0) ? 'Array' : 'Object';
        if (_curType === 'Array') {
          cur[keys[i]] = [];
        } else if (_curType === 'Object') {
          cur[keys[i]] = {};
        }
      }
    } else {
      if (cur[keys[i]] === undefined) {
        //Data path is undefined and return.
        return undefined;
      } else if (cur[keys[i]] === null) {
        return null;
      }
    }

    cur = cur[keys[i]];
  };

  return cur;
}

export default {get, set, rm, swap, mv, up, down, insert, walk, normalizePath};
export {get, set, rm, swap, mv, up, down, insert, walk, normalizePath};
