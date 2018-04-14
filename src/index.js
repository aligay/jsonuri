"use strict";
exports.__esModule = true;
var get_1 = require("./get");
exports.get = get_1["default"];
var set_1 = require("./set");
exports.set = set_1["default"];
var rm_1 = require("./rm");
exports.rm = rm_1["default"];
var normalizePath_1 = require("./normalizePath");
exports.normalizePath = normalizePath_1["default"];
var isCircular_1 = require("./isCircular");
exports.isCircular = isCircular_1["default"];
var walk_1 = require("./walk");
exports.walk = walk_1["default"];
/////////
// let obj
// let rawData = {
//   a: 2,
//   b: {
//     b1: {
//       b11: 311,
//       b12: 312
//     },
//     b2: 32
//   },
//   list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   NULL: null
// }
// obj = JSON.parse(JSON.stringify(rawData))
// rm(obj, 'list/5')
// console.log(JSON.stringify(obj, null, 2))
//# sourceMappingURL=index.js.map