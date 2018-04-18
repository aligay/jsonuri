"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arrPro = Array.prototype;
var util_1 = require("../util");
function normalizePath() {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    var pathArr = arrPro.concat.apply(arrPro, path).join('/').split('/');
    var pathStr = util_1.combingPathKey({ keys: pathArr }).path;
    return pathStr;
}
exports.default = normalizePath;
//# sourceMappingURL=normalizePath.js.map