/*!
* jsonuri v3.4.4
* (c) 2024 @aligay
* Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var IS_NOT_A_NATURAL_NUMBER = 'is not a natural number';
var MUST_BE_ARRAY = 'must be a Array';
var THE_PARAMETER_IS_ILLEGAL = 'the parameter is illegal';
var DIRECTION_REQUIRED = 'direction must be \'before\' | \'after\' | \'append\'';
var THE_INDEX_OUT_OF_BOUNDS = 'the Index Out of Bounds';
var noop = function () { };
var isArray = Array.isArray;
var isString = function (s) {
    return typeof s === 'string';
};
var isInteger = function (n) {
    return Number.isInteger(n); // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
};
var isNatural = function (n) {
    return isInteger(n) && n >= 0;
};
var pathReg = /\//;
var isComplexPath = function (s) {
    return pathReg.test(s);
};
var isObject = function (o) {
    // [^Undefined, Null, boolean, Number, String, Symbol]
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
    var type = typeof o;
    return o != null && (type === 'object' || type === 'function');
};
var toString = function (s) {
    /* eslint-disable-next-line */
    return s + '';
};
var showError = function (s) {
    console.error(s);
};
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
var setValue = function (obj, key, value) {
    if (!isArray(obj)) {
        obj[key] = value;
        return;
    }
    if (key === 'length') {
        /* eslint-disable-next-line */
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
};
/**
 * 让数组的删除可被监听
 */
var delValue = function (obj, key) {
    if (isArray(obj)) {
        var index = +key;
        if (!isNatural(index))
            return;
        obj.splice(index, 1);
    }
    else {
        /* eslint-disable-next-line */
        delete obj[key];
    }
};
/**
 * insertValue
 */
var insertValue = function (arr, key, value, direction) {
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
};
var REG_PATH_SPLIT = '/';
// let combingCache: any = {}
var combingPathKey = function (param) {
    var _a;
    var path = (_a = param.path) !== null && _a !== void 0 ? _a : '';
    // if (combingCache[path]) {
    //   return combingCache[path]
    // }
    var keys;
    if (param.keys == null) {
        keys = param.path.split(REG_PATH_SPLIT);
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
        /* eslint-disable-next-line */
        delete keys[_i];
        /* eslint-disable-next-line */
        delete keys[_i - 1];
        keys.splice(_i, 1);
        keys.splice(_i - 1, 1);
    }
    var ret = {
        keys: keys,
        path: keys.join(REG_PATH_SPLIT)
    };
    return ret;
};

var get = (function (data, path) {
    if (data == null)
        return data;
    path = toString(path);
    if (path === '')
        return data;
    if (!isComplexPath(path))
        return data[path];
    var ret;
    var keys = combingPathKey({ path: path }).keys;
    if (keys.length === 0) {
        return data;
    }
    var len = keys.length;
    for (var i = 0; i < len; ++i) {
        /* eslint-disable-next-line */
        ret = (i ? ret : data)[keys[i]];
        if (ret == null)
            break;
    }
    return ret;
});

/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */
var isPrototypePolluted = function (key) { return ['__proto__', 'prototype', 'constructor'].includes(key); };
var set = (function (data, path, value) {
    path = toString(path);
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    if (!(data && path))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    if (!isComplexPath(path))
        return setValue(data, path, value);
    var keys = combingPathKey({ path: path }).keys;
    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        if (isPrototypePolluted(key))
            continue;
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
    return data;
});

var rm = (function (data, path) {
    var _a;
    path = toString(path);
    if (!(data && path))
        return;
    if (!isComplexPath(path)) {
        delValue(data, path);
        return;
    }
    var parent = get(data, path + '/..');
    if (!parent)
        return;
    var key = (_a = combingPathKey({ path: path }).keys.pop()) !== null && _a !== void 0 ? _a : '';
    delValue(parent, key);
});

var swap = (function (data, pathA, pathB) {
    pathA = toString(pathA);
    pathB = toString(pathB);
    if (!(data && pathA && pathB && isString(pathA) && isString(pathB))) {
        showError(THE_PARAMETER_IS_ILLEGAL);
        return;
    }
    var dataA = get(data, pathA);
    var dataB = get(data, pathB);
    set(data, pathB, dataA);
    set(data, pathA, dataB);
});

var insert = (function (data, path, value, direction) {
    path = toString(path);
    if (!data) {
        showError(THE_PARAMETER_IS_ILLEGAL);
        return;
    }
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
});

var arrPro = Array.prototype;
var normalizePath = (function () {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    var pathArr = arrPro.concat.apply(arrPro, path).join('/').split('/');
    var pathStr = combingPathKey({ keys: pathArr }).path;
    return pathStr;
});

var formPathIsPartOfToParentPath = function (from, to) {
    var pathTo = to.split('/');
    var pathFrom = from.split('/');
    var parentPathTo = pathTo.slice(0, pathTo.length - 1);
    var parentPathForm = pathFrom.slice(0, pathTo.length - 1);
    if (pathTo.length > pathFrom.length)
        return false;
    return parentPathTo.join('/') === parentPathForm.join('/');
};
var mv = (function (data, from, to, direction) {
    var _a, _b, _c;
    from = toString(from);
    to = toString(to);
    if (!(data && from && to && isString(from) && isString(to))) {
        showError(THE_PARAMETER_IS_ILLEGAL);
        return;
    }
    if (from === to)
        return;
    var DataTo = get(data, to);
    var dataFrom = get(data, from);
    var parentTo = get(data, to + '/..');
    var fromIndex = +((_a = combingPathKey({ path: from }).keys.pop()) !== null && _a !== void 0 ? _a : '');
    var toIndex = +((_b = combingPathKey({ path: to }).keys.pop()) !== null && _b !== void 0 ? _b : '');
    if (isArray(parentTo)) {
        if (!direction)
            throw new Error(DIRECTION_REQUIRED);
        var isInSameArray = normalizePath(from + '/..') === normalizePath(to + '/..');
        if (isInSameArray) {
            insert(data, to, dataFrom, direction);
            delValue(parentTo, fromIndex + (toIndex > fromIndex ? 0 : 1));
            return;
        }
        var isParentInSameArray = formPathIsPartOfToParentPath(from, to);
        if (isParentInSameArray) {
            var _fromIndex = +((_c = from.split('/').slice(0, to.split('/').length).pop()) !== null && _c !== void 0 ? _c : '');
            if (toIndex < _fromIndex) {
                // 如果把 from 插入 to 位置后，改变了原来 from 的位置，则要先删除后添加
                rm(data, from);
                insert(data, to, dataFrom, direction);
                return;
            }
        }
        insert(data, to, dataFrom, direction);
        rm(data, from);
        return;
    }
    if (!isObject(DataTo)) {
        throw new Error("'" + to + "': " + DataTo + " is primitive values");
    }
    set(data, to + '/' + from, dataFrom);
    rm(data, from);
});

var upDown = function (data, path, direction, gap) {
    if (gap === void 0) { gap = 1; }
    path = toString(path);
    if (!(isNatural(gap) && gap > 0)) {
        showError(THE_PARAMETER_IS_ILLEGAL);
        return;
    }
    if (!(data)) {
        showError(THE_PARAMETER_IS_ILLEGAL);
        return;
    }
    /* eslint-disable-next-line */
    var parent = get(data, path + '/..');
    if (!isArray(parent)) {
        showError(MUST_BE_ARRAY);
        return;
    }
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
};
var up = function (data, path, gap) {
    upDown(data, path, -1, gap);
};
var down = function (data, path, gap) {
    upDown(data, path, 1, gap);
};

var _computePath = function (path, direction) {
    var index = +combingPathKey({ path: path }).keys.pop();
    if (!isInteger(index))
        return null;
    if (direction === 'prev')
        return normalizePath(path, '..', index - 1);
    if (direction === 'next')
        return normalizePath(path, '..', index + 1);
    return null;
};

// check circular obj
var isCircular = function (obj, _seen) {
    if (_seen === void 0) { _seen = []; }
    if (!isObject(obj)) {
        return false;
    }
    _seen.push(obj);
    for (var key in obj) {
        /* eslint-disable-next-line */
        if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            if (isObject(val)) {
                if (~_seen.indexOf(val) || isCircular(val, _seen.slice())) {
                    return true;
                }
            }
        }
    }
    return false;
};

var objectForeach = function (obj, callback) {
    var isBreak = false;
    var _break = function () {
        isBreak = true;
    };
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var prop = _a[_i];
        if (isBreak)
            break;
        callback(obj[prop], prop, obj, { _break: _break });
    }
};
var walk = function (obj, descentionFn, ascentionFn) {
    if (obj === void 0) { obj = {}; }
    if (descentionFn === void 0) { descentionFn = noop; }
    if (ascentionFn === void 0) { ascentionFn = noop; }
    if (isCircular(obj))
        throw new Error('obj is a circular structure');
    var path = [];
    var _walk = function (obj) {
        objectForeach(obj, function (val, key, parent, _a) {
            var _break = _a._break;
            var isBreak = false;
            var _gBreak = function () {
                _break();
                isBreak = true;
                if (isArray(parent)) {
                    path.pop();
                }
            };
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
    };
    return _walk(obj);
};

exports._computePath = _computePath;
exports.down = down;
exports.get = get;
exports.insert = insert;
exports.isCircular = isCircular;
exports.mv = mv;
exports.normalizePath = normalizePath;
exports.rm = rm;
exports.set = set;
exports.swap = swap;
exports.up = up;
exports.walk = walk;
