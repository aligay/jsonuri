const typescript = require('rollup-plugin-typescript2')
const pkg = require('../package.json')
const banner = `/*!
* ${pkg.name} v${pkg.version}
* (c) ${new Date().getFullYear()} @aligay
* Released under the ${pkg.license} License.
*/`

module.exports = {
  input: './src/index.ts',
  output: {
    banner,
    file: './dist/index.js',
    format: 'umd',
    name: 'jsonuri'
  },
  plugins: [
    typescript({
      verbosity: 2,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: './typings',
          module: 'esnext',
          target: 'es5',
          sourceMap: true
        }
      },
      inlineSourceMap: true,
      sourceMap: true,
      useTsconfigDeclarationDir: true
    })
  ]
}
