const sh = require('./util').sh
const rollup = require('rollup').rollup
const rollupConfig = require('./rollup.config')
const typescript = require('rollup-plugin-typescript2')
const merge = require('lodash.merge')

;(async () => {
  await sh('npm run clean && npx rollup -c scripts/rollup.config.js')
  rollupEach([
    { format: 'cjs', name: 'jsonuri', file: 'dist/index.common.js', _ts: { module: 'esnext' } },
    { format: 'es', name: 'jsonuri', file: 'dist/index.mjs', _ts: { module: 'esnext', target: 'es2016' } }
  ])
  await sh(`npx uglifyjs dist/index.js \
    -c hoist_funs,hoist_vars \
    -m \
    -o dist/index.min.js`)
})()

function rollupEach (options) {
  options.forEach(async c => {
    const bundle = await rollup(genRollupConfig(rollupConfig, c._ts))
    await bundle.write(c)
  })
}

function genRollupConfig (rollupConfig, tsConfig) {
  const _rollupConfig = merge({}, rollupConfig)
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
