const ghpages = require('gh-pages')
ghpages.publish('www', (err) => {
  if (err) {
    console.error(err)
  }
})

