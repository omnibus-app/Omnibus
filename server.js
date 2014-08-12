'use strict';

var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

var pages = {
  'index': path.join(__dirname, 'public/index.html'),
  404: path.join( __dirname, 'public/404.html' )
};

var router = express.Router();

router.get('/bills/:id', function(req, res){
  res.sendFile(pages.index);
});

app.use( '/', router );
app.use( '/bills', router );
app.use( '/bills/*', router );

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.sendfile( pages[404] );
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.sendfile( pages[404] );
});

app.set( 'port', process.env.PORT || 8124 );

app.listen( app.get( 'port' ), function() {
  console.log( 'server is on at port: '+ app.get( 'port' ) +
              ', but it doesn\'t do anything.' );
});
