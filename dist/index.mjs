const IS_NOT_A_NATURAL_NUMBER = 'is not a natural number';
const MUST_BE_ARRAY = 'must be a Array';
const THE_PARAMETER_IS_ILLEGAL = 'the parameter is illegal';
const DIRECTION_REQUIRED = `direction must be 'before' | 'after' | 'append'`;
const THE_INDEX_OUT_OF_BOUNDS = 'the Index Out of Bounds';
function noop() { }
const isArray = Array.isArray;
function isString(s) {
    return typeof s === 'string';
}
function isInteger(n) {
    return Number.isInteger(n); // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
}
function isNatural(n) {
    return isInteger(n) && n >= 0;
}
const pathReg = /\//;
function isComplexPath(s) {
    return pathReg.test(s);
}
function isObject(o) {
    // [^Undefined, Null, boolean, Number, String, Symbol]
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
    const type = typeof o;
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
            throw new Error(`value: ${value} ${IS_NOT_A_NATURAL_NUMBER}`);
        if (value > obj.length)
            obj.length = value;
        obj.splice(value);
        return;
    }
    // if isArray, key should be a number
    let index = +key;
    if (!isNatural(index)) {
        showError(`key: ${key} ${IS_NOT_A_NATURAL_NUMBER}`);
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
        let index = +key;
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
function insertValue(arr, key, value, direction = 'after') {
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
    const path = param.path || '';
    // if (combingCache[path]) {
    //   return combingCache[path]
    // }
    let keys;
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
        let _i = keys.indexOf('');
        keys.splice(_i, 1);
    }
    // .
    while (~keys.indexOf('.')) {
        let _i = keys.indexOf('.');
        keys.splice(_i, 1);
    }
    // ..
    while (~keys.indexOf('..')) {
        let _i = keys.indexOf('..');
        keys[_i] = keys[_i - 1] = '';
        delete keys[_i];
        delete keys[_i - 1];
        keys.splice(_i, 1);
        keys.splice(_i - 1, 1);
    }
    const ret = {
        keys,
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
    let ret;
    const keys = combingPathKey({ path }).keys;
    if (!keys.length) {
        return data;
    }
    const len = keys.length;
    let i = 0;
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
    const keys = combingPathKey({ path }).keys;
    for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i];
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
    let parent = get(data, path + '/..');
    if (!parent)
        return;
    let key = combingPathKey({ path }).keys.pop() || '';
    delValue(parent, key);
}

function swap(data, pathA, pathB) {
    pathA = pathA + '';
    pathB = pathB + '';
    if (!(data && pathA && pathB && isString(pathA) && isString(pathB)))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    const dataA = get(data, pathA);
    const dataB = get(data, pathB);
    set(data, pathB, dataA);
    set(data, pathA, dataB);
}

function insert(data, path, value, direction) {
    path = path + '';
    if (!(data))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (!direction)
        throw new Error(DIRECTION_REQUIRED);
    const parent = get(data, path + '/..');
    if (!isArray(parent))
        throw new Error(`insert node ${MUST_BE_ARRAY}`);
    const index = +combingPathKey({ path }).keys.pop();
    let toIndex = index;
    if (direction === 'after') {
        toIndex = index + 1;
    }
    else if (direction === 'before') {
        toIndex = index;
    }
    else if (direction === 'append') {
        // TODO
    }
    insertValue(parent, toIndex, value);
}

const arrPro = Array.prototype;
function normalizePath(...path) {
    const pathArr = arrPro.concat.apply(arrPro, path).join('/').split('/');
    const pathStr = combingPathKey({ keys: pathArr }).path;
    return pathStr;
}

function mv(data, from, to, direction) {
    from = from + '';
    to = to + '';
    if (!(data && from && to && isString(from) && isString(to)))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (from === to)
        return;
    const DataTo = get(data, to);
    const dataFrom = get(data, from);
    const parentTo = get(data, to + '/..');
    const fromIndex = +(combingPathKey({ path: from }).keys.pop() || '');
    const toIndex = +(combingPathKey({ path: to }).keys.pop() || '');
    if (isArray(parentTo)) {
        if (!direction)
            throw new Error(DIRECTION_REQUIRED);
        const isInSameArray = normalizePath(from + '/..') === normalizePath(to + '/..');
        insert(data, to, dataFrom, direction);
        if (isInSameArray) {
            delValue(parentTo, fromIndex + (toIndex > fromIndex ? 0 : 1));
            return;
        }
        rm(data, from);
        return;
    }
    if (!isObject(DataTo)) {
        throw new Error(`'${to}': ${DataTo} is primitive values`);
    }
    set(data, to + '/' + from, dataFrom);
    rm(data, from);
}

function upDown(data, path, direction, gap = 1) {
    path = path + '';
    if (!(isNatural(gap) && gap > 0))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    if (!(data))
        return showError(THE_PARAMETER_IS_ILLEGAL);
    const parent = get(data, path + '/..');
    if (!isArray(parent))
        return showError(MUST_BE_ARRAY);
    const len = parent.length;
    const index = +combingPathKey({ path }).keys.pop();
    if (!isNatural(index) || index > len - 1)
        return;
    let toIndex = index + direction * gap;
    if (toIndex <= 0)
        toIndex = 0;
    if (toIndex > len - 1)
        toIndex = len - 1;
    const fromData = parent[index];
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
    let index = +combingPathKey({ path }).keys.pop();
    if (!isInteger(index))
        return null;
    if (direction === 'prev')
        return normalizePath(path, '..', index - 1);
    if (direction === 'next')
        return normalizePath(path, '..', index + 1);
    return null;
}

// check circular obj
function isCircular(obj, seen = []) {
    if (!isObject(obj)) {
        return false;
    }
    seen.push(obj);
    for (const key in obj) {
        const val = obj[key];
        if (isObject(val)) {
            if (~seen.indexOf(val) || isCircular(val, seen.slice())) {
                return true;
            }
        }
    }
    return false;
}

function objectForeach(obj, callback) {
    let isBreak = false;
    function _break() {
        isBreak = true;
    }
    for (let prop of Object.keys(obj)) {
        if (isBreak)
            break;
        callback(obj[prop], prop, obj, { _break });
    }
}
function walk(obj = {}, descentionFn = noop, ascentionFn = noop) {
    if (isCircular(obj))
        throw new Error(`obj is a circular structure`);
    let path = [];
    function _walk(obj) {
        objectForeach(obj, (val, key, parent, { _break }) => {
            let isBreak = false;
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

export { get, set, rm, swap, mv, insert, up, down, walk, normalizePath, _computePath, isCircular };
