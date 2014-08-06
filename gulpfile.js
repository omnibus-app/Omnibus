'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var coffee = require('gulp-coffee');
var jade = require('gulp-jade');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var stylus = require('gulp-stylus');
var coffeelint = require('gulp-coffeelint');
var coffeeify = require( 'gulp-coffeeify' );
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

var environment = 'development';

var paths = {
  src: './app/',
  dest: './public/',
  vendor: './vendor/',
  assets: './assets/',
  bower: './bower_components/'
};
//set
gulp.task('set-production', function() {
  environment = 'production';
});

gulp.task('coffeelint', function () {
    gulp.src(paths.src + 'scripts/*.coffee')
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
  });

gulp.task('coffeeProd',['coffeelint'], function(){
  compile('./app/scripts/**/!(*-spec.coffee)+(*.coffee)');
});
gulp.task('coffeeTest',['coffeelint'], function(){
  compile('./app/scripts/**/*.coffee');
});
gulp.task('coffeeCover', ['coffeelint'], function(){
  compile('./app/scripts/**/*.coffee', true);
});


gulp.task('assets', function() {
  gulp
    .src(paths.assets + '**')
    .pipe(plumber())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('vendor-styles', function() {
  var stream = gulp.src([
    paths.vendor + 'styles/bootstrap.css',
    paths.vendor + 'styles/bootstrap-theme.css'
  ])
  .pipe(plumber())
  .pipe(concat('vendor.css'));

  if (environment === 'production') {
    stream.pipe(minify());
  }

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});

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

  if (environment === 'production') {
    stream.pipe(uglify());
  }

  stream.pipe(gulp.dest(paths.dest + 'js/'));
});


gulp.task('html', function() {
  gulp.src(paths.src + 'index.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: environment === 'development'
    }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function () {
  var stream = gulp.src(paths.src + 'styles/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({ use: ['nib']}));

  if (environment === 'production') {
    stream.pipe(minify());
  }

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});


gulp.task('vendor', ['vendor-styles', 'bower-scripts']);
gulp.task('compilePre', ['html', 'styles']);

gulp.task('compile', ['compilePre'], function(){
  if (environment === 'production'){
    gulp.start('coffeeProd');
  } else {
    gulp.start('coffeeTest');
  }
});

gulp.task('watch', function () {
  var server = livereload();

  gulp.watch(paths.src + 'scripts/**', ['compile']);
  gulp.watch(paths.src + 'styles/**/*.styl', ['styles']);
  gulp.watch(paths.src + 'index.jade', ['html']);
  gulp.watch([
      paths.dest + 'js/*.js',
      paths.dest + 'css/*.css',
      paths.dest + '**/*.html'
    ], function(evt) {
      server.changed(evt.path);
    });
});

gulp.task('test', ['assets', 'vendor', 'coffeeCover']);

gulp.task('default', ['assets', 'vendor', 'build']);

gulp.task('production', ['set-production', 'default']);

gulp.task( 'build', function () {
  gulp
    .src( './app/scripts/app.coffee' )
    .pipe( plumber() )
    .pipe( coffeeify() )
    .pipe( concat( 'app.js' ) )
    .pipe( gulp.dest( './public/js/' ) );
});

gulp.task( 'x-test', function () {
  gulp
    .src( './app/scripts/test.coffee' )
    .pipe( plumber() )
    .pipe( coffeeify() )
    .pipe( concat( 'test.js' ) )
    .pipe( gulp.dest( './test/' ) );
});
