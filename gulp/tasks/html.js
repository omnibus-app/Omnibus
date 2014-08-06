var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');

var paths = require('../paths');

gulp.task('html', function() {
  gulp
    .src(paths.src + '**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.dest));
});