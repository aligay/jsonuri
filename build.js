var fs = require('fs')
var zlib = require('zlib')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')
var package = require('./package.json');
var version = process.env.VERSION || package.version
var htmlMinify = require('html-minifier').minify;

var banner =
  '/*!\n' +
  ' * JsonUri.js v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' ' + package.author + ' ' + package.homepage + '\n' +
  ' * Released under the MIT License.\n' +
  ' */'

// update main file
var main = fs
  .readFileSync('src/index.js', 'utf-8')
  .replace(/JsonUri\.version = '[\d\.]+'/, "JsonUri.version = '" + version + "'")
fs.writeFileSync('src/index.js', main)

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      loose: 'all'
    })
  ]
})
  .then(function (bundle) {
    write('dist/jsonuri.es.js', bundle.generate({
      format: 'es6',
      banner: banner
    }).code)
    return bundle
  })
  .then(function (bundle) {
    return write('dist/jsonuri.common.js', bundle.generate({
      format: 'cjs',
      banner: banner
    }).code)
  })
  // Standalone Dev Build
  .then(function () {
    return rollup.rollup({
      entry: 'src/index.js',
      plugins: [
        replace({
          'process.env.NODE_ENV': "'development'"
        }),
        babel({
          loose: 'all'
        })
      ]
    })
      .then(function (bundle) {
        return write('dist/jsonuri.js', bundle.generate({
          format: 'umd',
          banner: banner,
          moduleName: 'JsonUri'
        }).code)
      })
  })
  .then(function () {
    // Standalone Production Build
    return rollup.rollup({
      entry: 'src/index.js',
      plugins: [
        replace({
          'process.env.NODE_ENV': "'production'"
        }),
        babel({
          loose: 'all'
        })
      ]
    })
      .then(function (bundle) {
        var code = bundle.generate({
          format: 'umd',
          moduleName: 'JsonUri',
          banner: banner
        }).code
        var res = uglify.minify(code, {
          fromString: true,
          outSourceMap: 'jsonuri.min.js.map',
          output: {
            preamble: banner,
            ascii_only: true
          }
        })
        // fix uglifyjs sourcemap
        var map = JSON.parse(res.map)
        map.sources = ['jsonuri.js']
        map.sourcesContent = [code]
        map.file = 'jsonuri.min.js'
        return [
          write('dist/jsonuri.min.js', res.code),
          write('dist/jsonuri.min.js.map', JSON.stringify(map))
        ]
      })
      .then(zip)
  })
  .catch(logError)

htmlMin('./demo/index.html', './dist/index.html');
write('dist/CNAME', 'jsonuri.js.org')

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
    fs.readFile('dist/jsonuri.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/jsonuri.min.js.gz', buf).then(resolve)
      })
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function htmlMin(src, target) {
  var html = fs.readFileSync(src, 'utf-8')
  var result = htmlMinify(html, {
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: true,
    "collapseBooleanAttributes": true,
    "collapseWhitespace": true,
    "decodeEntities": true,

    "html5": true,
    "processConditionalComments": true,
    "processScripts": [
      "text/html"
    ],
    "removeAttributeQuotes": true,
    "removeComments": true,
    "removeEmptyAttributes": true,
    "removeOptionalTags": true,
    "removeRedundantAttributes": true,
    "removeScriptTypeAttributes": true,
    "removeStyleLinkTypeAttributes": true,
    "removeTagWhitespace": true,
    "useShortDoctype": true
  });

  write(target, result)
}
