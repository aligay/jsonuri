"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var isCircular_1 = require("./isCircular");
var normalizePath_1 = require("./normalizePath");
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
    if (descentionFn === void 0) { descentionFn = util_1.noop; }
    if (ascentionFn === void 0) { ascentionFn = util_1.noop; }
    if (isCircular_1.default(obj))
        throw new Error("obj is a circular structure");
    var path = [];
    function _walk(obj) {
        objectForeach(obj, function (val, key, parent, _a) {
            var _break = _a._break;
            var isBreak = false;
            function _gBreak() {
                _break();
                isBreak = true;
                if (util_1.isArray(parent)) {
                    path.pop();
                }
            }
            path.push(key);
            descentionFn(val, key, parent, { path: normalizePath_1.default(path), _break: _gBreak });
            path.pop();
            if (util_1.isObject(val)) {
                path.push(key);
                if (isBreak)
                    return;
                _walk(val);
                path.pop();
                ascentionFn(val, key, parent, { path: normalizePath_1.default(path), _break: _gBreak });
            }
        });
        return obj;
    }
    return _walk(obj);
}
exports.default = walk;
//# sourceMappingURL=walk.js.map