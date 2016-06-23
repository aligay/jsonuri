'use strict'
const fs = require("fs")
const gulp = require('gulp')
const n2a = require('gulp-native2ascii')
const notify = require('gulp-notify')
const babel = require("gulp-babel")
const concat = require("gulp-concat")
const browserify = require('browserify')
const uglify = require('gulp-uglify')
const babelify = require("babelify")
const gulpBrowserify = require("gulp-browserify")
const source = require('vinyl-source-stream')
const htmlmin = require('gulp-htmlmin')

process.on('uncaughtException', error => {
  notify(error)
})

gulp.task('browser', () => {
  //browserify({entries: './src/index.browser.js', extensions: ['.js'], debug: false})
  //.transform(babelify,uglify)
  browserify('./src/browser.js')
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(source('index.browser.js'))
  .pipe(notify())
  .pipe(gulp.dest('build/'))
  .pipe(notify('builded.'))
})

gulp.task('nodejs', () => {
  //browserify({entries: './src/index.browser.js', extensions: ['.js'], debug: false})
  //.transform(babelify,uglify)
  browserify('./src/jsonuri.js')
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(source('index.node.js'))
  .pipe(notify())
  .pipe(gulp.dest('build/'))
  .pipe(notify('builded.'))
})

gulp.task('clam', () => {
  const server = require('plug-base').quickStart('./')
  server
    .listen(80, 443)
})

gulp.task('htmlmin', () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
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
      "useShortDoctype": true}))
    .pipe(gulp.dest('dist'))
})


gulp.task('babel',()=>{
  
})

gulp.task('default',['browser','nodejs'])
