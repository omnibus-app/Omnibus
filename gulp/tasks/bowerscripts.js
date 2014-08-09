var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');

var paths = require('../paths');

gulp.task('bower-scripts', function() {
  var stream = gulp.src([
    paths.bower + 'd3/d3.js',
    paths.bower + 'jquery/dist/jquery.js',
    paths.bower + 'underscore/underscore.js',
    paths.bower + 'backbone/backbone.js',
    paths.bower + 'marionette/lib/backbone.marionette.js',
    paths.bower + 'backbone.syphon/lib/backbone.syphon.js',
  ])
  .pipe(plumber())
  .pipe(concat('bower_components.js'));

  stream.pipe(gulp.dest(paths.dest + 'js/'));
});