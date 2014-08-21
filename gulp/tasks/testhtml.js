var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var paths = require('../paths');

gulp.task('testhtml', function() {
  gulp
    .src(paths.src + '/test.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.test));
});