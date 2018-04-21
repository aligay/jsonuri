const sh = require('./util').sh
const rollup = require('rollup').rollup
const rollupConfig = require('./rollup.config')
const typescript = require('rollup-plugin-typescript2')
const merge = require('lodash.merge')

;(async () => {
  await sh('npm run clean && npx rollup -c scripts/rollup.config.js')
  await rollupEach([
    { format: 'cjs', name: 'jsonuri', file: 'dist/index.common.js', _ts: { module: 'esnext', target: 'es5' } },
    { format: 'es', name: 'jsonuri', file: 'dist/index.mjs', _ts: { module: 'esnext', target: 'es5' } }
  ])
  await sh(`npx uglifyjs dist/index.js \
    -c hoist_funs,hoist_vars \
    -m \
    -o dist/index.min.js`)
  await sh('cp dist/index.js page/jsonuri.js')
})()

async function rollupEach (options) {
  for (let c of options) {
    const bundle = await rollup(genRollupConfig(c, c._ts))
    await bundle.write(c)
  }
}

function genRollupConfig (c, tsConfig) {
  const _rollupConfig = merge({}, rollupConfig, { output: c })
  _rollupConfig.plugins[0] = typescript({
    verbosity: 1,
    tsconfigOverride: {
      compilerOptions: Object.assign({
        declaration: false
      }, tsConfig)
    }
  })
  return _rollupConfig
}
