var gulp = require('gulp');
// var gutil = require('gulp-util');

var jade = require('gulp-jade');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var stylus = require('gulp-stylus');
var coffeelint = require('gulp-coffeelint');
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

gulp.task('assets', function() {
 gulp.src(paths.assets + "**")
    .pipe(plumber())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('vendor-styles', function() {
    stream = gulp.src([
      paths.vendor + 'styles/bootstrap.css',
      paths.vendor + 'styles/bootstrap-theme.css'
    ])
    .pipe(plumber())
    .pipe(concat("vendor.css"));

  if (environment == 'production') {
    stream.pipe(minify());
  }

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});

gulp.task('vendor-scripts', function() {
  stream = gulp.src([
      paths.vendor + 'scripts/jquery.js',
      paths.vendor + 'scripts/bootstrap.js',
      paths.vendor + 'scripts/underscore.js',
      paths.vendor + 'scripts/backbone.js',
      paths.vendor + 'scripts/backbone.syphon.js',
      paths.vendor + 'scripts/backbone.marionette.js'
    ])
    .pipe(plumber())
    .pipe(concat("vendor.js"));

  if (environment == 'production') {
    stream.pipe(uglify());
  }

  stream.pipe(gulp.dest(paths.dest + 'js/'));
});

gulp.task('coffeelint', function () {
    gulp.src(paths.src + 'scripts/*.coffee')
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
  });

gulp.task('scripts', ['coffeelint'], function() {
  stream = gulp.src(paths.src + 'scripts/index.coffee', { read: false })
    .pipe(plumber())
    .pipe(browserify({
      debug: environment == 'development',
      transform: ['coffeeify', 'jadeify'],
      extensions: ['.coffee', '.jade']
    }))
    .pipe(concat('index.js'));

  if (environment == 'production') {
    stream.pipe(uglify());
  }

  stream.pipe(gulp.dest(paths.dest + 'js/'));
});

gulp.task('html', function() {
  gulp.src(paths.src + 'index.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: environment == 'development'
    }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function () {
  stream = gulp.src(paths.src + 'styles/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({ use: ['nib']}));

  if (environment == 'production') {
    stream.pipe(minify());
  }

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});

gulp.task('watch', function () {
  var server = livereload();

  gulp.watch(paths.src + 'scripts/**', ['scripts']);
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

gulp.task('vendor', ['vendor-styles', 'vendor-scripts']);
gulp.task('compile', ['html', 'styles', 'scripts']);

gulp.task('default', ['assets', 'vendor', 'compile']);
gulp.task('production', ['set-production', 'default']);

