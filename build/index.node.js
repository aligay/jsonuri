(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":3}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":4}],3:[function(require,module,exports){
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;
},{"../../modules/_core":9,"../../modules/es6.number.is-integer":38}],4:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;
},{"../../modules/_core":9,"../../modules/es6.object.keys":39}],5:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":23}],7:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":31,"./_to-iobject":33,"./_to-length":34}],8:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],9:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],10:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":5}],11:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],12:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":16}],13:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":17,"./_is-object":23}],14:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],15:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":9,"./_ctx":10,"./_global":17,"./_hide":19}],16:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],17:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],18:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],19:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":12,"./_object-dp":24,"./_property-desc":28}],20:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":12,"./_dom-create":13,"./_fails":16}],21:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":8}],22:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":23}],23:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],24:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":6,"./_descriptors":12,"./_ie8-dom-define":20,"./_to-primitive":36}],25:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":7,"./_has":18,"./_shared-key":29,"./_to-iobject":33}],26:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":14,"./_object-keys-internal":25}],27:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":9,"./_export":15,"./_fails":16}],28:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],29:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":30,"./_uid":37}],30:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":17}],31:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":32}],32:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],33:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":11,"./_iobject":21}],34:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":32}],35:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":11}],36:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":23}],37:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],38:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":15,"./_is-integer":22}],39:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":26,"./_object-sap":27,"./_to-object":35}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walk = exports.insert = exports.rm = exports.down = exports.up = exports.mv = exports.swap = exports.set = exports.get = undefined;

var _util = require('./util');

/**
 * Get
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @param {[type]}        return value.
 */
function get(data, path) {
  return JsonUri(data, path);
}

/**
 * Set
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @param  {Any}    value ex: {}.
 * @param {[type]}        return data this.
 */

/**
 * JsonUri
 * @author Linkjun @linkjun.com
 * @description
 *   get(data, '/menu/id/');
 *   get(data, '/menu/id/../');
 *   get(data, '/menu/id/.../');
 *   get(data, '/menu/id/~/');
 *   set(data, '/menu/id/',[0,1,2,3,4]);
 *   mv(data, '/menu/id/0', '/menu/id/2');
 *   swap(data, '/menu/id/0', '/menu/id/1');
 *   rm(data, '/menu/value/');
 */

/**
 * require isObject,
 *         isArray,
 *         arrayMove
 */
function set(data, path, value) {
  JsonUri(data, path, value);
  return data;
}

/**
 * Remove
 * @param  {Object} data  typeof Object or Array.
 * @param  {String} path  ex: '/menu/nav/list'.
 * @return {Any}          The deleted value.
 */
function rm(data, path) {
  var tmp = JsonUri(data, path);
  JsonUri(data, path, null);
  return tmp;
}

/**
 * Swap
 * @param  {Object} data    data type can be object or array.
 * @param  {String} pathA   ex: '/menu/nav/list/0'.
 * @param  {String} pathB   ex: '/menu/nav/list/2'.
 * @return {Object}         return data this.
 * @description  `pathA` the data swap `pathB`.
 */
function swap(data, pathA, pathB) {
  var _a = JsonUri(data, pathA);
  var _b = JsonUri(data, pathB);

  JsonUri(data, pathA, _b);
  JsonUri(data, pathB, _a);
  return data;
}

/**
 * Move
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @param  {String} pathB     ex: '/menu/nav/list/2'.
 * @param  {String} sequence  ex: 'before', default 'after'.
 * @description Move data in the array.
 */
function mv(data, pathA, pathB, sequence) {
  var a_parent = JsonUri(data, pathA + '/../');
  var b_parent = JsonUri(data, pathB + '/../');
  var _index = sequence === 'before' ? -1 : 0;

  if (a_parent != b_parent) {
    console.error(pathA + ' , ' + pathB + ' not in the same Array.');
    return;
  }
  if (!(0, _util.isArray)(a_parent)) {
    console.error('target parent not Array.');
    return;
  }

  var _a = JsonUri(data, pathA);
  var _b = JsonUri(data, pathB);
  var a_index = a_parent.indexOf(_a);
  var b_index = a_parent.indexOf(_b);

  //target index
  _index += b_index;

  //target index the overflow
  if (_index >= a_parent.length) _index = a_parent.length;
  if (_index <= 0) _index = 0;

  a_parent = (0, _util.arrayMove)(a_parent, a_index, _index);
}

/**
 * Up
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function up(data, path, gap) {
  var dataItem = get(data, path);
  var dataArray = get(data, path + '/../');
  var targetIndex = dataArray.indexOf(dataItem);

  var gap = gap || 1;

  if (!(0, _util.isArray)(dataArray)) return;
  targetIndex = targetIndex - gap >= 0 ? targetIndex - gap : 0;

  var pathA = path;
  var pathB = path + ('/../' + targetIndex + '/');
  console.log(data, pathA, pathB);
  mv(data, pathA, pathB, 'before');
}

/**
 * Down
 * @param  {Object} data      data type can be object or array.
 * @param  {String} pathA     ex: '/menu/nav/list/0'.
 * @description Move up data in the array.
 */
function down(data, path, gap) {
  var dataItem = get(data, path);
  var dataArray = get(data, path + '/../');
  var targetIndex = dataArray.indexOf(dataItem);
  var gap = gap || 1;

  if (!(0, _util.isArray)(dataArray)) return false;
  targetIndex = targetIndex + gap >= dataArray.length - 1 ? dataArray.length - 1 : targetIndex + gap;

  var pathA = path;
  var pathB = path + ('/../' + targetIndex + '/');
  console.log(pathA, pathB);
  mv(data, pathA, pathB, 'after');
}

/**
 * 在 path 之前 或者之后插入一个数据, 如果不是数组,控制台报错
 * @param  {[type]} data      [description]
 * @param  {[type]} path      [description]
 * @param  {String} direction [description]
 * @return {[type]}           [description]
 */
var max = Math.max;
var min = Math.min;


function insert(data, path, value) {
  var direction = arguments.length <= 3 || arguments[3] === undefined ? 'after' : arguments[3];

  var parent = get(data, path + '/../');
  var index = path.split('/').filter(function (item) {
    return item;
  }).slice(-1)[0] - 0;

  if (!(0, _util.isInteger)(index)) {
    console.error(path + '不是数字');
    return;
  }

  if (!(0, _util.isArray)(parent)) {
    console.error(path + '不是数组');
    return;
  }

  var isAfter = direction === 'after';
  var target = isAfter ? index + 1 : index;
  target = min(parent.length, target);
  target = max(0, target);
  parent.splice(target, 0, value);
  return data;
}

/**
 * JsonUri
 * @author Linkjun
 * @param {Object | Array}    data  {k:1,s:[..]}
 * @param {String}            path  '/s/0/'
 * @param {Any}               value [0,{s:0},2,3,4]
 */
function JsonUri(data, path, value) {
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
      if (value != undefined) {

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
  ;

  return cur;
}

exports.get = get;
exports.set = set;
exports.swap = swap;
exports.mv = mv;
exports.up = up;
exports.down = down;
exports.rm = rm;
exports.insert = insert;
exports.walk = _util.walk;

},{"./util":41}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

exports.isInteger = isInteger;
exports.isObject = isObject;
exports.isArray = isArray;
exports.objectForeach = objectForeach;
exports.arrayMove = arrayMove;
exports.walk = walk;
exports.combingPathKey = combingPathKey;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

function isInteger(num) {
  return (0, _isInteger2.default)(num);
}
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

function objectForeach(obj, callback) {
  (0, _keys2.default)(obj).forEach(function (prop) {
    callback(obj[prop], prop, obj);
  });
  return obj;
}

function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length;
    while (k-- + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}

/**
 * [walk description] 遍历一个对象, 提供入栈和出栈两个回调, 操作原对象
 * @param  {object} obj          [description]
 * @param  {[type]} descentionFn [description]
 * @param  {[type]} ascentionFn  [description]
 * @return {[type]}              [description]
 */
function walk() {
  var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var descentionFn = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];
  var ascentionFn = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  function _walk(obj) {
    objectForeach(obj, function (val, prop, aObj) {
      descentionFn(val, prop, aObj);
      if (val instanceof Object) {
        _walk(val);
        ascentionFn(val, prop, aObj);
      }
    });
    return obj;
  }

  return _walk(obj);
}

/**
 * Combing path keys
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
function combingPathKey(keys) {

  // {empty}
  while (~keys.indexOf('')) {
    var _i = keys.indexOf('');
    keys.splice(_i, 1);
  }

  // .
  while (~keys.indexOf('.')) {
    var _i = keys.indexOf('.');
    keys.splice(_i, 1);
  }

  // ~
  while (~keys.indexOf('~')) {
    keys = [];
  }

  // ...
  while (~keys.indexOf('...')) {
    var _i = keys.indexOf('...');
    if (_i - 2 <= 0) return keys = [];

    keys[_i] = keys[_i - 1] = keys[_i - 2] = null;
    delete keys[_i];
    delete keys[_i - 1];
    delete keys[_i - 2];
    keys.splice(_i, 1);
    keys.splice(_i - 1, 1);
    keys.splice(_i - 2, 1);
  }

  // ..
  while (~keys.indexOf('..')) {
    var _i = keys.indexOf('..');
    keys[_i] = keys[_i - 1] = null;
    delete keys[_i];
    delete keys[_i - 1];
    keys.splice(_i, 1);
    keys.splice(_i - 1, 1);
  }

  return keys;
}

},{"babel-runtime/core-js/number/is-integer":1,"babel-runtime/core-js/object/keys":2}]},{},[40]);
