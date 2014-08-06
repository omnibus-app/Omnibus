var gulp = require('gulp');
var livereload = require('livereload');
var paths = require('../paths');

gulp.task('watch', ['setWatch'], function(){
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