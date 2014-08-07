var gulp = require('gulp');
var stylus = require('gulp-stylus');
var plumber = require('gulp-plumber');
var paths = require('../paths');

gulp.task('styles', function () {
  var stream = gulp.src(paths.src + 'styles/**/*.styl')
    .pipe(plumber())
    .pipe(stylus());

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});