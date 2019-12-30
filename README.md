# JSON URI

---

`Use URI style methods to operate data.`
All operations friendly support Vue-like frameworks.

[![Build Status](https://travis-ci.com/aligay/jsonuri.svg?branch=master)](https://travis-ci.com/github/aligay/jsonuri/branches)
[![codecov](https://codecov.io/gh/aligay/jsonuri/branch/master/graph/badge.svg)](https://codecov.io/gh/aligay/jsonuri/branch/master)
[![npm](https://img.shields.io/npm/v/jsonuri.svg)](https://www.npmjs.com/package/jsonuri)
[![dependencies Status](https://david-dm.org/aligay/jsonuri/status.svg)](https://david-dm.org/aligay/jsonuri)
[![devDependencies Status](https://david-dm.org/aligay/jsonuri/dev-status.svg)](https://david-dm.org/aligay/jsonuri?type=dev)

## Use

```shell
$ npm install jsonuri --save
```

```javascript
import * as jsonuri from 'jsonuri'
// or
import { get, set, ... } from 'jsonuri' // recommended practice, friendly to tree-shaking
```

### Example Data:
```json
{
  "menu": {
    "id": 123,
    "list": [0, 1, 2, 3, 4],
    "popup": {
      "menuitem": [{
          "value": "New",
          "onclick": "CreateNewDoc()"
        },
        {
          "value": "Open",
          "onclick": "OpenDoc()"
        },
        {
          "value": "Close",
          "onclick": "CloseDoc()"
        }
      ]
    }
  }
}

```

## Methods:

### get (data, path)
Get the value of the specified data for the path.


**Example:**

```javascript
jsonuri.get(data, 'menu/id')
// return 123

jsonuri.get(data, 'menu/popup/menuitem/0/value')
// return 'New'

jsonuri.get(data, 'menu/popup/menuitem/0/value/..')
// {value: "New", onclick: "CreateNewDoc()"}

```
[see more](test/spec/get_spec.js)
### set (data, path, value)
Set the value of the specified data for the path.

**Example:**

```javascript
jsonuri.set(data, 'menu/id/', 789)
jsonuri.get(data, 'menu/id')
//789

```
[see more](test/spec/set_spec.js)

### rm (data, path)
Remove the value of the specified data for the path.

**Example:**

```javascript
jsonuri.rm(data, 'menu/id')
jsonuri.get(data, 'menu/id') // undefined
```
[see more](test/spec/rm_spec.js)


### mv (data, pathA, pathB, sequence)
Data A moved to target B before or after.

**Example:**

```javascript
jsonuri.mv(data, 'menu/list/0', 'menu/list/3')
jsonuri.get(data, 'menu/list') // [1, 2, 3, 0, 4]
[see more](test/spec/mv_spec.js)


jsonuri.set(data, 'menu/list/',[0,1,2,3,4])
jsonuri.mv(data, 'menu/list/0', 'menu/list/3', 'before')
jsonuri.get(data, 'menu/list') // [1, 2, 0, 3, 4]

```
[see more](test/spec/mv_spec.js)

### swap (data, pathA, pathB)
Data swap in an array.

**Example:**

```javascript
jsonuri.swap(data, 'menu/list/0', 'menu/list/4')
jsonuri.get(data, 'menu/list') // [4, 1, 2, 3, 0]

jsonuri.swap(data, 'menu/list/0', 'menu/list/4')
jsonuri.get(data, 'menu/list') // [4, 1, 2, 3, 0]

```
[see more](test/spec/swap_spec.js)


### insert (data, pathA, value, direction)

Insert data into an `array` that is described in the path.

**Example:**

```javascript
jsonuri.insert(data, 'menu/list/0', 9999, 'before') // [9999, 0, 1, 2, 3, 4]

```
[see more](test/spec/insert_spec.js)


### up(data, path, gap)
[see more](test/spec/up_spec.js)


### down(data, path, gap)

[see more](test/spec/down_spec.js)


### walk(data, descentionFn, ascentionFn)
Traverse each data of each node and value.

**Example:**

```javascript
jsonuri.walk({a:{a1:'x'}}, (value, key, parent, { path }) => {
  console.log(value, key, parent, path)
})

// { a1: 'x' } 'a' { a: { a1: 'x' } } 'a'
// x a1 { a1: 'x' } 'a/a1'
```
[see more](test/spec/walk_spec.js)

### normalizePath(path1, path2, ...)

**Example:**

```javascript
jsonuri.normalizePath('a', 'b') // a/b

jsonuri.normalizePath(['a', 'b', '../'], 'c') // a/c


```
[see more](test/spec/normalizePath_spec.js)

### isCircular(obj)

**Example:**

```javascript
jsonuri.isCircular({}) // return false
jsonuri.isCircular(window) // return true

var a = {}
jsonuri.set(a, '/b/c/d/e/f/g', a)
jsonuri.isCircular(a) // return true


```
[see more](test/spec/isCircular_spec.js)
