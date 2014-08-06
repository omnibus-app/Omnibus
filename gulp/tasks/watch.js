var gulp = require('gulp');
var livereload = require('gulp-livereload');
var paths = require('../paths');

gulp.task('watch', ['setWatch','build', 'bower-scripts', 'assets', 'html'], function(){
  var server = livereload();
  gulp
    .watch('../app/**/*.jade', ['jade']);
  gulp
    .watch([
             paths.dest + 'js/*.js',
             paths.dest + '**/*.html',
             paths.dest + 'css/*.css'
           ], function(event){
            server.changed(event.path);
           });
});