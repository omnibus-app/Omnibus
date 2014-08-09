// Generated by CoffeeScript 1.7.1
var ChartView, Rickshaw,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Rickshaw = require('rickshaw');

ChartView = (function(_super) {
  var data;

  __extends(ChartView, _super);

  function ChartView() {
    return ChartView.__super__.constructor.apply(this, arguments);
  }

  ChartView.prototype.template = require('./chart-view.jade');

  data = [
    {
      x: 0,
      y: 40
    }, {
      x: 1,
      y: 49
    }, {
      x: 2,
      y: 38
    }, {
      x: 3,
      y: 30
    }, {
      x: 4,
      y: 32
    }
  ];

  ChartView.prototype.initialize = function() {};

  ChartView.prototype.render = function() {
    this.graph = new Rickshaw.Graph({
      element: this.el,
      renderer: "line",
      padding: {
        top: 0.02,
        left: 0.02,
        right: 0.02,
        bottom: 0.02
      },
      series: [
        {
          color: "steelblue",
          data: data
        }
      ]
    });
    this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: this.graph
    });
    this.hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: this.graph,
      xFormatter: function(x) {
        return x + " X axes units";
      },
      yFormatter: function(y) {
        return Math.floor(y) + "% Y axes units";
      }
    });
    return this.graph.render();
  };

  return ChartView;

})(Marionette.ItemView);

module.exports = ChartView;
