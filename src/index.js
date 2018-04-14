"use strict";
exports.__esModule = true;
// import { isCircular } from './util'
var get_1 = require("./get");
exports.get = get_1["default"];
var set_1 = require("./set");
exports.set = set_1["default"];
var a = {};
set_1["default"](a, 'arguments/a', 789);
set_1["default"](a, 'arguments/b', 222);
console.log(JSON.stringify(a, null, 2));
//# sourceMappingURL=index.js.map