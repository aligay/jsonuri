/*!
 * jsonuri v2.0.0
 * (c) 2016 Linkjun <pk.link@163.com>
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.safeTrim = global.safeTrim || {})));
}(this, (function (exports) { 'use strict';

function noop() {}

function isInteger(num) {
  return Number.isInteger(num);
}
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

function objectForeach(obj, callback) {
  Object.keys(obj).forEach(function (prop) {
    callback(obj[prop], prop, obj);
  });
  return obj;
}

var arrPro = Array.prototype;
function normalizePath() {
  for (var _len = arguments.length, path = Array(_len), _key = 0; _key < _len; _key++) {
    path[_key] = arguments[_key];
  }

  //path = isArray(path) ? path : [path]
  path = arrPro.concat.apply(arrPro, path).join('/').split('/');
  path = ['/', combingPathKey(path).join('/')].join('');
  if (path !== '/') {
    path += '/';
  }
  return path;
}

/**
 * [walk description] 遍历一个对象, 提供入栈和出栈两个回调, 操作原对象
 * @param  {object} obj          [description]
 * @param  {[type]} descentionFn [description]
 * @param  {[type]} ascentionFn  [description]
 * @return {[type]}              [description]
 */
function walk() {
  var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var descentionFn = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];
  var ascentionFn = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  var path = [];

  function _walk(obj) {
    objectForeach(obj, function (val, key, raw) {
      path.push(key);
      descentionFn(val, key, raw, { path: normalizePath(path) });
      path.pop();
      if (val instanceof Object) {
        path.push(key);
        _walk(val);
        path.pop();
        ascentionFn(val, key, raw, { path: normalizePath(path) });
      }
    });
    return obj;
  }

  return _walk(obj);
}

function indexOf(path) {
  return path.split('/').filter(function (item) {
    return item;
  }).slice(-1)[0] - 0;
}

/**
 * Combing path keys
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
function combingPathKey(keys) {
  // {empty}
  while (~keys.indexOf('')) {
    var _i = keys.indexOf('');
    keys.splice(_i, 1);
  }

  // .
  while (~keys.indexOf('.')) {
    var _i2 = keys.indexOf('.');
    keys.splice(_i2, 1);
  }

  // ..
  while (~keys.indexOf('..')) {
    var _i3 = keys.indexOf('..');
    keys[_i3] = keys[_i3 - 1] = null;
    delete keys[_i3];
    delete keys[_i3 - 1];
    keys.splice(_i3, 1);
    keys.splice(_i3 - 1, 1);
  }

  return keys;
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
      if (value !== undefined) {
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
        var _curType = _nextKey * 0 === 0 ? 'Array' : 'Object';
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
  }

  return cur;
}

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
function mv(data, pathA, pathB) {
  var direction = arguments.length <= 3 || arguments[3] === undefined ? 'after' : arguments[3];

  var aParent = get(data, pathA + '/../');
  var bParent = get(data, pathB + '/../');
  var _a = get(data, pathA);
  var _b = get(data, pathB);
  var aIndex = indexOf(pathA);
  var bIndex = indexOf(pathB);

  /*
   如果同个数组中移动，要考虑移动后所需要移除的路径（PathA）数据指针有变，
   所以要判断是同个数组，并且
   */

  if (aParent !== bParent) {
    //放入新值
    insert(data, pathB, _a, direction);
    //删除PathA
    rm(data, pathA);
    return;
  }

  //移动位置相同直接退出
  if (aIndex === bIndex) return;

  //放入新值
  insert(data, pathB, _a, direction);

  //更新bIndex
  bIndex += direction === 'before' ? -1 : 0;

  //向👈移动aIndex + 1
  if (bIndex < aIndex) {
    aIndex++;
  }

  pathA = normalizePath(pathA, '/../' + aIndex);
  rm(data, normalizePath(pathA, '/../' + aIndex));
}

/**
 * Up
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function up(data, path) {
  var gap = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var parent = get(data, path + '/../');
  var index = indexOf(path);
  var targetIndex = index - gap;
  var pathB = normalizePath(path, '/../' + targetIndex + '/');

  if (!isArray(parent)) {
    console.error('操作的不是数组');
    return;
  }
  //移动溢出
  if (index <= 0 || index >= parent.length) {
    return;
  }

  mv(data, path, pathB, 'before');
}

/**
 * Down
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function down(data, path) {
  var gap = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var parent = get(data, path + '/../');
  var index = indexOf(path);
  var targetIndex = index + gap;
  var pathB = normalizePath(path, '/../' + targetIndex + '/');

  if (!isArray(parent)) {
    console.error('操作的不是数组');
    return;
  }
  //移动溢出
  if (index < 0 || index >= parent.length) {
    return;
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
var max = Math.max;
var min = Math.min;


function insert(data, path, value) {
  var direction = arguments.length <= 3 || arguments[3] === undefined ? 'after' : arguments[3];

  var parent = get(data, path + '/../');
  var index = path.split('/').filter(function (item) {
    return item;
  }).slice(-1)[0] - 0;

  if (!isInteger(index)) {
    console.error(path + '不是数字');
    return;
  }

  if (!isArray(parent)) {
    console.error(path + '不是数组');
    return;
  }

  var isAfter = direction === 'after';
  var target = isAfter ? index + 1 : index;
  target = min(parent.length, target);
  target = max(0, target);
  parent.splice(target, 0, value);
  return data;
}

var index = { get: get, set: set, rm: rm, swap: swap, mv: mv, up: up, down: down, insert: insert, walk: walk, normalizePath: normalizePath };

exports['default'] = index;
exports.get = get;
exports.set = set;
exports.rm = rm;
exports.swap = swap;
exports.mv = mv;
exports.up = up;
exports.down = down;
exports.insert = insert;
exports.walk = walk;
exports.normalizePath = normalizePath;

Object.defineProperty(exports, '__esModule', { value: true });

})));