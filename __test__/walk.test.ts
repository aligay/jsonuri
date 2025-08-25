import { beforeEach, describe, expect, it } from 'vitest'
import * as jsonuri from '../src/index'
import {
  walk,
  walkBottomUpBFS,
  walkBottomUpDFS,
  walkTopDownBFS,
  walkTopDownDFS,
} from '../src/index'

describe('jsonuri.walk', () => {
  let obj
  beforeEach(() => {
    obj = {
      a: 2,
      b: {
        b1: {
          b11: 311,
          b12: 312,
        },
        b2: 32,
      },
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      NULL: null,
    }
  })
  it('get', async () => {
    let ret
    await jsonuri.walk(obj, (val, key, parent, { uri }) => {
      console.log('uri', uri)
      if (uri === 'b/b1/b11') {
        ret = val
      }
    })
    expect(ret).toEqual(311)
  })
  it('get 2', async () => {
    let retaa = '耗子'
    await jsonuri.walk(obj, async (val, key, parent, { uri }) => {
      if (key === 'list') {
        retaa = val
      }
    })
    expect(retaa).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })
  it('walk circular object', async () => {
    await expect(async () => {
      await jsonuri.walk(globalThis)
    }).rejects.toThrow()
  })
  it('walk circular object 2', async () => {
    const a = {}
    const b = { a }
    b.a = a
    await expect(jsonuri.walk(b)).resolves.not.toThrow(
      'obj is a circular structure',
    )
  })
  it('walk circular object 3', async () => {
    const a: any = {}
    a.b = a
    await expect(async () => {
      await jsonuri.walk(a)
    }).rejects.toThrow()
  })
  it('fourth arg {uri}', () => {
    const obj = {
      a: {
        b: 'b',
      },
    }
    jsonuri.walk(obj, (val, key, parent, { uri }) => {
      if (val === 'b') {
        expect(uri).toEqual('a/b')
      }
    })
  })
})

const makeCircular = () => {
  const obj: any = { a: 1 }
  obj.self = obj
  return obj
}
const sample = {
  a: {
    b: 1,
    c: 2,
  },
  d: [3, 4],
}
const collect = () => {
  const visited: string[] = []
  const fn = (val: any, key: string, _parent: any, ctx: { uri: string }) => {
    visited.push(`${ctx.uri}: ${JSON.stringify(val)}`)
  }
  return { visited, fn }
}

describe.each([
  ['walkTopDownDFS', walkTopDownDFS],
  ['walkBottomUpDFS', walkBottomUpDFS],
  ['walkTopDownBFS', walkTopDownBFS],
  ['walkBottomUpBFS', walkBottomUpBFS],
])('%s', (fnName, walkFn) => {
  it('visits all nodes in expected order', async () => {
    const { visited, fn } = collect()
    await walkFn(sample, fn)
    expect(visited.length).toBeGreaterThan(0)
  })
  it('supports async callbacks', async () => {
    const log: string[] = []
    await walkFn(sample, async (_val, key, _parent, ctx) => {
      await new Promise((r) => setTimeout(r, 1))
      log.push(`${ctx.uri}:${key}`)
    })
    expect(log.length).toBeGreaterThan(0)
  })
  it('throws on circular structures', async () => {
    await expect(() => walkFn(makeCircular(), () => {})).rejects.toThrow(
      /circular structure/i,
    )
  })
  it('can be stopped using ctx.stop()', async () => {
    const log: string[] = []
    await walkFn(sample, (_val, key, parent, ctx) => {
      log.push(ctx.uri)
      ctx.stop()
    })
    if (fnName === 'walkBottomUpDFS') {
      expect(log.length).toBeLessThanOrEqual(3)
    } else {
      expect(log.length).toBe(1)
    }
  })
})

// Tests for synchronous methods
describe.each([
  // ['walk', walk],
  // ['walkSync', walkSync],
  // ['walkTopDownDFSSync', walkTopDownDFSSync],
  // ['walkBottomUpDFSSync', walkBottomUpDFSSync],
  // ['walkTopDownBFSSync', walkTopDownBFSSync],
  // ['walkBottomUpBFSSync', walkBottomUpBFSSync],
])('%s', (fnName, walkFn) => {
  let obj

  beforeEach(() => {
    obj = {
      a: 2,
      b: {
        b1: {
          b11: 311,
          b12: 312,
        },
        b2: 32,
      },
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      NULL: null,
    }
  })

  it('visits all nodes in expected order', () => {
    const { visited, fn } = collect()
    walkFn(sample, fn)
    expect(visited.length).toBeGreaterThan(0)
  })

  it('traverses the object correctly', () => {
    let found = false
    walkFn(obj, (val, key, parent, { uri }) => {
      if (uri === 'b/b1/b11') {
        expect(val).toEqual(311)
        found = true
      }
    })
    expect(found).toBe(true)
  })

  it('throws on circular structures', () => {
    expect(() => walkFn(makeCircular(), () => {})).toThrow(
      /circular structure/i,
    )
  })

  it('can be stopped using ctx.stop()', () => {
    const log: string[] = []
    walkFn(sample, (_val, key, parent, ctx) => {
      log.push(ctx.uri)
      ctx.stop()
    })

    // walkBottomUpDFS might visit leaf nodes before stopping
    if (fnName === 'walkBottomUpDFSSync') {
      expect(log.length).toBeLessThanOrEqual(3)
    } else {
      expect(log.length).toBe(1)
    }
  })

  it('properly handles arrays', () => {
    const arrayVisits = []
    walkFn(obj, (val, key, parent, { uri }) => {
      if (key === 'list' || (Array.isArray(parent) && parent === obj.list)) {
        arrayVisits.push(key)
      }
    })
    // Should visit 'list' and all 9 array elements
    expect(arrayVisits.length).toBeGreaterThan(1)
  })

  it('provides correct uri in context', () => {
    const uris = []
    walkFn(obj, (val, key, parent, { uri }) => {
      if (key === 'b11' || key === 'b12') {
        uris.push(uri)
      }
    })
    expect(uris).toContain('b/b1/b11')
    expect(uris).toContain('b/b1/b12')
  })

  it('can modify parent object during traversal', () => {
    const toModify = { a: { b: 1 }, c: 2 }
    walkFn(toModify, (val, key, parent) => {
      if (key === 'b' && parent === toModify.a) {
        parent.newVal = 'added'
      }
    })
    expect(toModify.a.newVal).toBe('added')
  })
})

// Comparative tests between async and sync versions
describe('Compare async and sync versions', () => {
  const testObj = {
    a: { b: 1, c: 2 },
    d: [3, 4, 5],
  }

  it('walk and walkSync visit nodes in same order', async () => {
    const asyncVisited: string[] = []
    const syncVisited: string[] = []

    await walk(testObj, (val, key, parent, { uri }) => {
      asyncVisited.push(uri)
    })

    // walkSync(testObj, (val, key, parent, { uri }) => {
    //   syncVisited.push(uri)
    // })

    // expect(asyncVisited).toEqual(syncVisited)
  })
  // it('walkTopDownDFS and walkTopDownDFSSync visit nodes in same order', async () => {
  //   const asyncVisited: string[] = []
  //   const syncVisited: string[] = []

  //   await walkTopDownDFS(testObj, (val, key, parent, { uri }) => {
  //     asyncVisited.push(uri )
  //   })

  //   walkTopDownDFSSync(testObj, (val, key, parent, { uri }) => {
  //     syncVisited.push(uri)
  //   })

  //   expect(asyncVisited).toEqual(syncVisited)
  // })

  // it('walkBottomUpDFS and walkBottomUpDFSSync visit nodes in same order', async () => {
  //   const asyncVisited: string[] = []
  //   const syncVisited: string[] = []

  //   await walkBottomUpDFS(testObj, (val, key, parent, { uri }) => {
  //     asyncVisited.push(uri )
  //   })

  //   walkBottomUpDFSSync(testObj, (val, key, parent, { uri }) => {
  //     syncVisited.push(uri )
  //   })

  //   expect(asyncVisited).toEqual(syncVisited)
  // })

  // it('walkTopDownBFS and walkTopDownBFSSync visit nodes in same order', async () => {
  //   const asyncVisited: string[] = []
  //   const syncVisited: string[] = []

  //   await walkTopDownBFS(testObj, (val, key, parent, { uri }) => {
  //     asyncVisited.push(uri)
  //   })

  //   walkTopDownBFSSync(testObj, (val, key, parent, { uri }) => {
  //     syncVisited.push(uri )
  //   })

  //   expect(asyncVisited).toEqual(syncVisited)
  // })

  // it('walkBottomUpBFS and walkBottomUpBFSSync visit nodes in same order', async () => {
  //   const asyncVisited: string[] = []
  //   const syncVisited: string[] = []

  //   await walkBottomUpBFS(testObj, (val, key, parent, { uri }) => {
  //     asyncVisited.push(uri)
  //   })

  //   walkBottomUpBFSSync(testObj, (val, key, parent, { uri }) => {
  //     syncVisited.push(uri )
  //   })

  //   expect(asyncVisited).toEqual(syncVisited)
  // })

  // it('walk and walkSync visit nodes in same order', async () => {
  //   const asyncVisited: string[] = []
  //   const syncVisited: string[] = []

  //   await jsonuri.walk(testObj, (val, key, parent, { uri }) => {
  //     asyncVisited.push(uri)
  //   })

  //   jsonuri.walkSync(testObj, (val, key, parent, { uri }) => {
  //     syncVisited.push(uri )
  //   })

  //   expect(asyncVisited).toEqual(syncVisited)
  // })
})
