// Generated by CoffeeScript 1.7.1
var EnactedModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EnactedModel = (function(_super) {
  __extends(EnactedModel, _super);

  function EnactedModel() {
    return EnactedModel.__super__.constructor.apply(this, arguments);
  }

  EnactedModel.prototype.initialize = function(options) {
    return this.url = 'http://omnibus-backend.azurewebsites.net/api/congress/' + options.id + '/enacted';
  };

  EnactedModel.prototype.urlRoot = EnactedModel.url;

  EnactedModel.prototype.parse = function(response) {
    var data;
    data = {};
    data.votes = response;
    return data;
  };

  return EnactedModel;

})(Backbone.Model);

module.exports = EnactedModel;
