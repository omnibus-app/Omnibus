'use strict';

var gulp = require( 'gulp' );
var browserify = require( 'browserify' );

var source = require( 'vinyl-source-stream' );
var paths = require( '../paths.js' );
var shell = require('gulp-shell');
var spawn = require('gulp-spawn');

gulp.task('buildTest',['html', 'styles', 'assets', 'vendor'], function(){
  var bundler =
    browserify({
      "entries": [paths.src + 'scripts/test.coffee'],
      "extensions": ['.coffee', '.jade'],
      "debug": true
    });

  var bundle = function(){
    return bundler
            .transform('coffeeify')
            // .transform('coverify')
            .transform('jadeify')
            .bundle()
            .pipe(source('test.js'))
            .pipe(gulp.dest(paths.test))
            .on('end', function(){
              console.log('ended');
            })
  };

  return bundle();
});
