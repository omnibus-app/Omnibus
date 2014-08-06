'use strict';

var gulp = require( 'gulp' );
var browserify = require( 'browserify' );
var watchify = require( 'watchify' );

var source = require( 'vinyl-source-stream' );
var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');
var paths = require( '../paths.js' );

gulp.task('browserify', function(){

  var bundler =
    browserify({
      entries: [paths.src + 'scripts/app.coffee'],
      extensions: ['.coffee', '.jade'],
      debug: true,
      cache: {},
      packageCache: {},
      fullPaths: true
    });

  var watchedBundle = global.isWatching ? watchify(bundler) : bundler;

  watchedBundle
    .transform('coffeeify')
    .transform('jadeify');

  var bundle = function(){
    bundleLogger.start();

    return bundler
            .on('error', handleErrors)
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest(paths.dest + '/js'))
            .on('end', bundleLogger.end);
  };

  if (global.isWatching){
    watchedBundle.on('update', bundle);
  }

  return bundle();
});