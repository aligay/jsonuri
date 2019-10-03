const sh = require('./util').sh
const pkg = require('../package.json')
const fs = require('fs')
const path = require('path')

sh('npx imod build')

const htmlPath = path.resolve(__dirname, '../www/index.html')
let html = fs.readFileSync(htmlPath, 'utf8')
html = html.replace(/jsonuri@[^/]*\//, `jsonuri@${pkg.version}/`)
  .replace(/(<a href="\/\/www.npmjs.com\/package\/jsonuri">)([^<]*)(<\/a>)/, `$1${pkg.version}$3`)

fs.writeFileSync(htmlPath, html, 'utf8')
