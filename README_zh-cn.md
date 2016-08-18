# JSON URI

---
[![Build Status](https://travis-ci.org/haozime/safe-trim.svg?branch=master)](https://travis-ci.org/haozime/safe-trim/branches)
[![codecov](https://codecov.io/gh/haozime/safe-trim/branch/master/graph/badge.svg)](https://codecov.io/gh/haozime/safe-trim)
[![dependencies Status](https://david-dm.org/haozime/safe-trim/status.svg)](https://david-dm.org/haozime/safe-trim)
[![devDependencies Status](https://david-dm.org/haozime/safe-trim/dev-status.svg)](https://david-dm.org/haozime/safe-trim?type=dev)

[Enlish](README.md)

`Use URI path to get or set data.`

![show](https://img.alicdn.com/tfs/TB12AVCKVXXXXcRXVXXXXXXXXXX-640-121.png)


## Install

```
$ npm install jsonuri --save
```

### Example Data:
```
{
    "menu": {
        "id": 123,
        "list": [0,1,2,3,4],
        "popup": {
            "menuitem": [
                {
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

```
get(data, '/menu/id/');
//123

get(data, '/menu/popup/menuitem/0/value/');
//"New"

get(data, '/menu/popup/menuitem/0/value/../');
//{value: "New", onclick: "CreateNewDoc()"}

```

### set (data, path, value)
Set the value of the specified data for the path.

**Example:**

```
set(data, '/menu/id/',789);
get(data, '/menu/id/');
//789

```

### rm (data, path)
Remove the value of the specified data for the path.

**Example:**

```
rm(data, '/menu/id/');
get(data, '/menu/id/');
//undefined
```


### mv (data, pathA, pathB, sequence)
Data A moved to target B before or after.

**Example:**

```
mv(data, '/menu/list/0', '/menu/list/3');
get(data, '/menu/list/');
//[1,2,3,0,4]


set(data, '/menu/list/',[0,1,2,3,4]);
mv(data, '/menu/list/0', '/menu/list/3', 'before');
get(data, '/menu/list/');
//[1,2,0,3,4]

```

### swap (data, pathA, pathB)
Data swap in an array.

**Example:**

```
swap(data, '/menu/list/0', '/menu/list/4');
get(data, '/menu/list/');
//[4,1,2,3,0]

swap(data, '/menu/list/0', '/menu/list/4');
get(data, '/menu/list/');
//[4,1,2,3,0]

```


### insert (data, pathA, value, direction)

Insert data into an `array` that is described in the path.

**Example:**

```
insert(data, '/menu/list/0', 9999, 'before');
//[9999,0,1,2,3,4]

```

### up(data, path, gap)



### down(data, path, gap)



### walk(data, descentionFn, ascentionFn)
Traverse each data of each node and value.

**Example:**

```
walk({a:{a1:'x'}}, function(obj, key, raw, path){
  console.log(obj, key, raw, path)
})

// { a1: 'x' } 'a' { a: { a1: 'x' } } '/a/'
// x a1 { a1: 'x' } /a/a1/
```

### normalizePath(path1, path2, ...)

**Example:**

```
normalizePath('a', 'b')
// /a/b/

normalizePath(['a', 'b', '../'], 'c')
// /a/c/


```
