"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function set(data, path, value) {
    path = path + '';
    if (!(data && path))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    if (!util_1.isComplexPath(path))
        return util_1.setValue(data, path, value);
    var keys = util_1.combingPathKey({ path: path }).keys;
    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        if (data[key] == null) {
            data[key] = {};
        }
        if (i === len - 1) {
            util_1.setValue(data, key, value);
        }
        else {
            data = data[key];
        }
    }
}
exports.default = set;
//# sourceMappingURL=set.js.map