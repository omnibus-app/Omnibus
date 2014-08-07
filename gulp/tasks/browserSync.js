var browserSync = require('browser-sync');
var gulp = require('gulp');
var paths = require('../paths.js');

gulp.task('browserSync', ['build'], function() {
  browserSync.init([paths.dest + '**/*'], {
    server: {
      baseDir: paths.dest
    }
  });
});