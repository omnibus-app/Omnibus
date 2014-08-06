'use strict';

var fs = require( 'fs' );

module.exports = {

  makePkgJson: function () {
    var config = require( '../package.json' ).testling;
    var json = JSON.stringify( config, null, 2 );
    if ( !fs.existsSync( '../tmp' ) ) {
      fs.mkdirSync( '../tmp' );
    }
    fs.writeFileSync( '../tmp/package.json', json );
  },

  proc: function () {
    console.log( process.cwd );
  }

};
