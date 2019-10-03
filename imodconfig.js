const pkg = require('./package.json')
const banner = `/*!
* ${pkg.name} v${pkg.version}
* (c) ${new Date().getFullYear()} @allgay
* Released under the ${pkg.license} License.
*/`
module.exports = {
  name: 'jsonuri',
  banner,
  compilerOptions: [{
    format: 'esm',
    extName: '.mjs',
    target: 'es5'
  },
  {
    format: 'cjs',
    extName: '.js',
    target: 'es5'
  },
  {
    format: 'umd',
    extName: '.min.js',
    target: 'es5'
  }]
}
