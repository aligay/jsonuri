# jsonuri

[English](README.md) | 简体中文

一个轻量级、强大的 JSON 对象操作工具库，使用 linux 路径风格表达式来访问和修改嵌套的 JSON 数据，能快速访问数据的上级结构。

[![npm](https://img.shields.io/npm/v/idmp.svg)](https://www.npmjs.com/package/idmp)
[![codecov](https://codecov.io/gh/aligay/jsonuri/branch/main/graph/badge.svg)](https://app.codecov.io/gh/aligay/jsonuri/blob/main/src%2Findex.ts)
[![contributors](https://img.shields.io/github/contributors/aligay/jsonuri)](https://github.com/aligay/jsonuri/graphs/contributors)
[![LICENSE](https://img.shields.io/npm/l/idmp)](https://github.com/aligay/jsonuri/blob/main/LICENSE)
[![Size](https://img.shields.io/bundlephobia/minzip/jsonuri.svg)](https://cdn.jsdelivr.net/npm/jsonuri/+esm)



## 安装

```bash
npm i jsonuri
# 或 pnpm add jsonuri / yarn add jsonuri
```

使用方式：

```ts
// 推荐按需导入（便于 tree-shaking）
import {
  get, set, rm, insert, mv, swap, up, down,
  normalizeUri, parseUri, parent, parents, isCircular,
  walk, walkTopDownDFS, walkTopDownBFS, walkBottomUpDFS, walkBottomUpBFS
} from 'jsonuri';

// 或整体导入
import * as jsonuri from 'jsonuri';
```

---

## 路径规则

* 分隔符：`/`（如 `menu/popup/menuitem/0/value`）
* 当前层：`.`；父级：`..`
* 转义斜杠：在键名内使用 `\/`，如 `a\/b/c` 解析为段 `["a/b", "c"]`
* 数组快捷段（仅 `get` 中解析，且要求当前值为数组）：

  * `@first`（首元素）
  * `@last` 或 `@length-1`（末元素）
  * `@length-N`（倒数第 `N` 个，`N` ≥ 0 且整数）
* **简单键** 与 **复杂路径** 的判定：
  传入的 `path` 若是不含 `/` 的字符串或非负整数索引，则按“简单键/索引”处理；否则按“复杂路径”解析。

> 若路径解析过程中父级超出根（例如过多的 `..`），解析将判定为非法并返回空结果。

---

## 示例数据

```json
{
  "menu": {
    "id": 123,
    "list": [0, 1, 2, 3, 4],
    "popup": {
      "menuitem": [
        { "value": "New",   "onclick": "CreateNewDoc()" },
        { "value": "Open",  "onclick": "OpenDoc()" },
        { "value": "Close", "onclick": "CloseDoc()" }
      ]
    }
  }
}
```

以下示例假设变量 `data` 为上面 JSON。

---

## API

### `get(data, path)`

按路径读取值。

```ts
get(data, 'menu/id');                               // 123
get(data, 'menu/popup/menuitem/0/value');           // "New"
get(data, 'menu/popup/menuitem/0/value/..');        // { value: "New", onclick: "CreateNewDoc()" }
get(data, 'menu/popup/menuitem/@last/value');       // "Close"
get([10, 11, 12], '@length-2');                     // 11
get(data, '/');                                     // 整个 data
```

> 若中途遇到 `null/undefined`，直接返回该值；非法路径返回 `undefined`。

---

### `set(data, path, value)`

按路径写入。中间缺失层会被创建为对象。
对数组会使用 `splice` 写入；写入键名为 `length` 时会裁剪/扩展数组长度。

```ts
set(data, 'menu/id', 789);
get(data, 'menu/id');                               // 789

set(data, 'menu/list/7', 999);                      // 自动扩容至索引 7
get(data, 'menu/list');                             // [0,1,2,3,4, undefined, undefined, 999]

// 直接改 length（简单键）
const arr = [0,1,2,3];
set(arr, 'length', 2);
arr;                                                // [0,1]
```

> 保护键名：`__proto__` / `prototype` / `constructor` 会被**跳过**（不会创建/写入）。

---

### `rm(data, path)`

按路径删除值/项（对象用 `delete`，数组用 `splice`）。

```ts
rm(data, 'menu/id');
get(data, 'menu/id');                               // undefined

rm(data, 'menu/list/1');
get(data, 'menu/list');                             // [0,2,3,4]
```

---

### `insert(data, path, value, direction = 'before')`

**仅对数组** 生效：在 `path` 所指索引**之前/之后**插入一个元素。
`direction` 仅支持 `'before' | 'after'`。

```ts
// 在第 0 项之前插入 9999
insert(data, 'menu/list/0', 9999, 'before');        // [9999,0,1,2,3,4]

// 在第 2 项之后插入 -1
insert(data, 'menu/list/2', -1, 'after');           // [9999,0,1,2,-1,3,4]
```

> 若索引 `< 0` 或 `> length` 会抛出 “Index Out of Bounds”。
> 源码中出现了 `'inside'` 分支，但仅打印 TODO；**不提供**该能力。
> 文本常量包含 `'append'` 字样，但实现**未支持** `'append'`。

---

### `mv(data, fromPath, toPath, direction = 'before')`

移动节点。常见用法为**数组元素**跨/同层级移动到目标索引前后。

```ts
set(data, 'menu/list', [0,1,2,3,4]);
mv(data, 'menu/list/0', 'menu/list/3');             // 默认 'before'
get(data, 'menu/list');                             // [1,2,3,0,4]

set(data, 'menu/list', [0,1,2,3,4]);
mv(data, 'menu/list/0', 'menu/list/3', 'before');
get(data, 'menu/list');                             // [1,2,0,3,4]
```

**当 `toPath` 指向的父容器为数组以外的对象/值时**：

* 若 `get(data, toPath)` 不是对象/函数，将抛错（primitive values）。
* 否则会把 `fromPath` 对应的值放到新路径 **`toPath + '/' + fromPath`** 下，然后删除 `fromPath`。
  （这是源码的实际行为，注意新键名/嵌套可能包含 `fromPath` 的多段。）

---

### `swap(data, pathA, pathB)`

交换两个路径的值（不存在的源会记录错误并保持原值）。

```ts
set(data, 'menu/list', [0,1,2,3,4]);
swap(data, 'menu/list/0', 'menu/list/4');
get(data, 'menu/list');                             // [4,1,2,3,0]
```

---

### `up(data, path, step = 1)` / `down(data, path, step = 1)`

将**数组**中某个元素上移/下移 `step` 步；越界将被钳制到边界。

```ts
set(data, 'menu/list', [0,1,2,3,4]);

up(data, 'menu/list/3');                            // 上移 1
get(data, 'menu/list');                             // [0,1,3,2,4]

down(data, 'menu/list/1', 2);                       // 下移 2
get(data, 'menu/list');                             // [0,3,2,1,4]
```

---

### `normalizeUri(...parts)`

组合并规范化路径片段（处理 `.`、`..` 和数组/嵌套传参）。

```ts
normalizeUri('a', 'b');                             // 'a/b'
normalizeUri(['a', 'b', '../'], 'c');               // 'a/c'
```

相关辅助：

* `parseUri(input)` → 返回**段数组**（含转义与 `..` 处理）
* `parent(path)`    → 返回父路径或 `null`
* `parents(path)`   → 返回从近到远所有父路径（不含自身），如 `a/b/c` → `['a/b','a']`

---

### 遍历（含中止能力）

所有遍历回调签名一致：`(value, key, parent, { uri, stop }) => any | Promise<any>`

* `walk` / `walkTopDownDFS`（同实现）
  自顶向下 **DFS-先序**；**不会**在根节点调用回调，只对根的子节点及以下调用。

* `walkTopDownBFS`
  自顶向下 **BFS-先序**；**会**在根节点调用回调。

* `walkBottomUpDFS`
  自底向上 **DFS-后序**；**会**在根节点调用回调（最后）。

* `walkBottomUpBFS`
  先按 BFS 收集，再自底向上回调；**会**在根节点调用回调（最后）。

示例（DFS-先序）：

```ts
await walk({ a: { a1: 'x' } }, (val, key, parent, { uri, stop }) => {
  // 回调不会在根 {a:{a1:'x'}} 触发
  // 第一次：val={a1:'x'}, key='a',   uri='a'
  // 第二次：val='x',      key='a1',  uri='a/a1'
  if (uri === 'a/a1') stop(); // 可中止后续遍历
});
```

> 若输入对象存在循环引用，四种遍历都会在开始前抛出错误。可先用 `isCircular(obj)` 预检。

---

### `isCircular(obj)`

检测循环引用。

```ts
isCircular({});                                     // false

const a: any = {};
set(a, '/b/c', a);
isCircular(a);                                      // true
```

---

## 异常与边界

* 非法路径或容器类型不匹配（如对非数组执行 `insert/up/down`）会抛错或静默返回。
* `insert` 索引越界抛出 “the Index Out of Bounds”。
* `set(arr, 'length', n)` 要求 `n` 为非负整数，否则抛出 “value: n is not a natural number”。
* `mv` 到非对象目标且 `toPath` 指向原始类型时抛错（primitive values）。
* 写入时会跳过键名 `__proto__` / `prototype` / `constructor`。

---

## 许可证

MIT
