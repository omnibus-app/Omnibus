// Generated by CoffeeScript 1.7.1
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