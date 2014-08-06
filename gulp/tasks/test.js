'use strict';

var gulp = require( 'gulp' );
var browserify = require( 'browserify' );

var source = require( 'vinyl-source-stream' );
var paths = require( '../paths.js' );

gulp.task('test', function(){
  var bundler =
    browserify({
      "entries": [paths.src + 'scripts/app.coffee'],
      "extensions": ['.coffee', '.jade'],
      "debug": true
    });

  var bundle = function(){
    return bundler
            .transform('coffeeify')
            .transform('jadeify')
            .transform('coverify')
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest(paths.dest + '/js'))
            .on('end', function(){
              console.log('ended');
            });
  };

  return bundle();
});