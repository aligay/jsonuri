/*!
 * JsonUri.js v1.5.13
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
    var isBreak = false;
    function _break() {
      isBreak = true;
    }

    for (var _iterator = Object.keys(obj), _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i2 >= _iterator.length) break;
        _ref = _iterator[_i2++];
      } else {
        _i2 = _iterator.next();
        if (_i2.done) break;
        _ref = _i2.value;
      }

      var prop = _ref;

      if (isBreak) break;
      callback(obj[prop], prop, obj, { _break: _break });
    }
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
      objectForeach(obj, function (val, key, raw, _ref2) {
        var _break = _ref2._break;

        var isBreak = false;
        function _gBreak() {
          _break();
          isBreak = true;
          if (isArray(raw)) {
            path.pop();
          }
        }

        if (val === raw) {
          console.log('Circular-reference: ' + normalizePath(path));
          _break(); // break 只会跳出当前一层循环
          return;
        }

        path.push(key);
        descentionFn(val, key, raw, { path: normalizePath(path), _break: _gBreak });
        path.pop();
        if (val instanceof Object) {
          path.push(key);
          if (isBreak) return;
          _walk(val);
          path.pop();
          ascentionFn(val, key, raw, { path: normalizePath(path), _break: _gBreak });
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
      var _i = keys.indexOf('.');
      keys.splice(_i, 1);
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
   * getType
   * @type {Object}
   * @return {String} 返回类型
   */
  var __class2types = {};
  objectForeach(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (item, index) {
    __class2types['[object ' + item + ']'] = item.toLowerCase();
  });

  function getType(obj) {
    if (obj == null) return String(obj);
    return typeof obj === "object" || typeof obj === "function" ? __class2types[__class2types.toString.call(obj)] || "object" : typeof obj;
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
    };

    return cur;
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

    if (getType(aParent) !== 'array') {
      console.error(pathA + ' 路径的父级不是数组类型');
      return;
    }
    if (getType(bParent) !== 'array') {
      console.error(pathB + ' 路径的父级不是数组类型');
      return;
    }

    //不同父节点也要考虑移除A后B的指针会变更，例如：/3/ mvto /6/5/
    if (aParent !== bParent) {
      //1、父级别移动到子级中：先插后删
      //从路径判断pathB是否为pathA的父级
      if (normalizePath(pathB, '../').indexOf(normalizePath(pathA, '../')) === 0) {
        //先插后删
        insert(data, pathB, _a, direction);
        rm(data, pathA);
        return;
      }
      //2、子级别移动到父级别：先删后插
      rm(data, pathA);
      insert(data, pathB, _a, direction);
      return;
    }

    //同一数组内移动

    //移动位置相同直接退出
    if (aIndex === bIndex) return;

    //获取目标_index
    var _targetIndex = bIndex += direction === 'before' ? -1 : 0;

    //目标指针依旧相同退出
    if (aIndex === _targetIndex) return;

    //目标指针大于被移动指针
    if (_targetIndex > aIndex) {
      //先插后删
      insert(data, pathB, _a, direction);
      rm(data, pathA);
      return;
    }

    //先删后插
    rm(data, pathA);
    insert(data, pathB, _a, direction);

    //放入新值

    /*//更新bIndex
    bIndex += direction === 'before' ? -1 : 0
     //向👈移动aIndex + 1
    if (bIndex < aIndex) {
      aIndex++
    }
     pathA = normalizePath(pathA, `/../${aIndex}`)
    rm(data, normalizePath(pathA, `/../${aIndex}`))*/
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
    var target_index = index - gap;
    var pathB = normalizePath(path, '/../' + target_index + '/');

    if (!isArray(parent)) {
      console.error(path + ' 目标必须为数组类型');
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
    var target_index = index + gap;
    var pathB = normalizePath(path, '/../' + target_index + '/');

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
      console.error(path + ' 路径末尾必须为数字');
      return;
    }

    if (!isArray(parent)) {
      console.error(path + ' 要插入的父级类型不是数组');
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

}));