import { isArray, isObject, noop } from '../util'
import isCircular from './isCircular'
import { normalizeUri } from './normalizeUri'

export type WalkContext = {
  uri: string
  stop: () => void
}

type MaybePromise<T> = T | Promise<T>

export type WalkCallback = (
  val: any,
  key: string,
  parent: any,
  ctx: WalkContext,
) => MaybePromise<void>

export type WalkSyncCallback = (
  val: any,
  key: string,
  parent: any,
  ctx: WalkContext,
) => void

/**
 * Internal walk method that both sync and async methods are derived from
 */
// const _walk = (
//   obj: any,
//   callback: WalkSyncCallback = noop,
//   options: {
//     order: 'topDown' | 'bottomUp'
//     algorithm: 'DFS' | 'BFS'
//   },
// ): void => {
//   if (isCircular(obj)) throw new Error('Input object is a circular structure')

//   const uris: string[] = []
//   let isStopped = false
//   const ctx = (): WalkContext => ({
//     uri: normalizeUri(uris),
//     stop: () => {
//       isStopped = true
//     },
//   })

//   if (options.algorithm === 'DFS') {
//     const dfs = (
//       val: any,
//       key: string | null = null,
//       parent: any = null,
//     ): void => {
//       if (isStopped) return
//       if (key !== null) uris.push(key)

//       options.order === 'topDown' && callback(val, key!, parent, ctx())

//       if (!isStopped && (isObject(val) || isArray(val))) {
//         for (const [k, v] of Object.entries(val)) {
//           dfs(v, k, val)
//           if (isStopped) break
//         }
//       }

//       options.order === 'bottomUp' && callback(val, key!, parent, ctx())
//       if (key !== null) uris.pop()
//     }

//     dfs(obj)
//   } else {
//     // BFS
//     if (options.order === 'topDown') {
//       const queue = [
//         { val: obj, key: UNDEFINED, parent: UNDEFINED, uris: [] as string[] },
//       ]

//       while (queue.length && !isStopped) {
//         const { val, key, parent, uris: currentUris } = queue.shift()!
//         uris.splice(0, uris.length, ...currentUris)

//         callback(val, key!, parent, ctx())
//         if (isStopped) break

//         if (isObject(val) || isArray(val)) {
//           for (const [k, v] of Object.entries(val)) {
//             queue.push({
//               val: v,
//               key: k,
//               parent: val,
//               uris: [...currentUris, k],
//             })
//           }
//         }
//       }
//     } else {
//       // Bottom-up BFS
//       const queue = [
//         { val: obj, key: UNDEFINED, parent: UNDEFINED, uris: [] as string[] },
//       ]
//       const postOrder = []

//       while (queue.length && !isStopped) {
//         const item = queue.shift()!
//         postOrder.push(item)

//         if (isObject(item.val) || isArray(item.val)) {
//           for (const [k, v] of Object.entries(item.val)) {
//             queue.push({
//               val: v,
//               key: k,
//               parent: item.val,
//               uris: [...item.uris, k],
//             })
//           }
//         }
//       }

//       while (postOrder.length && !isStopped) {
//         const { val, key, parent, uris: currentUris } = postOrder.pop()!
//         uris.splice(0, uris.length, ...currentUris)
//         callback(val, key!, parent, ctx())
//       }
//     }
//   }
// }

/**
 * Depth-First Search (DFS) - Top-Down traversal
 */
const walkTopDownDFS = async (
  obj: any,
  onEnter: WalkCallback = noop,
): Promise<void> => {
  if (isCircular(obj)) throw new Error('Input object is a circular structure')

  const uris: string[] = []
  let isStopped = false

  const createContext = (): WalkContext => ({
    uri: normalizeUri(uris),
    stop: () => {
      isStopped = true
    },
  })

  const dfs = async (
    val: any,
    key: string | null = null,
    parent: any = null,
  ): Promise<void> => {
    if (isStopped) return
    if (key !== null) uris.push(key)

    const isRoot = uris.length === 0
    if (!isRoot) {
      const ctx = createContext()
      await Promise.resolve(onEnter(val, key!, parent, ctx))
      if (isStopped) return
    }

    if (isObject(val) || isArray(val)) {
      for (const [k, v] of Object.entries(val)) {
        await dfs(v, k, val)
        if (isStopped) break
      }
    }

    if (key !== null) uris.pop()
  }

  await dfs(obj)
}

/**
 * Synchronous Depth-First Search (DFS) - Top-Down traversal
 */
// const walkTopDownDFSSync = (
//   obj: any,
//   onEnter: WalkSyncCallback = noop,
// ): void => {
//   _walk(obj, onEnter, { order: 'topDown', algorithm: 'DFS' })
// }

/**
 * Depth-First Search (DFS) - Bottom-Up traversal
 */
const walkBottomUpDFS = async (
  obj: any,
  onLeave: WalkCallback = noop,
): Promise<void> => {
  if (isCircular(obj)) throw new Error('Input object is a circular structure')

  const uris: string[] = []
  let isStopped = false

  const createContext = (): WalkContext => ({
    uri: normalizeUri(uris),
    stop: () => {
      isStopped = true
    },
  })

  const dfs = async (
    val: any,
    key: string | null = null,
    parent: any = null,
  ): Promise<void> => {
    if (isStopped) return
    if (key !== null) uris.push(key)

    if (isObject(val)) {
      for (const [k, v] of Object.entries(val)) {
        await dfs(v, k, val)
        if (isStopped) break
      }
    }

    const ctx = createContext()
    await Promise.resolve(onLeave(val, key!, parent, ctx))

    if (key != null) uris.pop()
  }

  await dfs(obj)
}

/**
 * Synchronous Depth-First Search (DFS) - Bottom-Up traversal
 */
// const walkBottomUpDFSSync = (
//   obj: any,
//   onLeave: WalkSyncCallback = noop,
// ): void => {
//   _walk(obj, onLeave, { order: 'bottomUp', algorithm: 'DFS' })
// }

/**
 * Breadth-First Search (BFS) - Top-Down traversal
 */
const walkTopDownBFS = async (
  obj: any,
  onEnter: WalkCallback = noop,
): Promise<void> => {
  if (isCircular(obj)) throw new Error('Input object is a circular structure')

  const uris: string[] = []
  const queue: { val: any; key: string | null; parent: any; uris: string[] }[] =
    [{ val: obj, key: null, parent: null, uris: [] }]
  let isStopped = false

  const createContext = (): WalkContext => ({
    uri: normalizeUri(uris),
    stop: () => {
      isStopped = true
    },
  })

  while (queue.length && !isStopped) {
    const { val, key, parent, uris: currentUris } = queue.shift()!
    uris.splice(0, uris.length, ...currentUris)

    const ctx = createContext()
    await Promise.resolve(onEnter(val, key!, parent, ctx))
    if (isStopped) break

    if (isObject(val) || isArray(val)) {
      for (const [k, v] of Object.entries(val)) {
        queue.push({ val: v, key: k, parent: val, uris: [...currentUris, k] })
      }
    }
  }
}

/**
 * Synchronous Breadth-First Search (BFS) - Top-Down traversal
 */
// const walkTopDownBFSSync = (
//   obj: any,
//   onEnter: WalkSyncCallback = noop,
// ): void => {
//   _walk(obj, onEnter, { order: 'topDown', algorithm: 'BFS' })
// }

/**
 * Breadth-First Search (BFS) - Bottom-Up traversal
 */
const walkBottomUpBFS = async (
  obj: any,
  onLeave: WalkCallback = noop,
): Promise<void> => {
  if (isCircular(obj)) throw new Error('Input object is a circular structure')

  const uris: string[] = []
  const queue: { val: any; key: string | null; parent: any; uris: string[] }[] =
    [{ val: obj, key: null, parent: null, uris: [] }]
  let isStopped = false

  const createContext = (): WalkContext => ({
    uri: normalizeUri(uris),
    stop: () => {
      isStopped = true
    },
  })

  const postOrder: typeof queue = []

  while (queue.length && !isStopped) {
    const { val, key, parent, uris: currentUris } = queue.shift()!
    postOrder.push({ val, key, parent, uris: currentUris })

    if (isObject(val) || isArray(val)) {
      for (const [k, v] of Object.entries(val)) {
        queue.push({ val: v, key: k, parent: val, uris: [...currentUris, k] })
      }
    }
  }

  while (postOrder.length && !isStopped) {
    const { val, key, parent, uris: currentUris } = postOrder.pop()!
    uris.splice(0, uris.length, ...currentUris)

    const ctx = createContext()
    await Promise.resolve(onLeave(val, key!, parent, ctx))
  }
}

/**
 * Synchronous Breadth-First Search (BFS) - Bottom-Up traversal
 */
// const walkBottomUpBFSSync = (
//   obj: any,
//   onLeave: WalkSyncCallback = noop,
// ): void => {
//   _walk(obj, onLeave, { order: 'bottomUp', algorithm: 'BFS' })
// }

// Export aliases and methods
export {
  walkTopDownDFS as walk,
  walkBottomUpBFS,
  // walkBottomUpBFSSync,
  walkBottomUpDFS,
  // walkBottomUpDFSSync,
  // walkTopDownDFSSync as walkSync,
  walkTopDownBFS,
  // walkTopDownBFSSync,
  walkTopDownDFS,
}
