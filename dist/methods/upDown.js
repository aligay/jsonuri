"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var get_1 = require("./get");
function upDown(data, path, direction, gap) {
    if (gap === void 0) { gap = 1; }
    path = path + '';
    if (!(util_1.isNatural(gap) && gap > 0))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    if (!(data))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    var parent = get_1.default(data, path + '/..');
    if (!util_1.isArray(parent))
        return util_1.showError(util_1.MUST_BE_ARRAY);
    var len = parent.length;
    var index = +(util_1.combingPathKey({ path: path }).keys.pop() || '');
    if (!util_1.isNatural(index) || index > len - 1)
        return;
    var toIndex = index + direction * gap;
    if (toIndex <= 0)
        toIndex = 0;
    if (toIndex > len - 1)
        toIndex = len - 1;
    var fromData = parent[index];
    util_1.delValue(parent, index);
    util_1.insertValue(parent, toIndex, fromData);
}
function up(data, path, gap) {
    upDown(data, path, -1, gap);
}
exports.up = up;
function down(data, path, gap) {
    upDown(data, path, 1, gap);
}
exports.down = down;
//# sourceMappingURL=upDown.js.map