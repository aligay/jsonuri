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
import {isInteger, isObject, isArray, arrayMove, walk, combingPathKey, normalizePath, indexOf, getType, isCircular} from './util';

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
  let aParent = get(data, pathA + '/../')
  let bParent = get(data, pathB + '/../')
  let _a = get(data, pathA)
  let _b = get(data, pathB)
  let aIndex = indexOf(pathA)
  let bIndex = indexOf(pathB)

  if(getType(aParent) !== 'array'){
    console.error(`${pathA} 路径的父级不是数组类型`)
    return
  }
  if(getType(bParent) !== 'array'){
    console.error(`${pathB} 路径的父级不是数组类型`)
    return
  }

  //不同父节点也要考虑移除A后B的指针会变更，例如：/3/ mvto /6/5/
  if (aParent !== bParent) {
    //1、父级别移动到子级中：先插后删
    //从路径判断pathB是否为pathA的父级
    if(normalizePath(pathB, '../').indexOf(normalizePath(pathA, '../')) === 0){
      //先插后删
      insert(data, pathB, _a, direction)
      rm(data, pathA)
      return
    }
    //2、子级别移动到父级别：先删后插
    rm(data, pathA)
    insert(data, pathB, _a, direction)
    return
  }

  //同一数组内移动

  //移动位置相同直接退出
  if (aIndex === bIndex) return

  //获取目标_index
  let _targetIndex = bIndex += direction === 'before' ? -1 : 0

  //目标指针依旧相同退出
  if (aIndex === _targetIndex) return

  //目标指针大于被移动指针
  if (_targetIndex > aIndex) {
    //先插后删
    insert(data, pathB, _a, direction)
    rm(data, pathA)
    return
  }

  //先删后插
  rm(data, pathA)
  insert(data, pathB, _a, direction)
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
    console.error(`${path} 目标必须为数组类型`)
    return
  }
  //移动溢出
  if(index <= 0 || index >= parent.length){
    return
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
    console.error(`${path} 路径末尾必须为数字`)
    return
  }

  if (!isArray(parent)) {
    console.error(`${path} 要插入的父级类型不是数组`)
    return
  }

  let isAfter = direction === 'after'
  let target = isAfter ? index + 1 : index
  target = min(parent.length, target)
  target = max(0, target)
  parent.splice(target, 0, value)
  return data
}


export default {get, set, rm, swap, mv, up, down, insert, walk, normalizePath, isCircular};
export {get, set, rm, swap, mv, up, down, insert, walk, normalizePath, isCircular};
