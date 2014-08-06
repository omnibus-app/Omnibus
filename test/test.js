(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var App, MainController, expect;

  expect = chai.expect;

  App = require("./app.coffee");

  MainController = require("./controller.coffee");

  App.start();

  describe("app", function() {
    it("search region should  exist", function() {
      return expect(App.search).to.exist;
    });
    it("chart region should exist", function() {
      return expect(App.chart).to.exist;
    });
    return it("sideData region should exist", function() {
      return expect(App.meta).to.exist;
    });
  });

}).call(this);

},{"./app.coffee":2,"./controller.coffee":3}],2:[function(require,module,exports){
(function() {
  var App, MainController, MainRouter;

  MainRouter = require('./router.coffee');

  MainController = require('./controller.coffee');

  App = new Backbone.Marionette.Application();

  App.addRegions({
    info: '#info',
    search: '#search',
    chart: '#chart',
    meta: '#meta'
  });

  App.addInitializer((function(_this) {
    return function(data) {
      _this.router = new MainRouter();
      _this.controller = new MainController({
        router: _this.router,
        regions: {
          info: _this.info,
          search: _this.search,
          chart: _this.chart,
          meta: _this.meta
        }
      });
      return _this.router.processAppRoutes(_this.controller, {
        'bill/:id': 'showBill'
      });
    };
  })(this));

  App.on('initialize:after', function(options) {
    if (Backbone.history) {
      return Backbone.history.start({
        pushState: true
      });
    }
  });

  module.exports = App;

}).call(this);

},{"./controller.coffee":3,"./router.coffee":5}],3:[function(require,module,exports){
(function() {
  var MainController,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MainController = (function(_super) {
    __extends(MainController, _super);

    function MainController() {
      return MainController.__super__.constructor.apply(this, arguments);
    }

    MainController.prototype.initialize = function(options) {
      this.router = options.router;
      return this.regions = options.regions;
    };

    MainController.prototype.showBill = function() {};

    return MainController;

  })(Marionette.Controller);

  module.exports = MainController;

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  require("./app-test.coffee");

}).call(this);

},{"./app-test.coffee":1}],5:[function(require,module,exports){
(function() {
  var MainRouter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MainRouter = (function(_super) {
    __extends(MainRouter, _super);

    function MainRouter() {
      this.home = __bind(this.home, this);
      return MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'home'
    };

    MainRouter.prototype.home = function() {
      return this.navigate('someRoute', {
        trigger: true,
        replace: true
      });
    };

    return MainRouter;

  })(Marionette.AppRouter);

  module.exports = MainRouter;

}).call(this);

},{}]},{},[4])
