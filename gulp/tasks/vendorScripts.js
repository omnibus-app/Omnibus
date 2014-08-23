var gulp = require('gulp');
var plumber = require('gulp-plumber');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');

var paths = require('../paths.js');

// compile bootstrap css, may be able to alter this in some way
gulp.task('vendor-styles', function() {
  gulp
    .src([
      paths.bower + 'bootstrap/' + 'bootstrap.css'
    ])
    .pipe(plumber())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(paths.dest + 'css/'));
});
