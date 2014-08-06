var gulp = require('gulp');
var plumber = require('gulp-plumber');
var paths = require('../paths.js');

// sets up assests for use with plumber, seems odd
gulp.task('assets', function() {
  gulp
    .src(paths.assets + '**')
    .pipe(plumber())
    .pipe(gulp.dest(paths.dest));
});