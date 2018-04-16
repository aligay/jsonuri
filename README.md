# JSON URI

---

`Use URI path to get or set data.`

[![Build Status](https://api.travis-ci.org/aligay/jsonuri.svg?branch=master)](https://travis-ci.org/aligay/jsonuri/branches)
[![codecov](https://codecov.io/gh/aligay/jsonuri/branch/master/graph/badge.svg)](https://codecov.io/gh/aligay/jsonuri/branch/master)
[![npm](https://img.shields.io/npm/v/jsonuri.svg)](https://www.npmjs.com/package/jsonuri)
[![dependencies Status](https://david-dm.org/aligay/jsonuri/status.svg)](https://david-dm.org/aligay/jsonuri)
[![devDependencies Status](https://david-dm.org/aligay/jsonuri/dev-status.svg)](https://david-dm.org/aligay/jsonuri?type=dev)

## Use

```shell
$ npm install jsonuri --save
```

```javascript
import * as ju from 'jsonuri'
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
ju.get(data, '/menu/id/')
// return 123

ju.get(data, '/menu/popup/menuitem/0/value/')
// return 'New'

ju.get(data, '/menu/popup/menuitem/0/value/../')
// {value: "New", onclick: "CreateNewDoc()"}

```

### set (data, path, value)
Set the value of the specified data for the path.

**Example:**

```javascript
ju.set(data, '/menu/id/', 789)
ju.get(data, '/menu/id/')
//789

```

### rm (data, path)
Remove the value of the specified data for the path.

**Example:**

```javascript
ju.rm(data, '/menu/id/')
ju.get(data, '/menu/id/') // undefined
```


### mv (data, pathA, pathB, sequence)
Data A moved to target B before or after.

**Example:**

```javascript
ju.mv(data, '/menu/list/0', '/menu/list/3')
ju.get(data, '/menu/list/') // [1, 2, 3, 0, 4]


ju.set(data, '/menu/list/',[0,1,2,3,4])
ju.mv(data, '/menu/list/0', '/menu/list/3', 'before')
ju.get(data, '/menu/list/') // [1, 2, 0, 3, 4]

```

### swap (data, pathA, pathB)
Data swap in an array.

**Example:**

```javascript
ju.swap(data, '/menu/list/0', '/menu/list/4')
ju.get(data, '/menu/list/') // [4, 1, 2, 3, 0]

ju.swap(data, '/menu/list/0', '/menu/list/4')
ju.get(data, '/menu/list/') // [4, 1, 2, 3, 0]

```


### insert (data, pathA, value, direction)

Insert data into an `array` that is described in the path.

**Example:**

```javascript
ju.insert(data, '/menu/list/0', 9999, 'before') // [9999, 0, 1, 2, 3, 4]

```

### up(data, path, gap)



### down(data, path, gap)



### walk(data, descentionFn, ascentionFn)
Traverse each data of each node and value.

**Example:**

```javascript
ju.walk({a:{a1:'x'}}, (value, key, parent, { path }) => {
  console.log(value, key, parent, path)
})

// { a1: 'x' } 'a' { a: { a1: 'x' } } '/a/'
// x a1 { a1: 'x' } '/a/a1/'
```

### normalizePath(path1, path2, ...)

**Example:**

```javascript
ju.normalizePath('a', 'b') // /a/b/

ju.normalizePath(['a', 'b', '../'], 'c') // /a/c/


```

### isCircular(obj)

**Example:**

```javascript
ju.isCircular({}) // return false
ju.isCircular(window) // return true

var a = {}
ju.set(a, '/b/c/d/e/f/g', a)
ju.isCircular(a) // return true


```
