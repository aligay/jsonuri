"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function get(data, path) {
    path = path + '';
    if (!(data))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    if (path === '')
        return data;
    if (!util_1.isComplexPath(path))
        return data[path];
    var ret;
    var keys = util_1.combingPathKey({ path: path }).keys;
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
exports.default = get;
//# sourceMappingURL=get.js.map