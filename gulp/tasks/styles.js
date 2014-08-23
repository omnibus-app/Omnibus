var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var paths = require('../paths');

gulp.task('styles', function () {
  var stream = gulp.src(paths.styles + '/**/*.sass')
    .pipe(plumber())
    .pipe(sass());

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});
