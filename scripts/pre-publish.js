const version = require('../package.json').version
const util = require('./util')
util.sh([
  `git tag v${version}`,
  `git push origin v${version}`,
  `npm run deploy:gh-pages`
].join(' && '))
console.log(version)
