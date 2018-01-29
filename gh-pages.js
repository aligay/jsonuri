require('./build')
const ghpages = require('gh-pages')

ghpages.publish('dist')
