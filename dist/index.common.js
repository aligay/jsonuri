'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var IS_NOT_A_NATURAL_NUMBER = 'is not a natural number';
var MUST_BE_ARRAY = 'must be a Array';
var THE_PARAMETER_IS_ILLEGAL = 'the parameter is illegal';
var DIRECTION_REQUIRED = "direction must be 'before' | 'after' | 'append'";
var THE_INDEX_OUT_OF_BOUNDS = 'the Index Out of Bounds';
function noop() { }
var isArray = Array.isArray;
function isString(s) {
    return typeof s === 'string';
}
function isInteger(n) {
    return Number.isInteger(n); // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
}
function isNatural(n) {
    return isInteger(n) && n >= 0;
}
var pathReg = /\//;
function isComplexPath(s) {
    return pathReg.test(s);
}
function isObject(o) {
    // [^Undefined, Null, boolean, Number, String, Symbol]
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
    var type = typeof o;
    return o != null && (type === 'object' || type === 'function');
}
function showError(s) {
    console.error(s);
}
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
function setValue(obj, key, value) {
    if (!isArray(obj)) {
        obj[key] = value;
        return;
    }
    if (key === 'length') {
        if (!isNatural(value))
            throw new Error("value: " + value + " " + IS_NOT_A_NATURAL_NUMBER);
        if (value > obj.length)
            obj.length = value;
        obj.splice(value);
        return;
    }
    // if isArray, key should be a number
    var index = +key;
    if (!isNatural(index)) {
        showError("key: " + key + " " + IS_NOT_A_NATURAL_NUMBER);
        return;
    }
    obj.length = Math.max(obj.length, index);
    obj.splice(index, 1, value);
}
/**
 * 让数组的删除可被监听
 */
function delValue(obj, key) {
    if (isArray(obj)) {
        var index = +key;
        if (!isNatural(index))
            return;
        obj.splice(index, 1);
    }
    else {
        delete obj[key];
    }
}
/**
 * insertValue
 */
function insertValue(arr, key, value, direction) {
    if (direction === void 0) { direction = 'after'; }
    if (key < 0 || key > arr.length)
        throw new Error(THE_INDEX_OUT_OF_BOUNDS);
    switch (direction) {
        case 'before':
            key = key - 1;
            break;
        case 'append':
            showError('TODO');
    }
    arr.splice(key, 0, value);
}
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

function get(data, path) {
    path = path + '';
    if (!(data))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (path === '')
        return data;
    if (!isComplexPath(path))
        return data[path];
    var ret;
    var keys = combingPathKey({ path: path }).keys;
    if (!keys.length) {
        return data;
    }
    var len = keys.length;
    var i = 0;
    for (; i < len; ++i) {
        ret = (ret || data)[keys[i]];
        if (ret == null)
            break;
    }
    return ret;
}

function set(data, path, value) {
    path = path + '';
    if (!(data && path))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (!isComplexPath(path))
        return setValue(data, path, value);
    var keys = combingPathKey({ path: path }).keys;
    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        if (data[key] == null) {
            data[key] = {};
        }
        if (i === len - 1) {
            setValue(data, key, value);
        }
        else {
            data = data[key];
        }
    }
}

function rm(data, path) {
    path = path + '';
    if (!(data && path))
        return;
    if (!isComplexPath(path)) {
        delValue(data, path);
        return;
    }
    var parent = get(data, path + '/..');
    if (!parent)
        return;
    var key = combingPathKey({ path: path }).keys.pop() || '';
    delValue(parent, key);
}

function swap(data, pathA, pathB) {
    pathA = pathA + '';
    pathB = pathB + '';
    if (!(data && pathA && pathB && isString(pathA) && isString(pathB)))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    var dataA = get(data, pathA);
    var dataB = get(data, pathB);
    set(data, pathB, dataA);
    set(data, pathA, dataB);
}

function insert(data, path, value, direction) {
    path = path + '';
    if (!(data))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (!direction)
        throw new Error(DIRECTION_REQUIRED);
    var parent = get(data, path + '/..');
    if (!isArray(parent))
        throw new Error("insert node " + MUST_BE_ARRAY);
    var index = +combingPathKey({ path: path }).keys.pop();
    var toIndex = index;
    if (direction === 'after') {
        toIndex = index + 1;
    }
    else if (direction === 'before') {
        toIndex = index;
    }
    insertValue(parent, toIndex, value);
}

var arrPro = Array.prototype;
function normalizePath() {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    var pathArr = arrPro.concat.apply(arrPro, path).join('/').split('/');
    var pathStr = combingPathKey({ keys: pathArr }).path;
    return pathStr;
}

function mv(data, from, to, direction) {
    from = from + '';
    to = to + '';
    if (!(data && from && to && isString(from) && isString(to)))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (from === to)
        return;
    var DataTo = get(data, to);
    var dataFrom = get(data, from);
    var parentTo = get(data, to + '/..');
    var fromIndex = +(combingPathKey({ path: from }).keys.pop() || '');
    var toIndex = +(combingPathKey({ path: to }).keys.pop() || '');
    if (isArray(parentTo)) {
        if (!direction)
            throw new Error(DIRECTION_REQUIRED);
        var isInSameArray = normalizePath(from + '/..') === normalizePath(to + '/..');
        insert(data, to, dataFrom, direction);
        if (isInSameArray) {
            delValue(parentTo, fromIndex + (toIndex > fromIndex ? 0 : 1));
            return;
        }
        rm(data, from);
        return;
    }
    if (!isObject(DataTo)) {
        throw new Error("'" + to + "': " + DataTo + " is primitive values");
    }
    set(data, to + '/' + from, dataFrom);
    rm(data, from);
}

function upDown(data, path, direction, gap) {
    if (gap === void 0) { gap = 1; }
    path = path + '';
    if (!(isNatural(gap) && gap > 0))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (!(data))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    var parent = get(data, path + '/..');
    if (!isArray(parent))
        return showError(MUST_BE_ARRAY);
    var len = parent.length;
    var index = +combingPathKey({ path: path }).keys.pop();
    if (!isNatural(index) || index > len - 1)
        return;
    var toIndex = index + direction * gap;
    if (toIndex <= 0)
        toIndex = 0;
    if (toIndex > len - 1)
        toIndex = len - 1;
    var fromData = parent[index];
    delValue(parent, index);
    insertValue(parent, toIndex, fromData);
}
function up(data, path, gap) {
    upDown(data, path, -1, gap);
}
function down(data, path, gap) {
    upDown(data, path, 1, gap);
}

function _computePath(path, direction) {
    var index = +combingPathKey({ path: path }).keys.pop();
    if (!isInteger(index))
        return null;
    if (direction === 'prev')
        return normalizePath(path, '..', index - 1);
    if (direction === 'next')
        return normalizePath(path, '..', index + 1);
    return null;
}

// check circular obj
function isCircular(obj, seen) {
    if (seen === void 0) { seen = []; }
    if (!isObject(obj)) {
        return false;
    }
    seen.push(obj);
    for (var key in obj) {
        var val = obj[key];
        if (isObject(val)) {
            if (~seen.indexOf(val) || isCircular(val, seen.slice())) {
                return true;
            }
        }
    }
    return false;
}

function objectForeach(obj, callback) {
    var isBreak = false;
    function _break() {
        isBreak = true;
    }
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var prop = _a[_i];
        if (isBreak)
            break;
        callback(obj[prop], prop, obj, { _break: _break });
    }
}
function walk(obj, descentionFn, ascentionFn) {
    if (obj === void 0) { obj = {}; }
    if (descentionFn === void 0) { descentionFn = noop; }
    if (ascentionFn === void 0) { ascentionFn = noop; }
    if (isCircular(obj))
        throw new Error("obj is a circular structure");
    var path = [];
    function _walk(obj) {
        objectForeach(obj, function (val, key, parent, _a) {
            var _break = _a._break;
            var isBreak = false;
            function _gBreak() {
                _break();
                isBreak = true;
                if (isArray(parent)) {
                    path.pop();
                }
            }
            path.push(key);
            descentionFn(val, key, parent, { path: normalizePath(path), _break: _gBreak });
            path.pop();
            if (isObject(val)) {
                path.push(key);
                if (isBreak)
                    return;
                _walk(val);
                path.pop();
                ascentionFn(val, key, parent, { path: normalizePath(path), _break: _gBreak });
            }
        });
        return obj;
    }
    return _walk(obj);
}

exports.get = get;
exports.set = set;
exports.rm = rm;
exports.swap = swap;
exports.mv = mv;
exports.insert = insert;
exports.up = up;
exports.down = down;
exports.walk = walk;
exports.normalizePath = normalizePath;
exports._computePath = _computePath;
exports.isCircular = isCircular;
