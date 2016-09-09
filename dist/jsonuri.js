'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

/**
 * Jsonuri
 * @author Linkjun
 * @param {Object | Array}    data  {k:1,s:[..]}
 * @param {String}            path  '/s/0/'
 * @param {Any}               value [0,{s:0},2,3,4]
 */
function Jsonuri(data, path, value) {
  //Data must be Object.
  if (!(data instanceof Object)) return;

  //Path must be valid.
  if (!path) return data;

  //Combing Path Key.
  var keys = (0, _util.combingPathKey)(String(path).split('/'));
  //Initialize data to the pointer.
  var cur = data;

  for (var i = 0; i < keys.length; i++) {
    //Key must be valid.
    if (!keys[i]) continue;

    if (i === keys.length - 1) {
      if (value !== undefined) {
        //set value.
        cur[keys[i]] = value;
      } else if (value === null) {
        //delete value in the object.
        if ((0, _util.isObject)(cur)) {
          cur[keys[i]] = null;
          delete cur[keys[i]];
        }

        //delete value in the array.
        if ((0, _util.isArray)(cur)) {
          cur[keys[i]] = null;
          cur.splice(keys[i], 1);
        }
      }
    } else if (value) {
      //if set value
      var _nextKey = keys[i + 1];

      //curData is undefined.
      if (!cur[keys[i]]) {
        //create data container.
        var _curType = _nextKey * 0 === 0 ? 'Array' : 'Object';
        if (_curType === 'Array') {
          cur[keys[i]] = [];
        } else if (_curType === 'Object') {
          cur[keys[i]] = {};
        }
      }
    } else {
      if (cur[keys[i]] === undefined) {
        //Data path is undefined and return.
        return undefined;
      } else if (cur[keys[i]] === null) {
        return null;
      }
    }

    cur = cur[keys[i]];
  }

  return cur;
}

exports.default = Jsonuri;
module.exports = exports['default'];
//# sourceMappingURL=jsonuri.js.map