import { isString, isArray, throwError, MUST_BE_ARRAY } from './util'
import get from './get'

function upDown (data, path, direction: 1 | -1, gap = 1) {
  console.log(direction, gap)
  if (!(data && isString(path))) return

  const parent = get(data, path + '/..')
  if (!isArray(parent)) throw new Error(MUST_BE_ARRAY)

}

export function up (data, path, gap?) {
  upDown(data, path, -1, gap)
}

export function down (data, path, gap?) {
  upDown(data, path, 1, gap)
}
