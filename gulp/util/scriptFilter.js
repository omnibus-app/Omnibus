var path = require('path');

//prevents loading of non- js/coffee
module.exports = function(name) {
  return /(\.(js|coffee)$)/i.test(path.extname(name));
};