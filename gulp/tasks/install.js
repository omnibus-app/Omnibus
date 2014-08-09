'use strict';

var gulp = require( 'gulp' );
var install = require( 'gulp-install' );

gulp.task( 'install', function() {
  gulp.src([ './bower.json', './package.json' ])
    .pipe(install());
});
