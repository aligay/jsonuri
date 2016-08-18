'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var Server = function () {
  function Server() {
    (0, _classCallCheck3.default)(this, Server);

    this.app = express();
  }

  (0, _createClass3.default)(Server, [{
    key: 'listen',
    value: function listen(port, callback) {
      this.app.listen.apply(this.app, arguments);
    }
  }]);
  return Server;
}();

exports.default = Server;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map