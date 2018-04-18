"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var get_1 = require("./get");
function rm(data, path) {
    path = path + '';
    if (!(data && path))
        return;
    if (!util_1.isComplexPath(path)) {
        util_1.delValue(data, path);
        return;
    }
    var parent = get_1.default(data, path + '/..');
    if (!parent)
        return;
    var key = util_1.combingPathKey({ path: path }).keys.pop() || '';
    util_1.delValue(parent, key);
}
exports.default = rm;
//# sourceMappingURL=rm.js.map