"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var get_1 = require("./get");
var set_1 = require("./set");
var rm_1 = require("./rm");
var insert_1 = require("./insert");
var normalizePath_1 = require("./normalizePath");
function mv(data, from, to, direction) {
    from = from + '';
    to = to + '';
    if (!(data && from && to && util_1.isString(from) && util_1.isString(to)))
        return util_1.showError(util_1.THE_PARAMETER_IS_ILLEGAL);
    if (from === to)
        return;
    var DataTo = get_1.default(data, to);
    var dataFrom = get_1.default(data, from);
    var parentTo = get_1.default(data, to + '/..');
    var fromIndex = +(util_1.combingPathKey({ path: from }).keys.pop() || '');
    var toIndex = +(util_1.combingPathKey({ path: to }).keys.pop() || '');
    if (util_1.isArray(parentTo)) {
        if (!direction)
            throw new Error(util_1.DIRECTION_REQUIRED);
        var isInSameArray = normalizePath_1.default(from + '/..') === normalizePath_1.default(to + '/..');
        insert_1.default(data, to, dataFrom, direction);
        if (isInSameArray) {
            util_1.delValue(parentTo, fromIndex + (toIndex > fromIndex ? 0 : 1));
            return;
        }
        rm_1.default(data, from);
        return;
    }
    if (!util_1.isObject(DataTo)) {
        throw new Error("'" + to + "': " + DataTo + " is primitive values");
    }
    set_1.default(data, to + '/' + from, dataFrom);
    rm_1.default(data, from);
}
exports.default = mv;
//# sourceMappingURL=mv.js.map