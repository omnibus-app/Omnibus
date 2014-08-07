var gulp = require('gulp');
var plumber = require('gulp-plumber');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');

var paths = require('../paths');

// compile bootstrap css, my be able to alter this in some way
gulp.task('vendor-styles', function() {
  var stream = gulp.src([
    paths.vendor + 'styles/bootstrap.css',
    paths.vendor + 'styles/bootstrap-theme.css'
  ])
  .pipe(plumber())
  .pipe(concat('vendor.css'));

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});