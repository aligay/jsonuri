# JSON URI

---

Through the data `uri` operation complex json data.


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

```
get(data, '/menu/id/');
//123

get(data, '/menu/popup/menuitem/0/value/');
//"New"

get(data, '/menu/popup/menuitem/0/value/../');
//{value: "New", onclick: "CreateNewDoc()"}


get(data, '/menu/popup/menuitem/0/value/.../');
//[Object, Object, Object]

get(data, '/menu/popup/menuitem/0/value/~/');
//root data
```

### set (data, path, value)

```
set(data, '/menu/id/',789);
get(data, '/menu/id/');
//789

```

### rm (data, path)

```
rm(data, '/menu/id/');
get(data, '/menu/id/');
//undefined
```


### mv (data, pathA, pathB, sequence)

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

```
swap(data, '/menu/list/0', '/menu/list/4');
get(data, '/menu/list/');
//[4,1,2,3,0]

swap(data, '/menu/list/0', '/menu/list/4');
get(data, '/menu/list/');
//[4,1,2,3,0]

```


### insert (data, pathA, value, direction)

```
insert(data, '/menu/list/0', 9999, 'before');
//[9999,0,1,2,3,4]

```

### up(data, path, gap)

### down(data, path, gap)
