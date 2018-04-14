"use strict";
exports.__esModule = true;
function noop() { }
exports.noop = noop;
exports.isArray = Array.isArray;
function isString(s) {
    return typeof s === 'string';
}
exports.isString = isString;
function isInteger(n) {
    return typeof n === 'number' && isFinite(n) && Math.ceil(n) === n;
}
function isNatural(n) {
    return isInteger(n) && n >= 0;
}
var pathReg = /\//;
function isComplexPath(s) {
    return pathReg.test(s);
}
exports.isComplexPath = isComplexPath;
function isObject(o) {
    // [^Undefined, Null, boolean, Number, String, Symbol]
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
    var type = typeof o;
    return o != null && (type === 'object' || type === 'function');
}
exports.isObject = isObject;
function showError(s) {
    console.error(new Error(s));
}
exports.showError = showError;
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
function setValue(obj, key, value) {
    if (!exports.isArray(obj)) {
        obj[key] = value;
        return;
    }
    var msg = 'must be a natural number';
    if (key === 'length') {
        if (!isNatural(value)) {
            showError("value: " + value + " " + msg);
            return;
        }
        if (value > obj.length) {
            obj.length = value;
            return;
        }
        obj.splice(value);
        return;
    }
    // if isArray, key should be a number
    var index = +key;
    if (!isNatural(index)) {
        showError("key: " + key + " " + msg);
        return;
    }
    obj.length = Math.max(obj.length, index);
    obj.splice(index, 1, value);
}
exports.setValue = setValue;
/**
 * 让数组的删除可被监听
 */
function delValue(obj, key) {
    if (exports.isArray(obj)) {
        var index = +key;
        if (!isNatural(index))
            return;
        obj.splice(index, 1);
    }
    else {
        delete obj[key];
    }
}
exports.delValue = delValue;
function combingPathKey(param) {
    var keys;
    if (!param.keys) {
        keys = param.path.split('/');
    }
    else if (!param.path) {
        keys = param.keys;
    }
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
        keys[_i] = keys[_i - 1] = '';
        delete keys[_i];
        delete keys[_i - 1];
        keys.splice(_i, 1);
        keys.splice(_i - 1, 1);
    }
    return {
        keys: keys,
        path: keys.join('/')
    };
}
exports.combingPathKey = combingPathKey;
// export function isInteger (num) {
//   return Number.isInteger(num)
// }
// export function isObject (val) {
//   return Object.prototype.toString.call(val) === '[object Object]'
// }
// export function isArray (val) {
//   return Object.prototype.toString.call(val) === '[object Array]'
// }
// export function objectForeach (obj, callback) {
//   let isBreak = false
//   function _break () {
//     isBreak = true
//   }
//   for (let prop of Object.keys(obj)) {
//     if (isBreak) break
//     callback(obj[prop], prop, obj, { _break })
//   }
// }
// export function arrayMove (arr, old_index, new_index) {
//   if (new_index >= arr.length) {
//     let k = new_index - arr.length
//     while ((k--) + 1) {
//       arr.push(undefined)
//     }
//   }
//   arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
//   return arr
// }
// const arrPro = Array.prototype
// export function normalizePath (...path) {
//   // path = isArray(path) ? path : [path]
//   path = arrPro.concat.apply(arrPro, path).join('/').split('/')
//   path = ['/', combingPathKey(path).join('/')].join('')
//   if (path !== '/') {
//     path += '/'
//   }
//   return path
// }
// // 循环引用对象检测
// export function isCircular (obj, seen = []) {
//   if (!(obj instanceof Object)) {
//     return false
//   }
//   seen.push(obj)
//   for (const key in obj) {
//     const val = obj[key]
//     if (val instanceof Object) {
//       if (~seen.indexOf(val) || isCircular(val, seen.slice())) {
//         return true
//       }
//     }
//   }
//   return false
// }
// /**
//  * [walk description] 遍历一个对象, 提供入栈和出栈两个回调, 操作原对象
//  * @param  {object} obj          [description]
//  * @param  {[type]} descentionFn [description]
//  * @param  {[type]} ascentionFn  [description]
//  * @return {[type]}              [description]
//  */
// export function walk (obj = {} , descentionFn = noop , ascentionFn = noop) {
//   if (isCircular(obj)) throw new Error(`obj is a circular structure`)
//   let path = []
//   function _walk (obj) {
//     objectForeach(obj, (val, key, raw, {_break}) => {
//       let isBreak = false
//       function _gBreak () {
//         _break()
//         isBreak = true
//         if (isArray(raw)) {
//           path.pop()
//         }
//       }
//       path.push(key)
//       descentionFn(val, key, raw, {path: normalizePath(path), _break: _gBreak})
//       path.pop()
//       if (val instanceof Object) {
//         path.push(key)
//         if (isBreak) return
//         _walk(val)
//         path.pop()
//         ascentionFn(val, key, raw, {path: normalizePath(path), _break: _gBreak})
//       }
//     })
//     return obj
//   }
//   return _walk(obj)
// }
// export function indexOf (path) {
//   return path.split('/').filter(item => item).slice(-1)[0] - 0
// }
// /**
//  * Combing path keys
//  * @param  {Array} keys  ['','menu','id','','.']
//  * @return {Array}       ['menu','id']
//  */
// export function combingPathKey (keys) {
//   // {empty}
//   while (~keys.indexOf('')) {
//     var _i = keys.indexOf('')
//     keys.splice(_i, 1)
//   }
//   // .
//   while (~keys.indexOf('.')) {
//     var _i = keys.indexOf('.')
//     keys.splice(_i, 1)
//   }
//   // ..
//   while (~keys.indexOf('..')) {
//     let _i = keys.indexOf('..')
//     keys[_i] = keys[_i - 1] = null
//     delete keys[_i]
//     delete keys[_i - 1]
//     keys.splice(_i, 1)
//     keys.splice(_i - 1, 1)
//   }
//   return keys
// }
// export function findParents (arr1, arr2) {
// }
// /**
//  * getType
//  * @type {Object}
//  * @return {String} 返回类型
//  */
// let __class2types = {}
// objectForeach(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (item, index) {
//   __class2types[`[object ${item}]`] = item.toLowerCase()
// })
// export function getType (obj) {
//   if (obj == null) return String(obj)
//   return (typeof obj === 'object' || typeof obj === 'function') ?
//     __class2types[__class2types.toString.call(obj)] || 'object' : typeof obj
// }
//# sourceMappingURL=util.js.map