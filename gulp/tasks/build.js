var gulp = require('gulp');

gulp.task('build', ['browserify', 'vendor', 'assets', 'html']);