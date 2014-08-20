var gulp = require('gulp');
var livereload = require('gulp-livereload');
var paths = require('../paths');

gulp.task('watch', ['setWatch','browserSync'], function(){
  var server = livereload();
  gulp
    .watch(paths.src + '/index.jade', ['html']);
  gulp
    .watch(paths.styles + '*.sass', ['styles']);
  gulp
    .watch([
             paths.dest + 'js/*.js',
             paths.dest + '**/*.html',
             paths.dest + 'css/*.css'
           ], function(event){
            server.changed(event.path);
           });
});
