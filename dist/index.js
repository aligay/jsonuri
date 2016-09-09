'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizePath = exports.walk = exports.insert = exports.down = exports.up = exports.mv = exports.swap = exports.rm = exports.set = exports.get = undefined;

var _jsonuri = require('./jsonuri');

var _jsonuri2 = _interopRequireDefault(_jsonuri);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @param {[type]}        return value.
 */
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
function get(data, path) {
  return (0, _jsonuri2.default)(data, path);
}

/**
 * Set
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @param  {Any}    value ex: {}.
 * @param {[type]}        return data this.
 */
function set(data, path, value) {
  (0, _jsonuri2.default)(data, path, value);
  return data;
}

/**
 * Remove
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @return {Any}          The deleted value.
 */
function rm(data, path) {
  var tmp = (0, _jsonuri2.default)(data, path);
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
  var _a = (0, _jsonuri2.default)(data, pathA);
  var _b = (0, _jsonuri2.default)(data, pathB);

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
  var aIndex = (0, _util.indexOf)(pathA);
  var bIndex = (0, _util.indexOf)(pathB);

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

  pathA = (0, _util.normalizePath)(pathA, '/../' + aIndex);
  rm(data, (0, _util.normalizePath)(pathA, '/../' + aIndex));
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
  var index = (0, _util.indexOf)(path);
  var targetIndex = index - gap;
  var pathB = (0, _util.normalizePath)(path, '/../' + targetIndex + '/');

  if (!(0, _util.isArray)(parent)) {
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
  var index = (0, _util.indexOf)(path);
  var targetIndex = index + gap;
  var pathB = (0, _util.normalizePath)(path, '/../' + targetIndex + '/');

  if (!(0, _util.isArray)(parent)) {
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

  if (!(0, _util.isInteger)(index)) {
    console.error(path + '不是数字');
    return;
  }

  if (!(0, _util.isArray)(parent)) {
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

exports.default = { get: get, set: set, rm: rm, swap: swap, mv: mv, up: up, down: down, insert: insert, walk: _util.walk, normalizePath: _util.normalizePath };
exports.get = get;
exports.set = set;
exports.rm = rm;
exports.swap = swap;
exports.mv = mv;
exports.up = up;
exports.down = down;
exports.insert = insert;
exports.walk = _util.walk;
exports.normalizePath = _util.normalizePath;
//# sourceMappingURL=index.js.map