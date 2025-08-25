# jsonuri

English | [简体中文](README.zh_CN.md)

A lightweight and powerful JSON object manipulation library that uses Linux-style path expressions to access and modify nested JSON data, allowing quick access to parent structures of data.

[![npm](https://img.shields.io/npm/v/jsonuri.svg)](https://www.npmjs.com/package/jsonuri)
[![codecov](https://codecov.io/gh/aligay/jsonuri/branch/master/graph/badge.svg)](https://app.codecov.io/gh/aligay/jsonuri/blob/master/dist%2Findex.js)
[![contributors](https://img.shields.io/github/contributors/aligay/jsonuri)](https://github.com/aligay/jsonuri/graphs/contributors)
[![LICENSE](https://img.shields.io/npm/l/jsonuri)](https://github.com/aligay/jsonuri/blob/master/LICENSE)
[![Size](https://img.shields.io/bundlephobia/minzip/jsonuri.svg)](https://cdn.jsdelivr.net/npm/jsonuri/+esm)

---

## Install

```bash
npm i jsonuri
# or pnpm add jsonuri / yarn add jsonuri
```

Usage:

```ts
// Recommended on-demand import (helps with tree-shaking)
import {
  get,
  set,
  rm,
  insert,
  mv,
  swap,
  up,
  down,
  normalizeUri,
  parseUri,
  parent,
  parents,
  isCircular,
  walk,
  walkTopDownDFS,
  walkTopDownBFS,
  walkBottomUpDFS,
  walkBottomUpBFS,
} from 'jsonuri'

// Or import everything
import * as jsonuri from 'jsonuri'
```

---

## Path rules

- Separator: `/` (e.g., `menu/popup/menuitem/0/value`)

- Current level: `.` ; parent: `..`

- Escaped slash: use `\/` inside key names, e.g., `a\/b/c` parses to segments `["a/b", "c"]`

- Array shortcut segments (only parsed in `get`, and the current value must be an array):
  - `@first` (first element)
  - `@last` or `@length-1` (last element)
  - `@length-N` (the N-th from the end, `N` ≥ 0 and integer)

- Determining **simple key** vs **complex path**:
  If the passed `path` is a string without `/` or a non-negative integer index, it is treated as “simple key/index”; otherwise it is parsed as a “complex path”.

> If during path parsing the parent exceeds the root (for example too many `..`), parsing will be considered invalid and return an empty result.

---

## Example data

```json
{
  "menu": {
    "id": 123,
    "list": [0, 1, 2, 3, 4],
    "popup": {
      "menuitem": [
        { "value": "New", "onclick": "CreateNewDoc()" },
        { "value": "Open", "onclick": "OpenDoc()" },
        { "value": "Close", "onclick": "CloseDoc()" }
      ]
    }
  }
}
```

The following examples assume the variable `data` is the JSON above.

---

## API

### `get(data, path)`

Read value by path.

```ts
get(data, 'menu/id') // 123
get(data, 'menu/popup/menuitem/0/value') // "New"
get(data, 'menu/popup/menuitem/0/value/..') // { value: "New", onclick: "CreateNewDoc()" }
get(data, 'menu/popup/menuitem/@last/value') // "Close"
get([10, 11, 12], '@length-2') // 11
get(data, '/') // entire data
```

> If `null/undefined` is encountered along the way, return that value directly; invalid path returns `undefined`.

---

### `set(data, path, value)`

Write value by path. Missing intermediate levels will be created as objects.
For arrays, `splice` will be used; writing key name `length` will shrink/expand array length.

```ts
set(data, 'menu/id', 789)
get(data, 'menu/id') // 789

set(data, 'menu/list/7', 999) // auto expand to index 7
get(data, 'menu/list') // [0,1,2,3,4, undefined, undefined, 999]

// directly change length (simple key)
const arr = [0, 1, 2, 3]
set(arr, 'length', 2)
arr // [0,1]
```

> Protected key names: `__proto__` / `prototype` / `constructor` will be **skipped** (not created/written).

---

### `rm(data, path)`

Delete value/item by path (`delete` for objects, `splice` for arrays).

```ts
rm(data, 'menu/id')
get(data, 'menu/id') // undefined

rm(data, 'menu/list/1')
get(data, 'menu/list') // [0,2,3,4]
```

---

### `insert(data, path, value, direction = 'before')`

**Only effective for arrays**: insert an element **before/after** the index pointed by `path`.
`direction` only supports `'before' | 'after'`.

```ts
// insert 9999 before index 0
insert(data, 'menu/list/0', 9999, 'before') // [9999,0,1,2,3,4]

// insert -1 after index 2
insert(data, 'menu/list/2', -1, 'after') // [9999,0,1,2,-1,3,4]
```

> If index `< 0` or `> length` will throw “Index Out of Bounds”.
> Source code contains an `'inside'` branch but only prints TODO; **not provided**.
> Text constant contains `'append'` but implementation does **not support** `'append'`.

---

### `mv(data, fromPath, toPath, direction = 'before')`

Move node. Common usage is moving **array elements** across/same level to target index before/after.

```ts
set(data, 'menu/list', [0, 1, 2, 3, 4])
mv(data, 'menu/list/0', 'menu/list/3') // default 'before'
get(data, 'menu/list') // [1,2,3,0,4]

set(data, 'menu/list', [0, 1, 2, 3, 4])
mv(data, 'menu/list/0', 'menu/list/3', 'before')
get(data, 'menu/list') // [1,2,0,3,4]
```

**When the parent container of `toPath` is an object/value other than array**:

- If `get(data, toPath)` is not an object/function, throw error (primitive values).
- Otherwise, put the value of `fromPath` under new path **`toPath + '/' + fromPath`**, then delete `fromPath`.
  (This is the actual behavior in source code; note the new key name/nesting may include multiple segments of `fromPath`.)

---

### `swap(data, pathA, pathB)`

Swap values of two paths (non-existent sources will log error and keep original).

```ts
set(data, 'menu/list', [0, 1, 2, 3, 4])
swap(data, 'menu/list/0', 'menu/list/4')
get(data, 'menu/list') // [4,1,2,3,0]
```

---

### `up(data, path, step = 1)` / `down(data, path, step = 1)`

Move an **array** element up/down by `step`; out-of-bounds will be clamped to the edge.

```ts
set(data, 'menu/list', [0, 1, 2, 3, 4])

up(data, 'menu/list/3') // move up 1
get(data, 'menu/list') // [0,1,3,2,4]

down(data, 'menu/list/1', 2) // move down 2
get(data, 'menu/list') // [0,3,2,1,4]
```

---

### `normalizeUri(...parts)`

Combine and normalize path segments (handle `.`, `..`, and array/nested arguments).

```ts
normalizeUri('a', 'b') // 'a/b'
normalizeUri(['a', 'b', '../'], 'c') // 'a/c'
```

Related helpers:

- `parseUri(input)` → returns **segment array** (with escape and `..` handled)
- `parent(path)` → returns parent path or `null`
- `parents(path)` → returns all parent paths from near to far (excluding self), e.g., `a/b/c` → `['a/b','a']`

---

### Traversal (with stop capability)

All traversal callback signatures are the same:
`(value, key, parent, { uri, stop }) => any | Promise<any>`

- `walk` / `walkTopDownDFS` (same implementation)
  Top-down **DFS-preorder**; callback is **not** invoked on root node, only on root’s children and below.

- `walkTopDownBFS`
  Top-down **BFS-preorder**; callback **is** invoked on root node.

- `walkBottomUpDFS`
  Bottom-up **DFS-postorder**; callback **is** invoked on root node (last).

- `walkBottomUpBFS`
  Collect BFS first, then callback bottom-up; callback **is** invoked on root node (last).

Example (DFS-preorder):

```ts
await walk({ a: { a1: 'x' } }, (val, key, parent, { uri, stop }) => {
  // callback not triggered at root {a:{a1:'x'}}
  // First:  val={a1:'x'}, key='a',   uri='a'
  // Second: val='x',      key='a1',  uri='a/a1'
  if (uri === 'a/a1') stop() // can stop further traversal
})
```

> If input object has circular references, all four traversals will throw an error at the start. Use `isCircular(obj)` to pre-check.

---

### `isCircular(obj)`

Detect circular references.

```ts
isCircular({}) // false

const a: any = {}
set(a, '/b/c', a)
isCircular(a) // true
```

---

## Exceptions and boundaries

- Invalid path or container type mismatch (e.g., executing `insert/up/down` on non-array) will throw error or silently return.
- `insert` index out of bounds throws “the Index Out of Bounds”.
- `set(arr, 'length', n)` requires `n` to be non-negative integer, otherwise throws “value: n is not a natural number”.
- `mv` to non-object target with `toPath` pointing to primitive type throws error.
- During writing, key names `__proto__` / `prototype` / `constructor` will be skipped.

---

## License

MIT
