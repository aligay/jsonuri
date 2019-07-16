const version = require('../package.json').version
const util = require('./util')
util.sh(`
  git tag publish/${version} &&
  git push origin publish/${version} &&
  npm run deploy:gh-pages
`)
console.log(version)
