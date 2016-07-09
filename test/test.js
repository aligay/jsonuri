var JsonUri = require('../dist/jsonuri.common');
console.log(JsonUri)

let exObj = {
  a: 2,
  b: {
    b1: {
      b11: 311,
      b12: 312
    },
    b2: 32
  }
};


JsonUri.walk(exObj, function(obj, key, raw, path) {
  //console.log(obj,key,raw, path, "入栈")
})



JsonUri.walk({a:{a1:'x'}}, function(obj, key, raw, path){
  console.log(obj, key, raw, path)
})