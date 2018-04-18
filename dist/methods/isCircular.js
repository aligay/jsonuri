"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
// check circular obj
function isCircular(obj, seen) {
    if (seen === void 0) { seen = []; }
    if (!util_1.isObject(obj)) {
        return false;
    }
    seen.push(obj);
    for (var key in obj) {
        var val = obj[key];
        if (util_1.isObject(val)) {
            if (~seen.indexOf(val) || isCircular(val, seen.slice())) {
                return true;
            }
        }
    }
    return false;
}
exports.default = isCircular;
//# sourceMappingURL=isCircular.js.map