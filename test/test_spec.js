'use strict';
[
  './jsonuri.1.x',
  // '../dist/index',
  // '../dist/jsonuri.common.js',
  // '../dist/jsonuri.js'
].forEach((path) => {
  require('./test_each')(require(path))
})
