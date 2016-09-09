'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

exports.isInteger = isInteger;
exports.isObject = isObject;
exports.isArray = isArray;
exports.objectForeach = objectForeach;
exports.arrayMove = arrayMove;
exports.normalizePath = normalizePath;
exports.walk = walk;
exports.indexOf = indexOf;
exports.combingPathKey = combingPathKey;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

function isInteger(num) {
  return (0, _isInteger2.default)(num);
}
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

function objectForeach(obj, callback) {
  (0, _keys2.default)(obj).forEach(function (prop) {
    callback(obj[prop], prop, obj);
  });
  return obj;
}

function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length;
    while (k-- + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
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
//# sourceMappingURL=util.js.map