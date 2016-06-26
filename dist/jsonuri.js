/*!
 * JsonUri.js v1.0.03
 * (c) 2016 Linkjun <pk.link@163.com> https://jsonuri.com
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.JsonUri = global.JsonUri || {})));
}(this, function (exports) { 'use strict';

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

  function arrayMove(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length;
      while (k-- + 1) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
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

    function _walk(obj) {
      objectForeach(obj, function (val, prop, aObj) {
        descentionFn(val, prop, aObj);
        if (val instanceof Object) {
          _walk(val);
          ascentionFn(val, prop, aObj);
        }
      });
      return obj;
    }

    return _walk(obj);
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
      var _i = keys.indexOf('.');
      keys.splice(_i, 1);
    }

    // ~
    while (~keys.indexOf('~')) {
      keys = [];
    }

    // ...
    while (~keys.indexOf('...')) {
      var _i = keys.indexOf('...');
      if (_i - 2 <= 0) return keys = [];

      keys[_i] = keys[_i - 1] = keys[_i - 2] = null;
      delete keys[_i];
      delete keys[_i - 1];
      delete keys[_i - 2];
      keys.splice(_i, 1);
      keys.splice(_i - 1, 1);
      keys.splice(_i - 2, 1);
    }

    // ..
    while (~keys.indexOf('..')) {
      var _i = keys.indexOf('..');
      keys[_i] = keys[_i - 1] = null;
      delete keys[_i];
      delete keys[_i - 1];
      keys.splice(_i, 1);
      keys.splice(_i - 1, 1);
    }

    return keys;
  }

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
      console.error(pathA + ' , ' + pathB + ' not in the same Array.');
      return;
    }
    if (!isArray(a_parent)) {
      console.error('target parent not Array.');
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
    targetIndex = targetIndex - gap >= 0 ? targetIndex - gap : 0;

    var pathA = path;
    var pathB = path + ('/../' + targetIndex + '/');
    console.log(data, pathA, pathB);
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
    targetIndex = targetIndex + gap >= dataArray.length - 1 ? dataArray.length - 1 : targetIndex + gap;

    var pathA = path;
    var pathB = path + ('/../' + targetIndex + '/');
    console.log(pathA, pathB);
    mv(data, pathA, pathB, 'after');
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
    ;

    return cur;
  }

  exports.get = get;
  exports.set = set;
  exports.swap = swap;
  exports.mv = mv;
  exports.up = up;
  exports.down = down;
  exports.rm = rm;
  exports.insert = insert;
  exports.walk = walk;

}));