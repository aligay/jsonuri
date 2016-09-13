'use strict'
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
const uglify = require('uglify-js')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const pkg = require('../package.json')
const htmlMinify = require('html-minifier').minify

const name = pkg.name
const mainPath = resolvePath('../src/index.js')
const banner =
  '/*!\n' +
  ' * ' + name + ' v' + pkg.version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' ' + pkg.author + '\n' +
  ' * Released under the MIT License.\n' +
  ' */'

// common js
rollup.rollup({
  entry: mainPath,
  plugins: [
    babel({})
  ]
}).then((bundle) => {
  let code = bundle.generate({
    format: 'cjs',
    banner: banner
  }).code

  write(resolvePath(`../dist/index.js`), code)
  return write(resolvePath(`../dist/${name}.common.js`), code)
})

 // umd
   .then(() => {
     return rollup.rollup({
       entry: mainPath,
       plugins: [
         replace({
           'process.env.NODE_ENV': "'development'"
         }),
         babel()
       ]
     }).then((bundle) => {
       return write(resolvePath(`../dist/${name}.js`), bundle.generate({
         format: 'umd',
         banner: banner,
         moduleName: 'safeTrim'
       }).code)
     })
   })

   // uglify
   .then(function () {
     return rollup.rollup({
       entry: mainPath,
       plugins: [
         replace({
           'process.env.NODE_ENV': "'production'"
         }),
         babel()
       ]
     }).then((bundle) => {
       const code = bundle.generate({
         format: 'umd',
         moduleName: 'safeTrim',
         banner: banner
       }).code
       const res = uglify.minify(code, {
         fromString: true,
         outSourceMap: `${name}.min.js.map`,
         compress: {
           warnings: false,
           hoist_consts: true,
           hoist_funs: true,
           drop_debugger: true,
           unused: true,
           drop_console: true,
           sequences: true,
           conditionals: true,
           booleans: true,
           if_return: true,
           join_consts: true,
           screw_ie8: true,
           comparisons: true,
           evaluate: true,
           loops: true,
           cascade: true,
           negate_iife: true
         },
         comments: false,
         output: {
           preamble: banner,
           ascii_only: true
         }
       })
       // fix uglifyjs sourcemap
       const map = JSON.parse(res.map)
       map.sources = [`${name}.js`]
       map.sourcesContent = [code]
       map.file = `${name}.min.js`
       return [
         write(resolvePath(`../dist/${name}.min.js`), res.code),
         write(resolvePath(`../dist/${name}.min.js.map`), JSON.stringify(map))
       ]
     })
   })
  .catch(logError)

// htmlMin('./demo/index.html', './dist/index.html');

function resolvePath(_path) {
  return path.resolve(__dirname, _path)
}

function write(dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip() {
  return new Promise(function (resolve, reject) {
    fs.readFile(`dist/${name}.min.js`, function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write(`dist/${name}.min.js.gz`, buf).then(resolve)
      })
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e.stack)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function htmlMin(src, target) {
  const html = fs.readFileSync(src, 'utf-8')
  const result = htmlMinify(html, {
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: true,
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,

    html5: true,
    processConditionalComments: true,
    processScripts: [
      'text/html'
    ],
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    useShortDoctype: true
  });

  write(target, result)
}
