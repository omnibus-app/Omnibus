var gulp = require('gulp');
var coffeelint = require('gulp-coffeelint');
var paths = require('../paths.js');

gulp.task('coffeelint', function () {
  gulp
    .src(paths.src + 'scripts/**/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter());
});