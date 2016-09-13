var JsonUri = require('../dist/jsonuri.common');
function A(a, b) {
  this.a = a || 'a'
  this.b = b || 'b'
}
A.c = 'c'
A.prototype.hello = function () {
  // console.log(this.a + this.b)
}

var data = {
  a: 2,
  b: {
    b1: {
      b11: 311,
      b12: 312,
      b13: {
        b131: 'b131'
      }
    },
    b2: 32
  }
};

data.c = data
data = Object.assign({}, data, {
  list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  Foo: A,
  foo: new A,
  hello: (new A({a: global})).hello()
})

console.log(data)

// console.log(data.c === data)
JsonUri.walk(data, (v, k, parent, {path, _break}) => {
  console.log(path)
  // if(path === '/b/b1/') {
  //   _break()
  // }
})

JsonUri.walk(global, function (v, k, parent, more) {
  console.log(more.path)
})

