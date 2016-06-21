'use strict'
const fs = require("fs");
const gulp = require('gulp')
const n2a = require('gulp-native2ascii')
const notify = require('gulp-notify')
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const babelify = require("babelify");
const gulpBrowserify = require("gulp-browserify");
const source = require('vinyl-source-stream');

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

gulp.task('default',['browser','nodejs'])
