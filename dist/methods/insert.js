"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var get_1 = require("./get");
function insert(data, path, value, direction) {
    path = path + '';
    if (!(data))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    if (!direction)
        throw new Error(util_1.DIRECTION_REQUIRED);
    var parent = get_1.default(data, path + '/..');
    if (!util_1.isArray(parent))
        throw new Error("insert node " + util_1.MUST_BE_ARRAY);
    var index = +(util_1.combingPathKey({ path: path }).keys.pop() || '');
    var toIndex = index;
    if (direction === 'after') {
        toIndex = index + 1;
    }
    else if (direction === 'before') {
        toIndex = index;
    }
    else if (direction === 'append') {
        // TODO
    }
    util_1.insertValue(parent, toIndex, value);
}
exports.default = insert;
//# sourceMappingURL=insert.js.map