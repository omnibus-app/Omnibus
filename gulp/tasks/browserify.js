'use strict';

var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var browserify = require( 'browserify' );
var watchify = require( 'watchify' );

var source = require( 'vinyl-source-stream' );
var paths = require( './gulp/paths' );

gulp.task('browserify', function(){
  var transforms = ['coffeeify'];
  var bundleMethod = global.isWatching ? watchify : browserify;

  var bundler =
    bundleMethod({
      "entries": [paths.src + '/app.coffee'],
      "extensions": ['.coffee', '.jade'],
      "debug": true
    });

  var bundle = function(){
    return bundler
            .transform('coffeeify')
            .transform('jadeify')
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest(paths.dest + '/js'))
            .on('end', function(){
              console.log('ended');
            });
  };

  if (global.isWatching){
    bundler.on('update', bundle);
  }

  return bundle();
});