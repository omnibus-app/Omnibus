module.exports = function ( target ) {
  var sources = [].slice.call( arguments, 1 );
  sources.forEach( function ( source ) {
    Object.keys( souce ).forEach( function ( key ) {
      target[key] = source[key];
    });
  });
  return target;
};
