// Generated by CoffeeScript 1.7.1
var BillModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BillModel = (function(_super) {
  __extends(BillModel, _super);

  function BillModel() {
    return BillModel.__super__.constructor.apply(this, arguments);
  }

  BillModel.prototype.urlRoot = 'http://omnibus-backend.azurewebsites.net/api/bills/';

  BillModel.prototype.parse = function(response) {
    var data;
    data = {};
    return data.results = JSON.parse(response);
  };

  return BillModel;

})(Backbone.Model);

module.exports = BillModel;