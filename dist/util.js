"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_NOT_A_NATURAL_NUMBER = 'is not a natural number';
exports.MUST_BE_ARRAY = 'must be a Array';
exports.THE_PARAMETER_IS_ILLEGAL = 'the parameter is illegal';
exports.DIRECTION_REQUIRED = "direction must be 'before' | 'after' | 'append'";
exports.THE_INDEX_OUT_OF_BOUNDS = 'the Index Out of Bounds';
function noop() { }
exports.noop = noop;
exports.isArray = Array.isArray;
function isString(s) {
    return typeof s === 'string';
}
exports.isString = isString;
function isInteger(n) {
    return Number.isInteger(n); // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
}
function isNatural(n) {
    return isInteger(n) && n >= 0;
}
exports.isNatural = isNatural;
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
function toString(s) {
    return s + '';
}
exports.toString = toString;
function showError(s) {
    console.error(s);
}
exports.showError = showError;
function throwError(s) {
    throw new Error(s);
}
exports.throwError = throwError;
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
    if (key === 'length') {
        if (!isNatural(value))
            throw new Error("value: " + value + " " + exports.IS_NOT_A_NATURAL_NUMBER);
        if (value > obj.length)
            obj.length = value;
        obj.splice(value);
        return;
    }
    // if isArray, key should be a number
    var index = +key;
    if (!isNatural(index)) {
        showError("key: " + key + " " + exports.IS_NOT_A_NATURAL_NUMBER);
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
/**
 * insertValue
 */
function insertValue(arr, key, value, direction) {
    if (direction === void 0) { direction = 'after'; }
    if (key < 0 || key > arr.length)
        throw new Error(exports.THE_INDEX_OUT_OF_BOUNDS);
    switch (direction) {
        case 'before':
            key = key - 1;
            break;
        case 'append':
            showError('TODO');
    }
    arr.splice(key, 0, value);
}
exports.insertValue = insertValue;
// let combingCache: any = {}
function combingPathKey(param) {
    var path = param.path || '';
    // if (combingCache[path]) {
    //   return combingCache[path]
    // }
    var keys;
    if (!param.keys) {
        keys = param.path.split('/');
    }
    else if (!path) {
        keys = param.keys;
    }
    keys = keys.filter(Boolean);
    // // 处理 a../,  ../b../ 此类错误路径 待优化
    // if (/\b\.\.+\/*/.test(keys.join(''))) {
    //   throw new Error(`error path ${path || keys.join('')}`)
    // }
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
    var ret = {
        keys: keys,
        path: keys.join('/')
    };
    return ret;
}
exports.combingPathKey = combingPathKey;
//# sourceMappingURL=util.js.map