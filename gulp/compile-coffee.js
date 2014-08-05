'use strict';

var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var concat = require( 'gulp-concat' );
var coffee = require( 'gulp-coffee' );
var browserify = require( 'gulp-browserify' );
var paths = require( './paths' );

module.exports = function( source, coverify ) {
  gulp.src( source )
    .pipe( coffee({ bare: true })).on( 'error', gutil.log )
    .pipe( gulp.dest( paths.temp ) )
    .on( 'end', function (){
      var temp = gulp.src( './tmp/**/*.js' );
      if ( coverify ){
        temp
          .pipe( browserify({
            transform: ['coverify']
          }))
          .pipe( concat( 'index.js' ) )
          .pipe( gulp.dest( paths.dest + '/js' ) );
      } else {
        temp
          .pipe( browserify() )
          .pipe( concat( 'index.js' ) )
          .pipe( gulp.dest( paths.dest + '/js' ) );
      }
    });
};
