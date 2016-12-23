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
import JsonUri from './jsonuri';
import {isInteger, isObject, isArray, arrayMove, walk, combingPathKey, normalizePath, indexOf} from './util';

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
  set(data, path, null);
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

  set(data, pathA, _b);
  set(data, pathB, _a);
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
function mv(data, pathA, pathB, direction = 'after') {
  let a_parent = get(data, pathA + '/../');
  let b_parent = get(data, pathB + '/../');
  let _a = get(data, pathA);
  let _b = get(data, pathB);
  let a_index = indexOf(pathA);
  let b_index = indexOf(pathB);

  /*
    如果同个数组中移动，要考虑移动后所需要移除的路径（PathA）数据指针有变，
    所以要判断是同个数组，并且
  */
  if(a_parent === b_parent) return
  if(direction === 'before'){
     //删除PathA
      rm(data, pathA);
      //放入新值
      insert(data, pathB, _a, direction);
  }

  //放入新值
  insert(data, pathB, _a, direction);
  //删除PathA
  rm(data, pathA);
}

/**
 * Up
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function up(data, path, gap = 1) {
  let parent = get(data, path + '/../');
  let index = indexOf(path);
  let target_index = index - gap;
  let pathB = normalizePath(path, `/../${target_index}/`);

  if(!isArray(parent)){
    console.error('操作的不是数组')
    return;
  }
  //移动溢出
  if(index <= 0 || index >= parent.length){
    return ;
  }

  mv(data, path, pathB, 'before');
}

/**
 * Down
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function down(data, path, gap = 1) {
  let parent = get(data, path + '/../');
  let index = indexOf(path);
  let target_index = index + gap;
  let pathB = normalizePath(path, `/../${target_index}/`);

  if(!isArray(parent)){
    console.error('操作的不是数组')
    return;
  }
  //移动溢出
  if(index < 0 || index >= parent.length){
    return ;
  }

  mv(data, path, pathB, 'after');
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


export default {get, set, rm, swap, mv, up, down, insert, walk, normalizePath};
export {get, set, rm, swap, mv, up, down, insert, walk, normalizePath};
