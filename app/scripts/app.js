// Generated by CoffeeScript 1.7.1
(function() {
  var App;

  App = new Backbone.Marionette.Application();

  App.addInitializer((function(_this) {
    return function(data) {};
  })(this));

  App.on('initialize:after', function(options) {
    if (Backbone.history) {
      return Backbone.history.start({
        pushState: true
      });
    }
  });

  App.addRegions({
    search: '#search',
    chart: '#chart',
    sideData: '#sideData'
  });

  module.exports = App;

}).call(this);
