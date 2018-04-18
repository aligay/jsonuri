"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var get_1 = require("./get");
var set_1 = require("./set");
function swap(data, pathA, pathB) {
    pathA = pathA + '';
    pathB = pathB + '';
    if (!(data && pathA && pathB && util_1.isString(pathA) && util_1.isString(pathB)))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    var dataA = get_1.default(data, pathA);
    var dataB = get_1.default(data, pathB);
    set_1.default(data, pathB, dataA);
    set_1.default(data, pathA, dataB);
}
exports.default = swap;
//# sourceMappingURL=swap.js.map