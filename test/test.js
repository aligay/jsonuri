var JsonUri = require('../dist/jsonuri.common');
//console.log(JsonUri)

let exObj = {
  a: 2,
  b: {
    b1: {
      b11: 311,
      b12: 312
    },
    b2: 32
  },
  list:[0,1,2,3,4,5,6,7,8,9],
  list2:[0,1,2,3,4,5,6,7,8,9],
  list3:[0,1,2,3,4,5,['60','61','62','63'],7,8]
};


/*
JsonUri.walk(exObj, function(obj, key, raw, path) {
  //console.log(obj,key,raw, path, "入栈")
})

JsonUri.walk({a:{a1:'x'}}, function(obj, key, raw, path){
  console.log(obj, key, raw, path)
})*/

//JsonUri.up(exObj, '/list/1/');
//console.log(JsonUri.get(exObj, '/list/'))

console.log('mv:', JsonUri.get(exObj, '/list/'))
// JsonUri.mv(exObj, '/list3/6/1', '/list3/6/2', 'after')
JsonUri.mv(exObj, '/list/0/', '/list2/2', 'after')
console.log('list:', JsonUri.get(exObj, '/list/'))
console.log('list2:', JsonUri.get(exObj, '/list2/'))
//console.log('mv list2:', JsonUri.get(exObj, '/list2/'))

/*
JsonUri.mv(exObj, '/list/0', '/list/1', 'before')
//2
console.log(JsonUri.get(exObj, '/list/'))*/


/*
JsonUri.up(exObj, '/list/0/')
JsonUri.up(exObj, '/list/1/')
JsonUri.up(exObj, '/list/9/')
console.log(JsonUri.get(exObj, '/list/'))
*/



