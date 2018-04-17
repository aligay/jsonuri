const ghpages = require('gh-pages')
ghpages.publish('page', (err) => {
  if (err) {
    console.error(err)
  }
})

