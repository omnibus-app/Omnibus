(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/scripts/app.coffee":[function(require,module,exports){
var App, MainController;

MainController = require('./controller.coffee');

App = new Backbone.Marionette.Application();

App.addRegions({
  welcome: '#welcome',
  search: '#search',
  content: '#content'
});

App.spinnerOptions = {
  radius: 30,
  lines: 22,
  length: 16,
  speed: .75
};

App.spinner = new Spinner(this.spinnerOptions).spin();

App.on('before:start', function(options) {
  this.controller = new MainController({
    regions: {
      welcome: this.welcome,
      search: this.search,
      content: this.content
    }
  });
  this.router = new Marionette.AppRouter({
    controller: this.controller,
    appRoutes: {
      '': 'home',
      'bills/:id': 'showBill',
      'bills/search/:query': 'searchResults'
    }
  });
  return this.controller.router = this.router;
});

App.on('start', function(options) {
  if (Backbone.history) {
    return Backbone.history.start({
      pushState: true
    });
  }
});

window.App = App;

module.exports = App;


},{"./controller.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/controller.coffee"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/collections/bills-collection.coffee":[function(require,module,exports){
var BillsCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BillsCollection = (function(_super) {
  __extends(BillsCollection, _super);

  function BillsCollection() {
    return BillsCollection.__super__.constructor.apply(this, arguments);
  }

  BillsCollection.prototype.initialize = function(options) {
    return this.url = 'http://omnibus-backend.azurewebsites.net/api/bills/search?q=' + options.query;
  };

  BillsCollection.prototype.model = require('../models/result-model.coffee');

  BillsCollection.prototype.urlRoot = BillsCollection.url;

  BillsCollection.prototype.parse = function(response) {
    var data;
    data = {};
    return data.results = response.results;
  };

  return BillsCollection;

})(Backbone.Collection);

module.exports = BillsCollection;


},{"../models/result-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/result-model.coffee"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/controller.coffee":[function(require,module,exports){
var AmendInfoModel, AmendInfoView, AmendModel, AmendView, BillHoverModel, BillHoverView, BillModel, BillsCollection, ChartView, ContentLayout, EnactedAggModel, EnactedAggView, EnactedModel, EnactedView, MainController, MetaInfoView, MetaLayout, SearchResults, SearchView, WelcomeView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WelcomeView = require('./views/welcome-view.coffee');

SearchView = require('./views/search-view.coffee');

ContentLayout = require('./views/content-views/content-layout.coffee');

ChartView = require('./views/content-views/chart-view.coffee');

SearchResults = require('./views/content-views/search-results-view.coffee');

MetaLayout = require('./views/meta-views/meta-layout.coffee');

BillModel = require('./models/bill-model.coffee');

BillsCollection = require('./collections/bills-collection.coffee');

AmendInfoView = require('./views/meta-views/meta-amend-info-view.coffee');

AmendInfoModel = require('./models/meta-amend-info-model.coffee');

AmendView = require('./views/meta-views/meta-amend-view.coffee');

MetaInfoView = require('./views/meta-views/meta-info-view.coffee');

AmendModel = require('./models/meta-amend-model.coffee');

EnactedView = require('./views/content-views/enacted-view.coffee');

EnactedModel = require('./models/enacted-model.coffee');

BillHoverModel = require('./models/meta-bill-hover-model.coffee');

BillHoverView = require('./views/meta-views/meta-bill-hover-view.coffee');

EnactedAggView = require('./views/meta-views/meta-enacted-agg-view.coffee');

EnactedAggModel = require('./models/meta-enacted-agg-model.coffee');

MainController = (function(_super) {
  __extends(MainController, _super);

  function MainController() {
    return MainController.__super__.constructor.apply(this, arguments);
  }

  MainController.prototype.initialize = function(options) {
    return this.searchView();
  };

  MainController.prototype.showSpinner = function(region) {
    region.empty();
    return region.$el.append(App.spinner.el);
  };

  MainController.prototype.home = function() {
    var base, congressOne, congressThree, congressTwo, contentLayout;
    contentLayout = new ContentLayout;
    this.options.regions.content.show(contentLayout);
    $('#chart').append(App.spinner.el);
    base = 'http://omnibus-backend.azurewebsites.net/api/congress/';
    congressOne = $.ajax(base + '111/enacted');
    congressTwo = $.ajax(base + '112/enacted');
    congressThree = $.ajax(base + '113/enacted');
    return $.when(congressOne, congressTwo, congressThree).done((function(_this) {
      return function(dataOne, dataTwo, dataThree) {
        var data, enactedModel, enactedView;
        data = [].concat(dataOne[0], dataTwo[0], dataThree[0]);
        enactedModel = new EnactedModel({
          bills: data
        });
        enactedView = new EnactedView({
          model: enactedModel
        });
        _this.options.regions.content.currentView.chart.show(enactedView);
        enactedView.render();
        return _this.makeEnactedMeta(enactedModel);
      };
    })(this));
  };

  MainController.prototype.makeEnactedMeta = function(model) {
    var chartView, metaLayout;
    chartView = this.options.regions.content.currentView;
    metaLayout = new MetaLayout;
    chartView.meta.show(metaLayout);
    this.listenTo(chartView.chart.currentView, 'showBill', function(billId) {
      return this.router.navigate('bills/' + billId, {
        trigger: true
      });
    });
    this.listenTo(chartView.chart.currentView, 'showMeta', function(data) {
      return this.makeBillHover(data).then(function(billView) {
        return metaLayout['meta1'].show(billView);
      });
    });
    this.makeBillHover().then(function(billView) {
      return metaLayout['meta1'].show(billView);
    });
    return this.makeEnactedAggregate(model).then(function(metaView) {
      return metaLayout['meta2'].show(metaView);
    });
  };

  MainController.prototype.makeBillHover = function(hoverData) {
    var amendModel, billHoverModel, billHoverView, deferred;
    deferred = new $.Deferred();
    if (hoverData) {
      billHoverModel = new BillHoverModel({
        data: hoverData
      });
      billHoverView = new BillHoverView({
        model: billHoverModel
      });
    } else {
      amendModel = new AmendModel;
      billHoverView = new MetaInfoView({
        model: amendModel
      });
    }
    deferred.resolve(billHoverView);
    return deferred.promise();
  };

  MainController.prototype.makeEnactedAggregate = function(model) {
    var deferred, enactedAggView;
    deferred = new $.Deferred();
    enactedAggView = new EnactedAggView({
      model: model
    });
    deferred.resolve(enactedAggView);
    return deferred.promise();
  };

  MainController.prototype.showBill = function(billId) {
    this.showSpinner(this.options.regions.content);
    return this.getData(billId).then((function(_this) {
      return function(billModel) {
        return _this.makeBill(billModel, billId);
      };
    })(this));
  };

  MainController.prototype.getData = function(billId) {
    var billModel, deferred;
    deferred = new $.Deferred();
    if (!window.localStorage.getItem(billId)) {
      billModel = new BillModel({
        id: billId
      });
      billModel.fetch().then(function(res) {
        window.localStorage.setItem(billId, JSON.stringify(res));
        return deferred.resolve(billModel);
      });
    } else {
      billModel = new BillModel({
        votes: JSON.parse(window.localStorage.getItem(billId))
      });
      deferred.resolve(billModel);
    }
    return deferred.promise();
  };

  MainController.prototype.makeBill = function(billModel, billId) {
    var chartView, contentLayout;
    if (!window.localStorage.getItem('omnibus-visited')) {
      this.welcomeView(billModel);
      window.localStorage.setItem('omnibus-visited', true);
    }
    chartView = new ChartView({
      model: billModel
    });
    if (!this.options.regions.content.currentView) {
      contentLayout = new ContentLayout;
      this.options.regions.content.show(contentLayout);
    }
    this.options.regions.content.currentView.chart.show(chartView);
    return this.makeBillMeta(billModel, billId);
  };

  MainController.prototype.makeBillMeta = function(model, billId) {
    var chartView, metaLayout;
    chartView = this.options.regions.content.currentView;
    metaLayout = new MetaLayout;
    chartView.meta.show(metaLayout);
    this.listenTo(chartView.chart.currentView, 'showAmendmentData', function(data) {
      return this.makeAmendHover(data).then(function(amendView) {
        return metaLayout['meta1'].show(amendView);
      });
    });
    this.makeAmendHover().then(function(amendView) {
      return metaLayout['meta1'].show(amendView);
    });
    return this.makeAmendAggregate(model, billId).then(function(metaView) {
      return metaLayout['meta2'].show(metaView);
    });
  };

  MainController.prototype.makeAmendHover = function(amendData) {
    var amendModel, amendView, deferred;
    deferred = new $.Deferred();
    if (amendData) {
      amendModel = new AmendModel({
        data: amendData
      });
      amendView = new AmendView({
        model: amendModel
      });
    } else {
      amendModel = new AmendModel;
      amendView = new MetaInfoView({
        model: amendModel
      });
    }
    deferred.resolve(amendView);
    return deferred.promise();
  };

  MainController.prototype.makeAmendAggregate = function(model, billId) {
    var amendInfoView, deferred;
    deferred = new $.Deferred();
    amendInfoView = new AmendInfoView({
      model: model
    });
    deferred.resolve(amendInfoView);
    return deferred.promise();
  };

  MainController.prototype.welcomeView = function(billModel) {
    var welcomeView;
    welcomeView = new WelcomeView({
      model: billModel
    });
    $('#information').hide();
    this.listenTo(welcomeView, 'welcome:close', function() {
      this.options.regions.welcome.empty();
      return $('#information').show();
    });
    return this.options.regions.welcome.show(welcomeView);
  };

  MainController.prototype.searchView = function() {
    var searchView;
    searchView = new SearchView;
    this.listenTo(searchView, 'findBill:submit', function(billId) {
      return this.router.navigate('bills/' + billId, {
        trigger: true
      });
    });
    this.listenTo(searchView, 'welcome:show', function() {
      return this.welcomeView(searchView.model);
    });
    this.listenTo(searchView, 'search:bills:submit', function(query) {
      return this.router.navigate('bills/search/' + query, {
        trigger: true
      });
    });
    return this.options.regions.search.show(searchView);
  };

  MainController.prototype.searchResults = function(query) {
    var billsCollection;
    this.showSpinner(this.options.regions.content);
    billsCollection = new BillsCollection({
      query: query
    });
    return billsCollection.fetch().then((function(_this) {
      return function() {
        var searchResults;
        searchResults = new SearchResults({
          collection: billsCollection
        });
        _this.listenTo(searchResults, 'bill:submit', function(billId) {
          return this.router.navigate('bills/' + billId, {
            trigger: true
          });
        });
        return _this.options.regions.content.show(searchResults);
      };
    })(this));
  };

  return MainController;

})(Marionette.Controller);

module.exports = MainController;


},{"./collections/bills-collection.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/collections/bills-collection.coffee","./models/bill-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/bill-model.coffee","./models/enacted-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/enacted-model.coffee","./models/meta-amend-info-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-amend-info-model.coffee","./models/meta-amend-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-amend-model.coffee","./models/meta-bill-hover-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-bill-hover-model.coffee","./models/meta-enacted-agg-model.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-enacted-agg-model.coffee","./views/content-views/chart-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/chart-view.coffee","./views/content-views/content-layout.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/content-layout.coffee","./views/content-views/enacted-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/enacted-view.coffee","./views/content-views/search-results-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/search-results-view.coffee","./views/meta-views/meta-amend-info-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-amend-info-view.coffee","./views/meta-views/meta-amend-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-amend-view.coffee","./views/meta-views/meta-bill-hover-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-bill-hover-view.coffee","./views/meta-views/meta-enacted-agg-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-enacted-agg-view.coffee","./views/meta-views/meta-info-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-info-view.coffee","./views/meta-views/meta-layout.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-layout.coffee","./views/search-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/search-view.coffee","./views/welcome-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/welcome-view.coffee"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/bubble-chart.coffee":[function(require,module,exports){
var BubbleChart,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BubbleChart = (function() {
  function BubbleChart(data) {
    this.hide_details = __bind(this.hide_details, this);
    this.show_details = __bind(this.show_details, this);
    this.hide_years = __bind(this.hide_years, this);
    this.display_partys = __bind(this.display_partys, this);
    this.display_years = __bind(this.display_years, this);
    this.move_towards_party = __bind(this.move_towards_party, this);
    this.move_towards_year = __bind(this.move_towards_year, this);
    this.display_by_party = __bind(this.display_by_party, this);
    this.display_by_year = __bind(this.display_by_year, this);
    this.move_towards_center = __bind(this.move_towards_center, this);
    this.display_group_all = __bind(this.display_group_all, this);
    this.start = __bind(this.start, this);
    this.create_vis = __bind(this.create_vis, this);
    this.create_nodes = __bind(this.create_nodes, this);
    var buttonHolder, buttons, max_amount, pair, _i, _len;
    this.data = data;
    this.width = $("#chart").width();
    this.height = $("#chart").height();
    d3.selection.prototype.moveToFront = function() {
      return this.each(function() {
        this.parentNode.appendChild(this);
      });
    };
    buttons = [['combined', 'All Bills'], ['byYear', 'By Congress'], ['byParty', 'By Party']];
    buttonHolder = $("#bubbleChart");
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      pair = buttons[_i];
      buttonHolder.append("<button id=" + pair[0] + ">" + pair[1] + "</button>");
    }
    this.center = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.year_centers = {
      "111": {
        x: this.width / 3,
        y: this.height / 2
      },
      "112": {
        x: this.width / 2,
        y: this.height / 2
      },
      "113": {
        x: 2.3 * this.width / 3,
        y: this.height / 2
      }
    };
    this.party_centers = {
      "Republican": {
        x: this.width / 3,
        y: this.height / 2
      },
      "Split": {
        x: this.width / 2,
        y: this.height / 2
      },
      "Democrat": {
        x: 2.3 * this.width / 3,
        y: this.height / 2
      }
    };
    this.layout_gravity = -0.01;
    this.damper = 0.1;
    this.vis = null;
    this.nodes = [];
    this.force = null;
    this.circles = null;
    this.fill_color = d3.scale.ordinal().domain(["low", "medium", "high"]).range(["#d84b2a", "#beccae", "#7aa25c"]);
    max_amount = d3.max(this.data, function(d) {
      return parseInt(d.last_version.pages);
    });
    this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 45]);
    this.create_nodes();
    this.create_vis();
  }

  BubbleChart.prototype.create_nodes = function() {
    this.data.forEach((function(_this) {
      return function(d, i) {
        var node;
        node = {
          id: d.bill_id,
          radius: _this.radius_scale(parseInt(d.last_version.pages)),
          value: d.last_version.pages,
          name: d.short_title,
          description: d.official_title,
          sponsor: d.sponsor ? d.sponsor.title + " " + d.sponsor.first_name + " " + d.sponsor.last_name : null,
          sponsorId: d.sponsor_id,
          committee: d.committee_ids,
          introduced: d.introduced_on,
          congress: d.congress,
          exited: d.last_action_at,
          x: Math.random() * 900,
          y: Math.random() * 800
        };
        return _this.nodes.push(node);
      };
    })(this));
    return this.nodes.sort(function(a, b) {
      return b.value - a.value;
    });
  };

  BubbleChart.prototype.create_vis = function() {
    var that;
    this.vis = d3.select("#bubbleChart").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
    this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
      return d.id;
    });
    that = this;
    this.circles.enter().append("circle").attr("r", 0).attr("class", "bubble").attr("fill", (function(_this) {
      return function(d) {
        return _this.fill_color(d.group);
      };
    })(this)).attr("stroke-width", 1.5).attr("stroke", (function(_this) {
      return function(d) {
        return d3.rgb(_this.fill_color(d.group)).darker();
      };
    })(this)).attr("data-bill", function(d) {
      return "" + d.id;
    }).on("mouseover", function(d, i) {
      return that.show_details(d, i, this);
    }).on("mouseout", function(d, i) {
      return that.hide_details(d, i, this);
    });
    return this.circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
    });
  };

  BubbleChart.prototype.charge = function(d) {
    return d.radius * d.radius / -8.7;
  };

  BubbleChart.prototype.start = function() {
    return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
  };

  BubbleChart.prototype.display_group_all = function() {
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(.9).on("tick", (function(_this) {
      return function(e) {
        return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
      };
    })(this));
    this.force.start();
    return this.hide_years();
  };

  BubbleChart.prototype.move_towards_center = function(alpha) {
    return (function(_this) {
      return function(d) {
        d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.025) * alpha;
        return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.025) * alpha;
      };
    })(this);
  };

  BubbleChart.prototype.display_by_year = function() {
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
      return function(e) {
        return _this.circles.each(_this.move_towards_year(e.alpha)).attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
      };
    })(this));
    this.force.start();
    return this.display_years();
  };

  BubbleChart.prototype.display_by_party = function() {
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.8).on("tick", (function(_this) {
      return function(e) {
        return _this.circles.each(_this.move_towards_party(e.alpha)).attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
      };
    })(this));
    this.force.start();
    return this.display_partys();
  };

  BubbleChart.prototype.move_towards_year = function(alpha) {
    return (function(_this) {
      return function(d) {
        var target;
        target = _this.year_centers[d.congress];
        d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
        return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
      };
    })(this);
  };

  BubbleChart.prototype.move_towards_party = function(alpha) {
    return (function(_this) {
      return function(d) {
        var target;
        target = _this.party_centers[d.party];
        d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
        return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
      };
    })(this);
  };

  BubbleChart.prototype.display_years = function() {
    var years, years_data, years_x;
    years_x = {
      "111": 160,
      "112": this.width / 2,
      "113": this.width - 160
    };
    years_data = d3.keys(years_x);
    years = this.vis.selectAll(".years").data(years_data);
    return years.enter().append("text").attr("class", "years").attr("x", (function(_this) {
      return function(d) {
        return years_x[d];
      };
    })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
      return d;
    });
  };

  BubbleChart.prototype.display_partys = function() {
    var partys, partys_data, partys_x;
    partys_x = {
      "Republican": 160,
      "Split": this.width / 2,
      "Democrat": this.width - 160
    };
    partys_data = d3.keys(partys_x);
    partys = this.vis.selectAll(".partys").data(partys_data);
    return years.enter().append("text").attr("class", "partys").attr("x", (function(_this) {
      return function(d) {
        return partys_x[d];
      };
    })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
      return d;
    });
  };

  BubbleChart.prototype.hide_years = function() {
    var years;
    return years = this.vis.selectAll(".years").remove();
  };

  BubbleChart.prototype.show_details = function(data, i, element) {
    var sel;
    sel = d3.select(element);
    sel.attr("stroke", "black");
    return sel.moveToFront();
  };

  BubbleChart.prototype.hide_details = function(data, i, element) {
    return d3.select(element).attr("stroke", (function(_this) {
      return function(d) {
        return d3.rgb(_this.fill_color(d.group)).darker();
      };
    })(this));
  };

  return BubbleChart;

})();

module.exports = BubbleChart;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/graph-util.coffee":[function(require,module,exports){
var buildData;

buildData = function(json, i) {
  var temp;
  temp = {};
  temp.number = json.number;
  temp.repY = +json.vote.republican.yes;
  temp.repN = +json.vote.republican.no;
  temp.repAbs = +json.vote.republican.not_voting;
  temp.demY = +json.vote.democratic.yes;
  temp.demN = +json.vote.democratic.no;
  temp.demAbs = +json.vote.democratic.not_voting;
  temp.amdt = json.amendment_id;
  temp.bill = json.bill_id;
  return temp;
};

module.exports = {
  buildData: buildData
};


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/sorting.coffee":[function(require,module,exports){
module.exports = {
  leastSupported: function(a, b) {
    return (b.demY + b.repY) - (a.demY + a.repY);
  },
  mostSupported: function(a, b) {
    return (a.demY + a.repY) - (b.demY + b.repY);
  },
  democratTotal: function(a, b) {
    return b.demY - a.demY;
  },
  republicanTotal: function(a, b) {
    return b.repY - a.repY;
  },
  democratDiff: function(a, b) {
    return (b.demY / b.repY) - (a.demY / a.repY);
  },
  republicanDiff: function(a, b) {
    return (b.repY / b.demY) - (a.repY / a.demY);
  },
  newestFirst: function(a, b) {
    return a.number - b.number;
  },
  oldestFirst: function(a, b) {
    return b.number - a.number;
  },
  sortBy: function(item, sortFunc) {
    return item.selectAll('g.amdt-bar').sort(sortFunc).transition().delay(200).duration(500).attr('transform', function(d, i) {
      return 'translate(' + 0 + ',' + i * 15 + ')';
    });
  }
};


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/bill-model.coffee":[function(require,module,exports){
var BillModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BillModel = (function(_super) {
  __extends(BillModel, _super);

  function BillModel() {
    return BillModel.__super__.constructor.apply(this, arguments);
  }

  BillModel.prototype.initialize = function(options) {
    return this.url = 'http://omnibus-backend.azurewebsites.net/api/bills/' + options.id + '/votes';
  };

  BillModel.prototype.urlRoot = BillModel.url;

  BillModel.prototype.parse = function(response) {
    var data;
    data = {};
    data.votes = response;
    return data;
  };

  return BillModel;

})(Backbone.Model);

module.exports = BillModel;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/enacted-model.coffee":[function(require,module,exports){
var EnactedModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EnactedModel = (function(_super) {
  __extends(EnactedModel, _super);

  function EnactedModel() {
    return EnactedModel.__super__.constructor.apply(this, arguments);
  }

  EnactedModel.prototype.initialize = function(options) {};

  EnactedModel.prototype.parse = function(response) {};

  return EnactedModel;

})(Backbone.Model);

module.exports = EnactedModel;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-amend-info-model.coffee":[function(require,module,exports){
var AmendInfo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AmendInfo = (function(_super) {
  __extends(AmendInfo, _super);

  function AmendInfo() {
    return AmendInfo.__super__.constructor.apply(this, arguments);
  }

  AmendInfo.prototype.urlRoot = 'http://omnibus-backend.azurewebsites.net/api/bills/';

  return AmendInfo;

})(Backbone.Model);

module.exports = AmendInfo;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-amend-model.coffee":[function(require,module,exports){
var AmendModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AmendModel = (function(_super) {
  __extends(AmendModel, _super);

  function AmendModel() {
    return AmendModel.__super__.constructor.apply(this, arguments);
  }

  return AmendModel;

})(Backbone.Model);

module.exports = AmendModel;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-bill-hover-model.coffee":[function(require,module,exports){
var BillHoverModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BillHoverModel = (function(_super) {
  __extends(BillHoverModel, _super);

  function BillHoverModel() {
    return BillHoverModel.__super__.constructor.apply(this, arguments);
  }

  return BillHoverModel;

})(Backbone.Model);

module.exports = BillHoverModel;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/meta-enacted-agg-model.coffee":[function(require,module,exports){
var EnactedAggModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EnactedAggModel = (function(_super) {
  __extends(EnactedAggModel, _super);

  function EnactedAggModel() {
    return EnactedAggModel.__super__.constructor.apply(this, arguments);
  }

  return EnactedAggModel;

})(Backbone.Model);

module.exports = EnactedAggModel;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/models/result-model.coffee":[function(require,module,exports){
var SearchResult,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SearchResult = (function(_super) {
  __extends(SearchResult, _super);

  function SearchResult() {
    return SearchResult.__super__.constructor.apply(this, arguments);
  }

  return SearchResult;

})(Backbone.Model);

module.exports = SearchResult;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/chart-view.coffee":[function(require,module,exports){
var ChartView, sortUtil, util, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = window._;

util = require('../../helpers/graph-util.coffee');

sortUtil = require('../../helpers/sorting.coffee');

ChartView = (function(_super) {
  __extends(ChartView, _super);

  function ChartView() {
    return ChartView.__super__.constructor.apply(this, arguments);
  }

  ChartView.prototype.template = require('./chart-view.jade');

  ChartView.prototype.model = "BillModel";

  ChartView.prototype.className = 'main';

  ChartView.prototype.events = {
    'mouseover [data-amdt]': 'showAmendmentData',
    'click #oldest': 'oldestFirst',
    'click #newest': 'newestFirst',
    'click #dem-total': 'demTotal',
    'click #rep-total': 'repTotal',
    'click #dem-biased': 'demBiased',
    'click #rep-biased': 'repBiased',
    'click #least-supported': 'mostSupport',
    'click #most-supported': 'leastSupport'
  };

  ChartView.prototype.initialize = function() {};

  ChartView.defaults = function() {
    var margin;
    return margin = {
      top: 30,
      right: 10,
      bottom: 10,
      left: 10
    };
  };

  ChartView.prototype.render = function() {
    var buttonHolder, buttons, data, dems, height, makePositive, margin, max, pair, parseDate, reps, staticAxis, svg, ticks, votes, width, x, xAxis, y, _i, _len;
    votes = this.model.get('votes');
    data = votes.filter(function(ammendment) {
      if (ammendment.vote) {
        return ammendment;
      }
    });
    data = data.map(util.buildData).sort(sortUtil.order);
    parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;
    margin = {
      top: 30,
      right: 10,
      bottom: 10,
      left: 10
    };
    width = $("#chart").width() - margin.right - margin.left;
    height = data.length * 12;
    x = d3.scale.linear().range([0, width]);
    y = d3.scale.ordinal().rangeRoundBands([0, height], .2);
    makePositive = function(x) {
      return Math.abs(x);
    };
    ticks = [-250, -200, -150, -100, -50, 0, 50, 100, 150, 200, 250];
    buttons = [['oldest', 'oldest'], ['newest', 'newest'], ['dem-total', 'most dem votes'], ['rep-total', 'most rep votes'], ['dem-biased', 'most dem weighted'], ['rep-biased', 'most rep weighted'], ['least-supported', 'least supported'], ['most-supported', 'most supported']];
    buttonHolder = this.$el;
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      pair = buttons[_i];
      buttonHolder.append("<button id=" + pair[0] + ">" + pair[1] + "</button>");
    }
    xAxis = d3.svg.axis().scale(x).orient('top').tickValues(ticks).tickFormat(makePositive);
    staticAxis = d3.select('#axis').append('svg').attr('width', width + margin.left + margin.right).attr('height', '30px').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    svg = d3.select(this.el).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ')');
    dems = data.map(function(el) {
      return el.demY;
    });
    reps = data.map(function(el) {
      return el.repY;
    });
    max = Math.max(d3.max(dems), d3.max(reps));
    x.domain([-max, max]).nice();
    y.domain(data.map(function(d) {
      return d.number;
    }));
    svg.selectAll('.bar').data(data).enter().append('g').attr('class', 'amdt-bar').each(function(el, i) {
      d3.select(this).append('rect').attr('class', 'bar republican').attr('height', function(d) {
        return 10;
      }).attr('width', function(d) {
        return Math.abs((x(d.repY)) - (x(0)));
      }).attr('x', function(d) {
        return x(0);
      });
      d3.select(this).append('rect').attr('class', 'bar democrat').attr('height', function(d) {
        return 10;
      }).attr('width', function(d) {
        return Math.abs((x(d.demY)) - (x(0)));
      }).attr('x', function(d) {
        return x(-d.demY);
      });
      return d3.select(this).attr('data-amdt', function(d) {
        return d.amdt;
      }).attr('transform', 'translate(' + 0 + ',' + i * 15 + ')');
    });
    staticAxis.append('g').attr('class', 'x axis').call(xAxis);
    svg.append('g').attr('class', 'y axis').attr('transform', 'translate(0, 0)').append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y2', height);
    return this.svg = svg;
  };

  ChartView.prototype.showAmendmentData = function(e) {
    var amendmentData, amendmentId;
    amendmentId = this.$(e.currentTarget).attr('data-amdt');
    amendmentData = _.findWhere(this.model.get('votes'), {
      amendment_id: amendmentId
    });
    return this.trigger('showAmendmentData', amendmentData);
  };

  ChartView.prototype.oldestFirst = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.oldestFirst);
  };

  ChartView.prototype.newestFirst = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.newestFirst);
  };

  ChartView.prototype.demTotal = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.democratTotal);
  };

  ChartView.prototype.repTotal = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.republicanTotal);
  };

  ChartView.prototype.demBiased = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.democratDiff);
  };

  ChartView.prototype.repBiased = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.republicanDiff);
  };

  ChartView.prototype.mostSupport = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.leastSupported);
  };

  ChartView.prototype.leastSupport = function(e) {
    return sortUtil.sortBy(this.svg, sortUtil.mostSupported);
  };

  return ChartView;

})(Marionette.ItemView);

module.exports = ChartView;


},{"../../helpers/graph-util.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/graph-util.coffee","../../helpers/sorting.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/sorting.coffee","./chart-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/chart-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/chart-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div id=\"axis\"></div><div id=\"charts\"></div>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/content-layout.coffee":[function(require,module,exports){
var ContentLayout,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ContentLayout = (function(_super) {
  __extends(ContentLayout, _super);

  function ContentLayout() {
    return ContentLayout.__super__.constructor.apply(this, arguments);
  }

  ContentLayout.prototype.attributes = {
    id: 'contentLayout-layout'
  };

  ContentLayout.prototype.template = '<div class="row">' + '<div id="axis" class="col-md-8"></div>' + '<div id="chart" class="col-md-8"></div>' + '<div id="meta" class="col-md-4"></div>' + '</div>' + '</div>';

  ContentLayout.prototype.regions = {
    chart: '#chart',
    meta: '#meta'
  };

  return ContentLayout;

})(Marionette.LayoutView);

module.exports = ContentLayout;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/enacted-view.coffee":[function(require,module,exports){
var BubbleChart, EnactedView, util, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = window._;

util = require('../../helpers/graph-util.coffee');

BubbleChart = require('./../../helpers/bubble-chart.coffee');

EnactedView = (function(_super) {
  __extends(EnactedView, _super);

  function EnactedView() {
    return EnactedView.__super__.constructor.apply(this, arguments);
  }

  EnactedView.prototype.template = require('./enacted-view.jade');

  EnactedView.prototype.model = "EnactedModel";

  EnactedView.prototype.id = "bubbleChart";

  EnactedView.prototype.events = {
    'click circle': "showBillData",
    'click #combined': "combine",
    'click #byYear': 'byYear',
    'click #byParty': 'byParty',
    'mouseover [class~=bubble]': 'showDetails'
  };

  EnactedView.prototype.initialize = function() {
    return this.bills = this.model.get('bills');
  };

  EnactedView.prototype.combine = function() {
    return BubbleChart.display_all();
  };

  EnactedView.prototype.byParty = function() {
    return BubbleChart.display_party();
  };

  EnactedView.prototype.byYear = function() {
    return BubbleChart.display_year();
  };

  EnactedView.prototype.showDetails = function(e) {
    var billData, billId;
    billId = this.$(e.currentTarget).attr("data-bill");
    billData = _.findWhere(this.model.get('bills'), {
      bill_id: billId
    });
    return this.trigger("showMeta", billData);
  };

  EnactedView.prototype.showBillData = function(e) {
    var billId;
    billId = this.$(e.currentTarget).attr("data-bill");
    billId = billId.slice(-3) + '-' + billId.slice(0, -4);
    return this.trigger('showBill', billId);
  };

  EnactedView.prototype.render = function() {
    return $((function(_this) {
      return function() {
        var chart, render_vis;
        chart = null;
        render_vis = function(json) {
          chart = new BubbleChart(json);
          chart.start();
          return BubbleChart.display_all();
        };
        BubbleChart.display_all = function() {
          return chart.display_group_all();
        };
        BubbleChart.show_details = function(e) {
          return chart.show_details(e);
        };
        BubbleChart.display_year = function() {
          return chart.display_by_year();
        };
        BubbleChart.display_party = function() {
          return chart.display_by_party();
        };
        BubbleChart.transitionBill = function() {
          return chart.transitionBill();
        };
        BubbleChart.toggle_view = function(view_type) {
          if (view_type === 'year') {
            return BubbleChart.display_year();
          } else {
            return BubbleChart.display_all();
          }
        };
        return render_vis(_this.bills);
      };
    })(this));
  };

  return EnactedView;

})(Marionette.ItemView);

module.exports = EnactedView;


},{"../../helpers/graph-util.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/graph-util.coffee","./../../helpers/bubble-chart.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/helpers/bubble-chart.coffee","./enacted-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/enacted-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/enacted-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div id=\"charts\"></div>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/result-view.coffee":[function(require,module,exports){
var ResultView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ResultView = (function(_super) {
  __extends(ResultView, _super);

  function ResultView() {
    return ResultView.__super__.constructor.apply(this, arguments);
  }

  ResultView.prototype.tagName = 'li';

  ResultView.prototype.className = 'bill-result';

  ResultView.prototype.template = require('./result-view.jade');

  ResultView.prototype.events = {
    'click': 'billResult'
  };

  ResultView.prototype.billResult = function() {
    return this.trigger('bill:submit');
  };

  return ResultView;

})(Marionette.ItemView);

module.exports = ResultView;


},{"./result-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/result-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/result-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),short_title = locals_.short_title,nicknames = locals_.nicknames,sponsor = locals_.sponsor;
buf.push("<div class=\"bill-info\"><p class=\"bill-title\">Title: " + (jade.escape((jade.interp =  short_title ) == null ? '' : jade.interp)) + "</p>");
if ( nicknames)
{
buf.push("<p class=\"bill-nicknames\">Nicknames:");
// iterate nicknames
;(function(){
  var $$obj = nicknames;
  if ('number' == typeof $$obj.length) {

    for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
      var name = $$obj[i];

buf.push(" " + (jade.escape((jade.interp =  name ) == null ? '' : jade.interp)) + "");
if(i < nicknames.length-1)
{
buf.push(",");
}
    }

  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;      var name = $$obj[i];

buf.push(" " + (jade.escape((jade.interp =  name ) == null ? '' : jade.interp)) + "");
if(i < nicknames.length-1)
{
buf.push(",");
}
    }

  }
}).call(this);

buf.push("</p>");
}
buf.push("<p class=\"bill-sponsor\">Sponsor: " + (jade.escape((jade.interp =  sponsor.first_name ) == null ? '' : jade.interp)) + " " + (jade.escape((jade.interp =  sponsor.last_name ) == null ? '' : jade.interp)) + "</p></div>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/search-results-view.coffee":[function(require,module,exports){
var SearchResults,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SearchResults = (function(_super) {
  __extends(SearchResults, _super);

  function SearchResults() {
    return SearchResults.__super__.constructor.apply(this, arguments);
  }

  SearchResults.prototype.tagName = 'div';

  SearchResults.prototype.className = 'search-results';

  SearchResults.prototype.template = require('./search-results-view.jade');

  SearchResults.prototype.childView = require('./result-view.coffee');

  SearchResults.prototype.childViewContainer = '.results-container';

  SearchResults.prototype.initialize = function() {
    return this.on('childview:bill:submit', function(data) {
      var bill, billId;
      bill = data.model.get('bill_id');
      billId = bill.slice(-3) + '-' + bill.slice(0, -4);
      return this.trigger('bill:submit', billId);
    });
  };

  return SearchResults;

})(Marionette.CompositeView);

module.exports = SearchResults;


},{"./result-view.coffee":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/result-view.coffee","./search-results-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/search-results-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/content-views/search-results-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h3>Search Results</h3><ul class=\"results-container\"></ul>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-amend-info-view.coffee":[function(require,module,exports){
var AmendInfoView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AmendInfoView = (function(_super) {
  __extends(AmendInfoView, _super);

  function AmendInfoView() {
    return AmendInfoView.__super__.constructor.apply(this, arguments);
  }

  AmendInfoView.prototype.initialize = function(options) {
    var amends;
    amends = this.model.get('votes');
    return this.model.set('yesAgg', amends.reduce(function(acc, amend) {
      var vote;
      if (amend.vote) {
        vote = amend.vote;
        acc.demY += +vote.democratic.yes;
        acc.repY += +vote.republican.yes;
        acc.total += +vote.total.yes + +vote.total.no;
      }
      return acc;
    }, {
      demY: 0,
      repY: 0,
      total: 0
    }));
  };

  AmendInfoView.prototype.render = function() {
    var data;
    data = this.model.get('yesAgg');
    return $((function(_this) {
      return function() {
        var arc, demY, g, height, nonY, pie, radius, repY, svg, temp, total, width;
        width = 280;
        height = 280;
        radius = Math.min(width, height) / 2;
        temp = data;
        data = [];
        demY = temp.demY;
        repY = temp.repY;
        total = temp.total;
        nonY = temp.total - demY - repY;
        data.push({
          title: 'Democratic',
          votes: demY,
          percent: Math.round(demY / total * 100) + '%'
        });
        data.push({
          title: 'Republican',
          votes: repY,
          percent: Math.round(repY / total * 100) + '%'
        });
        data.push({
          title: 'No',
          votes: nonY,
          percent: Math.round(nonY / total * 100) + '%'
        });
        arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);
        pie = d3.layout.pie().sort(null).value(function(d) {
          return d.votes;
        });
        svg = d3.select(_this.el).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
        g.append("path").attr("d", arc).style("fill", function(d) {
          if (d.data.title === 'Democratic') {
            return 'blue';
          }
          if (d.data.title === 'Republican') {
            return 'red';
          }
          if (d.data.title === 'No') {
            return 'gray';
          }
        });
        return g.append("text").attr("class", "pie-chart-text").attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")";
        }).attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
          return d.data.percent;
        });
      };
    })(this));
  };

  return AmendInfoView;

})(Marionette.ItemView);

module.exports = AmendInfoView;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-amend-view.coffee":[function(require,module,exports){
var AmendView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AmendView = (function(_super) {
  __extends(AmendView, _super);

  function AmendView() {
    return AmendView.__super__.constructor.apply(this, arguments);
  }

  AmendView.prototype.template = require('./meta-amend-view.jade');

  return AmendView;

})(Marionette.ItemView);

module.exports = AmendView;


},{"./meta-amend-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-amend-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-amend-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),data = locals_.data;
buf.push("<p>Description: " + (jade.escape((jade.interp =  data.vote.description ) == null ? '' : jade.interp)) + "</p><p>Reason for Vote: " + (jade.escape((jade.interp =  data.vote.question ) == null ? '' : jade.interp)) + "</p><p>Vote Type: " + (jade.escape((jade.interp =  data.vote_type ) == null ? '' : jade.interp)) + "</p>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-bill-hover-view.coffee":[function(require,module,exports){
var BillHoverView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BillHoverView = (function(_super) {
  __extends(BillHoverView, _super);

  function BillHoverView() {
    return BillHoverView.__super__.constructor.apply(this, arguments);
  }

  BillHoverView.prototype.template = require('./meta-bill-hover-view.jade');

  return BillHoverView;

})(Marionette.ItemView);

module.exports = BillHoverView;


},{"./meta-bill-hover-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-bill-hover-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-bill-hover-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),data = locals_.data;
buf.push("<P>" + (jade.escape((jade.interp =  data.bill_id ) == null ? '' : jade.interp)) + "</P><P>" + (jade.escape((jade.interp =  data.official_title ) == null ? '' : jade.interp)) + "</P><P>" + (jade.escape((jade.interp =  data.enacted_as.law_type ) == null ? '' : jade.interp)) + "</P>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-enacted-agg-view.coffee":[function(require,module,exports){
var EnactedAggView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EnactedAggView = (function(_super) {
  __extends(EnactedAggView, _super);

  function EnactedAggView() {
    return EnactedAggView.__super__.constructor.apply(this, arguments);
  }

  EnactedAggView.prototype.template = require('./meta-enacted-agg-view.jade');

  return EnactedAggView;

})(Marionette.ItemView);

module.exports = EnactedAggView;


},{"./meta-enacted-agg-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-enacted-agg-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-enacted-agg-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<p>some Enacted aggregation data here</p>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-info-view.coffee":[function(require,module,exports){
var MetaInfoView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MetaInfoView = (function(_super) {
  __extends(MetaInfoView, _super);

  function MetaInfoView() {
    return MetaInfoView.__super__.constructor.apply(this, arguments);
  }

  MetaInfoView.prototype.template = '<p>Hover over the display for more information.<p>';

  return MetaInfoView;

})(Marionette.ItemView);

module.exports = MetaInfoView;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/meta-views/meta-layout.coffee":[function(require,module,exports){
var MetaLayout,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MetaLayout = (function(_super) {
  __extends(MetaLayout, _super);

  function MetaLayout() {
    return MetaLayout.__super__.constructor.apply(this, arguments);
  }

  MetaLayout.prototype.template = '<div>' + '<div id="meta-1"></div>' + '<div id="meta-2"></div>' + '<div id="meta-3"></div>' + '</div>';

  MetaLayout.prototype.regions = {
    meta1: '#meta-1',
    meta2: '#meta-2',
    meta3: '#meta-3'
  };

  return MetaLayout;

})(Marionette.LayoutView);

module.exports = MetaLayout;


},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/search-view.coffee":[function(require,module,exports){
var Search,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Search = (function(_super) {
  __extends(Search, _super);

  function Search() {
    return Search.__super__.constructor.apply(this, arguments);
  }

  Search.prototype.template = require('./search-view.jade');

  Search.prototype.className = 'search-view';

  Search.prototype.initialize = function() {};

  Search.prototype.events = {
    'click #find-bill': 'findBill',
    'click #information': 'welcomeShow',
    'click #search-bills': 'searchBills',
    'keypress #congress': 'congressSubmit',
    'keypress #bill-number': 'billSubmit',
    'keypress #find-input': 'searchSubmit'
  };

  Search.prototype.findBill = function(e) {
    e.preventDefault();
    this.trigger('findBill:submit', this.billId());
    return this.clearData();
  };

  Search.prototype.welcomeShow = function(e) {
    e.preventDefault();
    return this.trigger('welcome:show');
  };

  Search.prototype.searchBills = function(e) {
    var query;
    e.preventDefault();
    query = this.$el.find('#find-input').val();
    this.trigger('search:bills:submit', query);
    return this.clearData();
  };

  Search.prototype.congressSubmit = function(e) {
    var bill, congress;
    bill = this.$('#bill-number').val();
    congress = this.$('#congress').val();
    if (e.which === 13 && bill && congress) {
      this.trigger('findBill:submit', this.billId());
      return this.clearData();
    }
  };

  Search.prototype.billSubmit = function(e) {
    var bill, congress;
    congress = this.$('#congress').val();
    bill = this.$('#bill-number').val();
    if (e.which === 13 && congress && bill) {
      this.trigger('findBill:submit', this.billId());
      return this.clearData();
    }
  };

  Search.prototype.searchSubmit = function(e) {
    var query;
    query = this.$('#find-input').val();
    if (e.which === 13 && query) {
      this.trigger('search:bills:submit', query);
      return this.clearData();
    }
  };

  Search.prototype.billId = function() {
    return this.$('#congress').val() + '-' + this.$('#bill-number').val();
  };

  Search.prototype.clearData = function() {
    this.$('#congress').val('');
    this.$('#bill-number').val('');
    return this.$('#find-input').val('');
  };

  return Search;

})(Marionette.ItemView);

module.exports = Search;


},{"./search-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/search-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/search-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h4 class=\"search-intro\">If you know the Bill you're looking for go ahead and enter the congress and Bill numbers.  Or you can search through bills with keywords.</h4><div class=\"form-field enter-bill\"><input id=\"congress\" type=\"number\" max=\"113\" placeholder=\"Enter Congress here\"/><input id=\"bill-number\" type=\"text\" placeholder=\"Enter the bill number here! ex. hr2397\"/><button id=\"find-bill\">Show Bill</button></div><div class=\"form-field enter-search-string\"><input id=\"find-input\" type=\"text\" placeholder=\"Enter Keywords to Search Bills\"/><button id=\"search-bills\">Find Bills</button></div><p id=\"information\" class=\"info-icon\"><img src=\"/info-icon.png\"/></p>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/welcome-view.coffee":[function(require,module,exports){
var WelcomeView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WelcomeView = (function(_super) {
  __extends(WelcomeView, _super);

  function WelcomeView() {
    return WelcomeView.__super__.constructor.apply(this, arguments);
  }

  WelcomeView.prototype.template = require('./welcome-view.jade');

  WelcomeView.prototype.initialize = function() {
    return this.trigger('welcome:show');
  };

  WelcomeView.prototype.triggers = {
    'click .welcome-close': 'welcome:close'
  };

  return WelcomeView;

})(Marionette.ItemView);

module.exports = WelcomeView;


},{"./welcome-view.jade":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/welcome-view.jade"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/app/scripts/views/welcome-view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h1>Welcome to Omnibus!</h1><p>An interactive legislation visualization app that will help you understand\nwhat's acutally going on in Washington D.C! We've preloaded one of our\nfavorites.</p><p>Explore the chart and table below\nor use the search bar to search for a particular bill.</p><p class=\"welcome-close\"><img src=\"/icon_x.png\"/></p>");;return buf.join("");
};
},{"jade/runtime":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js"}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/browserify/lib/_empty.js":[function(require,module,exports){

},{}],"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/jade/runtime.js":[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str =  str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":"/Users/williamjohnson/Desktop/Omnibus/Omnibus/node_modules/browserify/lib/_empty.js"}]},{},["./app/scripts/app.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL2FwcC9zY3JpcHRzL2FwcC5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvY29sbGVjdGlvbnMvYmlsbHMtY29sbGVjdGlvbi5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvY29udHJvbGxlci5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvaGVscGVycy9idWJibGUtY2hhcnQuY29mZmVlIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL2FwcC9zY3JpcHRzL2hlbHBlcnMvZ3JhcGgtdXRpbC5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvaGVscGVycy9zb3J0aW5nLmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy9tb2RlbHMvYmlsbC1tb2RlbC5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvbW9kZWxzL2VuYWN0ZWQtbW9kZWwuY29mZmVlIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL2FwcC9zY3JpcHRzL21vZGVscy9tZXRhLWFtZW5kLWluZm8tbW9kZWwuY29mZmVlIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL2FwcC9zY3JpcHRzL21vZGVscy9tZXRhLWFtZW5kLW1vZGVsLmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy9tb2RlbHMvbWV0YS1iaWxsLWhvdmVyLW1vZGVsLmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy9tb2RlbHMvbWV0YS1lbmFjdGVkLWFnZy1tb2RlbC5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvbW9kZWxzL3Jlc3VsdC1tb2RlbC5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvY29udGVudC12aWV3cy9jaGFydC12aWV3LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9jb250ZW50LXZpZXdzL2NoYXJ0LXZpZXcuamFkZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9jb250ZW50LXZpZXdzL2NvbnRlbnQtbGF5b3V0LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9jb250ZW50LXZpZXdzL2VuYWN0ZWQtdmlldy5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvY29udGVudC12aWV3cy9lbmFjdGVkLXZpZXcuamFkZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9jb250ZW50LXZpZXdzL3Jlc3VsdC12aWV3LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9jb250ZW50LXZpZXdzL3Jlc3VsdC12aWV3LmphZGUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvY29udGVudC12aWV3cy9zZWFyY2gtcmVzdWx0cy12aWV3LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9jb250ZW50LXZpZXdzL3NlYXJjaC1yZXN1bHRzLXZpZXcuamFkZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9tZXRhLXZpZXdzL21ldGEtYW1lbmQtaW5mby12aWV3LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9tZXRhLXZpZXdzL21ldGEtYW1lbmQtdmlldy5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvbWV0YS12aWV3cy9tZXRhLWFtZW5kLXZpZXcuamFkZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9tZXRhLXZpZXdzL21ldGEtYmlsbC1ob3Zlci12aWV3LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy9tZXRhLXZpZXdzL21ldGEtYmlsbC1ob3Zlci12aWV3LmphZGUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvbWV0YS12aWV3cy9tZXRhLWVuYWN0ZWQtYWdnLXZpZXcuY29mZmVlIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL2FwcC9zY3JpcHRzL3ZpZXdzL21ldGEtdmlld3MvbWV0YS1lbmFjdGVkLWFnZy12aWV3LmphZGUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvbWV0YS12aWV3cy9tZXRhLWluZm8tdmlldy5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3MvbWV0YS12aWV3cy9tZXRhLWxheW91dC5jb2ZmZWUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3Mvc2VhcmNoLXZpZXcuY29mZmVlIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL2FwcC9zY3JpcHRzL3ZpZXdzL3NlYXJjaC12aWV3LmphZGUiLCIvVXNlcnMvd2lsbGlhbWpvaG5zb24vRGVza3RvcC9PbW5pYnVzL09tbmlidXMvYXBwL3NjcmlwdHMvdmlld3Mvd2VsY29tZS12aWV3LmNvZmZlZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9hcHAvc2NyaXB0cy92aWV3cy93ZWxjb21lLXZpZXcuamFkZSIsIi9Vc2Vycy93aWxsaWFtam9obnNvbi9EZXNrdG9wL09tbmlidXMvT21uaWJ1cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwiL1VzZXJzL3dpbGxpYW1qb2huc29uL0Rlc2t0b3AvT21uaWJ1cy9PbW5pYnVzL25vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFt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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIk1haW5Db250cm9sbGVyID0gcmVxdWlyZSAnLi9jb250cm9sbGVyLmNvZmZlZSdcblxuQXBwID0gbmV3IEJhY2tib25lLk1hcmlvbmV0dGUuQXBwbGljYXRpb24oKVxuXG5BcHAuYWRkUmVnaW9uc1xuICB3ZWxjb21lOiAnI3dlbGNvbWUnXG4gIHNlYXJjaDogJyNzZWFyY2gnXG4gIGNvbnRlbnQ6ICcjY29udGVudCdcblxuQXBwLnNwaW5uZXJPcHRpb25zID1cbiAgICByYWRpdXM6IDMwLCBsaW5lczogMjIsIGxlbmd0aDoxNiwgc3BlZWQ6IC43NVxuXG4jIEFwcC5zcGlubmVyID0gbmV3IFNwaW5uZXIgQHNwaW5uZXJPcHRpb25zXG5BcHAuc3Bpbm5lciA9IG5ldyBTcGlubmVyIEBzcGlubmVyT3B0aW9uc1xuIC5zcGluKClcblxuIyBBcHAuYWRkSW5pdGlhbGl6ZXIgKCBvcHRpb25zICkgLT5cbkFwcC5vbiAnYmVmb3JlOnN0YXJ0JywgKCBvcHRpb25zICkgLT5cbiAgQGNvbnRyb2xsZXIgPSBuZXcgTWFpbkNvbnRyb2xsZXJcbiAgICByZWdpb25zOlxuICAgICAgd2VsY29tZTogQHdlbGNvbWVcbiAgICAgIHNlYXJjaDogQHNlYXJjaFxuICAgICAgY29udGVudDogQGNvbnRlbnRcbiAgQHJvdXRlciA9IG5ldyBNYXJpb25ldHRlLkFwcFJvdXRlclxuICAgIGNvbnRyb2xsZXI6IEBjb250cm9sbGVyXG4gICAgYXBwUm91dGVzOiBcbiAgICAgICcnOiAnaG9tZSdcbiAgICAgICdiaWxscy86aWQnOiAnc2hvd0JpbGwnXG4gICAgICAnYmlsbHMvc2VhcmNoLzpxdWVyeSc6ICdzZWFyY2hSZXN1bHRzJ1xuICBAY29udHJvbGxlci5yb3V0ZXIgPSBAcm91dGVyXG5cbiAgIyBTdGFydCBiYWNrYm9uZSBoaXN0b3J5IGFmdGVyIGluaXRcbkFwcC5vbiAnc3RhcnQnLCAoIG9wdGlvbnMgKSAtPlxuICAjIHB1c2hTdGF0ZSBzZXQgdG8gdHJ1ZSB0byBlbGltaW5hdGUgJyMnXG4gIGlmIEJhY2tib25lLmhpc3RvcnkgdGhlbiBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0IHB1c2hTdGF0ZTogdHJ1ZVxuXG5cbndpbmRvdy5BcHAgPSBBcHBcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBcbiIsImNsYXNzIEJpbGxzQ29sbGVjdGlvbiBleHRlbmRzIEJhY2tib25lLkNvbGxlY3Rpb25cbiAgaW5pdGlhbGl6ZTogKCBvcHRpb25zICkgLT5cbiAgICBAdXJsID0gJ2h0dHA6Ly9vbW5pYnVzLWJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2JpbGxzL3NlYXJjaD9xPScgK1xuICAgICAgb3B0aW9ucy5xdWVyeVxuXG4gIG1vZGVsOiByZXF1aXJlICcuLi9tb2RlbHMvcmVzdWx0LW1vZGVsLmNvZmZlZSdcblxuICB1cmxSb290OiBAdXJsXG5cbiAgcGFyc2U6ICggcmVzcG9uc2UgKSAtPlxuICAgIGRhdGEgPSB7fVxuICAgIGRhdGEucmVzdWx0cyA9ICggcmVzcG9uc2UgKS5yZXN1bHRzXG4gIFxubW9kdWxlLmV4cG9ydHMgPSBCaWxsc0NvbGxlY3Rpb25cbiIsIiMgUmVxdWlyZSBWaWV3cyBhbmQgTW9kZWxzXG5XZWxjb21lVmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvd2VsY29tZS12aWV3LmNvZmZlZSdcblNlYXJjaFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3NlYXJjaC12aWV3LmNvZmZlZSdcbkNvbnRlbnRMYXlvdXQgPSByZXF1aXJlICcuL3ZpZXdzL2NvbnRlbnQtdmlld3MvY29udGVudC1sYXlvdXQuY29mZmVlJ1xuQ2hhcnRWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9jb250ZW50LXZpZXdzL2NoYXJ0LXZpZXcuY29mZmVlJ1xuU2VhcmNoUmVzdWx0cyA9IHJlcXVpcmUgJy4vdmlld3MvY29udGVudC12aWV3cy9zZWFyY2gtcmVzdWx0cy12aWV3LmNvZmZlZSdcbk1ldGFMYXlvdXQgPSByZXF1aXJlICcuL3ZpZXdzL21ldGEtdmlld3MvbWV0YS1sYXlvdXQuY29mZmVlJ1xuQmlsbE1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbHMvYmlsbC1tb2RlbC5jb2ZmZWUnXG5CaWxsc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL2NvbGxlY3Rpb25zL2JpbGxzLWNvbGxlY3Rpb24uY29mZmVlJ1xuQW1lbmRJbmZvVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvbWV0YS12aWV3cy9tZXRhLWFtZW5kLWluZm8tdmlldy5jb2ZmZWUnXG5BbWVuZEluZm9Nb2RlbCA9IHJlcXVpcmUgJy4vbW9kZWxzL21ldGEtYW1lbmQtaW5mby1tb2RlbC5jb2ZmZWUnXG5BbWVuZFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL21ldGEtdmlld3MvbWV0YS1hbWVuZC12aWV3LmNvZmZlZSdcbk1ldGFJbmZvVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvbWV0YS12aWV3cy9tZXRhLWluZm8tdmlldy5jb2ZmZWUnXG5BbWVuZE1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbHMvbWV0YS1hbWVuZC1tb2RlbC5jb2ZmZWUnXG5FbmFjdGVkVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvY29udGVudC12aWV3cy9lbmFjdGVkLXZpZXcuY29mZmVlJ1xuRW5hY3RlZE1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbHMvZW5hY3RlZC1tb2RlbC5jb2ZmZWUnXG5CaWxsSG92ZXJNb2RlbCA9IHJlcXVpcmUgJy4vbW9kZWxzL21ldGEtYmlsbC1ob3Zlci1tb2RlbC5jb2ZmZWUnXG5CaWxsSG92ZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9tZXRhLXZpZXdzL21ldGEtYmlsbC1ob3Zlci12aWV3LmNvZmZlZSdcbkVuYWN0ZWRBZ2dWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9tZXRhLXZpZXdzL21ldGEtZW5hY3RlZC1hZ2ctdmlldy5jb2ZmZWUnXG5FbmFjdGVkQWdnTW9kZWwgPSByZXF1aXJlICcuL21vZGVscy9tZXRhLWVuYWN0ZWQtYWdnLW1vZGVsLmNvZmZlZSdcblxuXG5jbGFzcyBNYWluQ29udHJvbGxlciBleHRlbmRzIE1hcmlvbmV0dGUuQ29udHJvbGxlclxuICBpbml0aWFsaXplOiAoIG9wdGlvbnMgKSAtPlxuICAgIEBzZWFyY2hWaWV3KClcblxuICAjIFRha2VzIGEgcmVnaW9uIHdoaWNoIGl0IGVtcHRpZXMgYW5kIGF0dGFjaHMgYSBsb2FkaW5nIHNwaW5uZXJcbiAgc2hvd1NwaW5uZXI6ICggcmVnaW9uICkgLT5cbiAgICByZWdpb24uZW1wdHkoKVxuICAgIHJlZ2lvbi4kZWwuYXBwZW5kIEFwcC5zcGlubmVyLmVsXG5cbiAgIyBVc2VkIHRvIGtpY2sgb2ZmIHRoZSBpbml0aWFsIHZpc3VhbGl6YXRpb24gYmVmb3JlIHVzZXIgYmlsbCBzZWxlY3Rpb25cbiAgaG9tZTogLT5cbiAgICBjb250ZW50TGF5b3V0ID0gbmV3IENvbnRlbnRMYXlvdXRcbiAgICBAb3B0aW9ucy5yZWdpb25zLmNvbnRlbnQuc2hvdyBjb250ZW50TGF5b3V0XG4gICAgJCgnI2NoYXJ0JykuYXBwZW5kIEFwcC5zcGlubmVyLmVsXG5cbiAgICBiYXNlID0gJ2h0dHA6Ly9vbW5pYnVzLWJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2NvbmdyZXNzLydcbiAgICBjb25ncmVzc09uZSA9ICQuYWpheCBiYXNlICsgJzExMS9lbmFjdGVkJ1xuICAgIGNvbmdyZXNzVHdvID0gJC5hamF4IGJhc2UgKyAnMTEyL2VuYWN0ZWQnXG4gICAgY29uZ3Jlc3NUaHJlZSA9ICQuYWpheCBiYXNlICsgJzExMy9lbmFjdGVkJ1xuXG4gICAgJC53aGVuIGNvbmdyZXNzT25lLCBjb25ncmVzc1R3bywgY29uZ3Jlc3NUaHJlZVxuICAgICAgLmRvbmUgKCBkYXRhT25lLCBkYXRhVHdvLCBkYXRhVGhyZWUgKSA9PlxuICAgICAgICBkYXRhID0gW10uY29uY2F0IGRhdGFPbmVbIDAgXSwgZGF0YVR3b1sgMCBdLCBkYXRhVGhyZWVbIDAgXVxuICAgICAgICBlbmFjdGVkTW9kZWwgPSBuZXcgRW5hY3RlZE1vZGVsIGJpbGxzOiBkYXRhXG4gICAgICAgIGVuYWN0ZWRWaWV3ID0gbmV3IEVuYWN0ZWRWaWV3IG1vZGVsOiBlbmFjdGVkTW9kZWxcbiAgICAgICAgQG9wdGlvbnMucmVnaW9ucy5jb250ZW50LmN1cnJlbnRWaWV3LmNoYXJ0LnNob3cgZW5hY3RlZFZpZXdcbiAgICAgICAgZW5hY3RlZFZpZXcucmVuZGVyKClcbiAgICAgICAgQG1ha2VFbmFjdGVkTWV0YSBlbmFjdGVkTW9kZWxcblxuXG4gIG1ha2VFbmFjdGVkTWV0YTogKCBtb2RlbCApIC0+XG4gICAgY2hhcnRWaWV3ID0gQG9wdGlvbnMucmVnaW9ucy5jb250ZW50LmN1cnJlbnRWaWV3XG4gICAgbWV0YUxheW91dCA9IG5ldyBNZXRhTGF5b3V0XG4gICAgY2hhcnRWaWV3Lm1ldGEuc2hvdyBtZXRhTGF5b3V0XG5cbiAgICBAbGlzdGVuVG8gY2hhcnRWaWV3LmNoYXJ0LmN1cnJlbnRWaWV3LCAnc2hvd0JpbGwnLCAoIGJpbGxJZCApIC0+XG4gICAgICBAcm91dGVyLm5hdmlnYXRlICdiaWxscy8nICsgYmlsbElkLCB0cmlnZ2VyOiB0cnVlXG5cbiAgICBAbGlzdGVuVG8gY2hhcnRWaWV3LmNoYXJ0LmN1cnJlbnRWaWV3LCAnc2hvd01ldGEnLCAoIGRhdGEgKSAtPlxuICAgICAgQG1ha2VCaWxsSG92ZXIgZGF0YVxuICAgICAgICAudGhlbiAoIGJpbGxWaWV3ICkgLT5cbiAgICAgICAgICBtZXRhTGF5b3V0WyAnbWV0YTEnIF0uc2hvdyBiaWxsVmlld1xuXG4gICAgQG1ha2VCaWxsSG92ZXIoKVxuICAgICAgLnRoZW4gKCBiaWxsVmlldyApIC0+XG4gICAgICAgIG1ldGFMYXlvdXRbICdtZXRhMScgXS5zaG93IGJpbGxWaWV3XG5cbiAgICBAbWFrZUVuYWN0ZWRBZ2dyZWdhdGUgbW9kZWxcbiAgICAgIC50aGVuICggbWV0YVZpZXcgKSAtPlxuICAgICAgICBtZXRhTGF5b3V0WyAnbWV0YTInIF0uc2hvdyBtZXRhVmlld1xuXG5cbiAgXG4gIG1ha2VCaWxsSG92ZXI6ICggaG92ZXJEYXRhICkgLT5cbiAgICBkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKClcbiAgICBpZiBob3ZlckRhdGFcbiAgICAgIGJpbGxIb3Zlck1vZGVsID0gbmV3IEJpbGxIb3Zlck1vZGVsIGRhdGE6IGhvdmVyRGF0YVxuICAgICAgYmlsbEhvdmVyVmlldyA9IG5ldyBCaWxsSG92ZXJWaWV3IG1vZGVsOiBiaWxsSG92ZXJNb2RlbFxuICAgIGVsc2VcbiAgICAgIGFtZW5kTW9kZWwgPSBuZXcgQW1lbmRNb2RlbFxuICAgICAgYmlsbEhvdmVyVmlldyA9IG5ldyBNZXRhSW5mb1ZpZXcgbW9kZWw6IGFtZW5kTW9kZWxcblxuICAgIGRlZmVycmVkLnJlc29sdmUgYmlsbEhvdmVyVmlld1xuICAgIGRlZmVycmVkLnByb21pc2UoKVxuXG4gIG1ha2VFbmFjdGVkQWdncmVnYXRlOiAoIG1vZGVsICkgLT5cbiAgICBkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKClcbiAgICAjIGVuYWN0ZWRBZ2dNb2RlbCA9IG5ldyBFbmFjdGVkQWdnTW9kZWwgZGF0YTogZGF0YVxuICAgIGVuYWN0ZWRBZ2dWaWV3ID0gbmV3IEVuYWN0ZWRBZ2dWaWV3IG1vZGVsOiBtb2RlbFxuICAgIGRlZmVycmVkLnJlc29sdmUgZW5hY3RlZEFnZ1ZpZXdcblxuICAgIGRlZmVycmVkLnByb21pc2UoKVxuICAgIFxuICAjIFVzZWQgdG8gc2hvdyBhIGJpbGxzIGRhdGEgd2hlbiB0aGUgYmlsbElkIGlzIGtub3duXG4gIHNob3dCaWxsOiAoIGJpbGxJZCApIC0+XG4gICAgQHNob3dTcGlubmVyIEBvcHRpb25zLnJlZ2lvbnMuY29udGVudFxuICAgIEBnZXREYXRhKCBiaWxsSWQgKS50aGVuICggYmlsbE1vZGVsICkgPT5cbiAgICAgIEBtYWtlQmlsbCBiaWxsTW9kZWwsIGJpbGxJZFxuXG4gICMgR3JhYnMgZGF0YSBmcm9tIE5ZVCB3cmFwcGVyIGZvciBhIGdpdmVuIGJpbGwgSWQgKCBjb25ncmVzcyAtIGJpbGw6ICcxMTMtaHIyMzk3JyApXG4gIGdldERhdGE6ICggYmlsbElkICktPlxuICAgIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKVxuICAgICMgQ2hlY2sgaWYgdGhlIGJpbGxJZCBpcyBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmIG5vdCB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0gYmlsbElkXG4gICAgICAjIElmIG5vdCwgY3JlYXRlIHRoZSBtb2RlbCB3aXRoIHRoZSBpZFxuICAgICAgYmlsbE1vZGVsID0gbmV3IEJpbGxNb2RlbCBpZDogYmlsbElkXG4gICAgICAjIEZldGNoIHRoZSBtb2RlbCB0byBtYWtlIGEgcmVxdWVzdCB0byBOWVQgd3JhcHBlclxuICAgICAgYmlsbE1vZGVsLmZldGNoKCkudGhlbiAoIHJlcyApIC0+XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSBiaWxsSWQsIEpTT04uc3RyaW5naWZ5IHJlc1xuICAgICAgICAjIFJlc29sdmUgdGhlIHByb21pc2Ugd2l0aCB0aGUgbW9kZWwgaW5zdGFuY2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSBiaWxsTW9kZWxcbiAgICBlbHNlXG4gICAgICAjIElmIHRoZSBiaWxsSWQgZXhpc3RzIGluIGxvY2FsIHN0b3JhZ2UsIGNyZWF0ZSBhIG5ldyBtb2RlbCB3aXRoIHRoZVxuICAgICAgIyBwYXJzZSBkYXRhIGFuZCByZXNvbHZlIHRoZSBwcm9taXNlIHdpdGggaXRcbiAgICAgIGJpbGxNb2RlbCA9IG5ldyBCaWxsTW9kZWwgdm90ZXM6IEpTT04ucGFyc2Ugd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtIGJpbGxJZFxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSBiaWxsTW9kZWxcblxuICAgIGRlZmVycmVkLnByb21pc2UoKVxuXG4gICMgUmVjcmVhdGVzIGNvbnRlbnQgYW5kIHNlYXJjaCByZWdpb25zIHdpdGggbmV3IGJpbGwgbW9kZWxcbiAgbWFrZUJpbGw6ICggYmlsbE1vZGVsLCBiaWxsSWQgKSAtPlxuICAgICMgQ2hlY2sgbG9jYWwgc3RvcmFnZSB0byBzZWUgaWYgdGhlIHVzZXIgaGFzIHZpc2l0ZWQgdGhlIHNpdGUgYmVmb3JlXG4gICAgICAjIElmIG5vdCwgc2hvdyB0aGUgd2VsY29tZSB2aWV3IGFuZCBzZXQgdGhlIHN0YXRlIHRvICd2aXNpdGVkJ1xuICAgIGlmIG5vdCB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0gJ29tbmlidXMtdmlzaXRlZCdcbiAgICAgIEB3ZWxjb21lVmlldyBiaWxsTW9kZWxcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSAnb21uaWJ1cy12aXNpdGVkJywgdHJ1ZVxuXG4gICAgY2hhcnRWaWV3ID0gbmV3IENoYXJ0VmlldyBtb2RlbDogYmlsbE1vZGVsXG4gICAgaWYgbm90IEBvcHRpb25zLnJlZ2lvbnMuY29udGVudC5jdXJyZW50Vmlld1xuICAgICAgY29udGVudExheW91dCA9IG5ldyBDb250ZW50TGF5b3V0XG4gICAgICBAb3B0aW9ucy5yZWdpb25zLmNvbnRlbnQuc2hvdyBjb250ZW50TGF5b3V0XG4gICAgQG9wdGlvbnMucmVnaW9ucy5jb250ZW50LmN1cnJlbnRWaWV3LmNoYXJ0LnNob3cgY2hhcnRWaWV3XG5cbiAgICBAbWFrZUJpbGxNZXRhIGJpbGxNb2RlbCwgYmlsbElkXG5cbiAgbWFrZUJpbGxNZXRhOiAoIG1vZGVsLCBiaWxsSWQgKSAtPlxuICAgIGNoYXJ0VmlldyA9IEBvcHRpb25zLnJlZ2lvbnMuY29udGVudC5jdXJyZW50Vmlld1xuICAgIG1ldGFMYXlvdXQgPSBuZXcgTWV0YUxheW91dFxuICAgIGNoYXJ0Vmlldy5tZXRhLnNob3cgbWV0YUxheW91dFxuXG4gICAgQGxpc3RlblRvIGNoYXJ0Vmlldy5jaGFydC5jdXJyZW50VmlldywgJ3Nob3dBbWVuZG1lbnREYXRhJywgKGRhdGEpIC0+XG4gICAgICBAbWFrZUFtZW5kSG92ZXIgZGF0YVxuICAgICAgICAudGhlbiAoIGFtZW5kVmlldyApIC0+XG4gICAgICAgICAgbWV0YUxheW91dFsgJ21ldGExJyBdLnNob3cgYW1lbmRWaWV3XG5cbiAgICBAbWFrZUFtZW5kSG92ZXIoKVxuICAgICAgLnRoZW4gKCBhbWVuZFZpZXcgKSAtPlxuICAgICAgICBtZXRhTGF5b3V0WyAnbWV0YTEnIF0uc2hvdyBhbWVuZFZpZXdcblxuICAgIEBtYWtlQW1lbmRBZ2dyZWdhdGUgbW9kZWwsIGJpbGxJZFxuICAgICAgLnRoZW4gKCBtZXRhVmlldyApIC0+XG4gICAgICAgIG1ldGFMYXlvdXRbICdtZXRhMicgXS5zaG93IG1ldGFWaWV3XG4gICAgICAgICMgbWV0YVZpZXcucmVuZGVyKClcblxuICAjIFBhc3MgYW1tZW5kbWVudCBkYXRhIGluIGFuZCBjcmVhdGUgYSBtb2RlbC92aWV3IHdpdGggaXRcbiAgIyBSZXR1cm5zIGpRdWVyeSBwcm9taXNlIGZvciBjb25zaXN0ZW5jeVxuICBtYWtlQW1lbmRIb3ZlcjogKCBhbWVuZERhdGEgKSAtPlxuICAgIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKVxuICAgIGlmIGFtZW5kRGF0YVxuICAgICAgYW1lbmRNb2RlbCA9IG5ldyBBbWVuZE1vZGVsIGRhdGE6IGFtZW5kRGF0YVxuICAgICAgYW1lbmRWaWV3ID0gbmV3IEFtZW5kVmlldyBtb2RlbDogYW1lbmRNb2RlbFxuICAgIGVsc2VcbiAgICAgIGFtZW5kTW9kZWwgPSBuZXcgQW1lbmRNb2RlbFxuICAgICAgYW1lbmRWaWV3ID0gbmV3IE1ldGFJbmZvVmlldyBtb2RlbDogYW1lbmRNb2RlbFxuXG4gICAgZGVmZXJyZWQucmVzb2x2ZSBhbWVuZFZpZXdcbiAgICBkZWZlcnJlZC5wcm9taXNlKClcblxuICBtYWtlQW1lbmRBZ2dyZWdhdGU6ICggbW9kZWwsIGJpbGxJZCApIC0+XG4gICAgZGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpXG4gICAgYW1lbmRJbmZvVmlldyA9IG5ldyBBbWVuZEluZm9WaWV3IG1vZGVsOiBtb2RlbFxuICAgICMgYW1lbmRJbmZvVmlldy5yZW5kZXIoKVxuICAgIGRlZmVycmVkLnJlc29sdmUgYW1lbmRJbmZvVmlldyAgICBcblxuICAgIGRlZmVycmVkLnByb21pc2UoKVxuXG5cbiAgIyBEaXNwbGF5cyB0aGUgd2VsY29tZSB2aWV3IHRvIG5ldyB1c2Vyc1xuICB3ZWxjb21lVmlldzogKCBiaWxsTW9kZWwgKSAtPlxuICAgICMgQ3JlYXRlIHRoZSB3ZWxjb21lIHZpZXcgd2l0aCB0aGUgYmlsbE1vZGVsIChiaWxsTW9kZWwgbm90IGN1cnJlbnRseSB1c2VkKVxuICAgIHdlbGNvbWVWaWV3ID0gbmV3IFdlbGNvbWVWaWV3IG1vZGVsOiBiaWxsTW9kZWxcbiAgICAjIEhpZGUgdGhlIGluZm9ybWF0aW9uIGJ1dHRvbiBvbiBzZWFyY2ggdmlld1xuICAgICQoJyNpbmZvcm1hdGlvbicpLmhpZGUoKVxuXG4gICAgIyBFbXB0eSB0aGUgcmVnaW9uIHdoZW4gdGhlIHVzZXIgY2xvc2VzIGl0XG4gICAgQGxpc3RlblRvIHdlbGNvbWVWaWV3LCAnd2VsY29tZTpjbG9zZScsIC0+XG4gICAgICBAb3B0aW9ucy5yZWdpb25zLndlbGNvbWUuZW1wdHkoKVxuICAgICAgIyBTaG93IHRoZSBpbmZvcm1hdGlvbiBidXR0b24gaW4gdGhlIHNlYXJjaCB2aWV3XG4gICAgICAkKCcjaW5mb3JtYXRpb24nKS5zaG93KClcblxuICAgICMgU2hvdyB0aGUgd2VsY29tZSB2ZXcgaW4gdGhlIHdlbGNvbWUgcmVnaW9uXG4gICAgQG9wdGlvbnMucmVnaW9ucy53ZWxjb21lLnNob3cgd2VsY29tZVZpZXdcblxuICAjIEluaXRpYXRlcyB0aGUgU2VhcmNoIHZpZXcgYW5kXG4gIHNlYXJjaFZpZXc6ICggKSAtPlxuXG4gICAgc2VhcmNoVmlldyA9IG5ldyBTZWFyY2hWaWV3XG5cbiAgICAjIExpc3RlbiB0byBzdWJtaXQgZXZlbnQgb24ga25vd24gYmlsbCBudW1iZXJcbiAgICBAbGlzdGVuVG8gc2VhcmNoVmlldywgJ2ZpbmRCaWxsOnN1Ym1pdCcsICggYmlsbElkICkgLT5cbiAgICAgIEByb3V0ZXIubmF2aWdhdGUgJ2JpbGxzLycgKyBiaWxsSWQsIHRyaWdnZXI6IHRydWVcblxuICAgICMgTGlzdGVuIHRvIHNob3cgV2VsY29tZSB2aWV3IGV2ZW50IG9uIGluZm8gYnV0dG9uIGNsaWNrXG4gICAgQGxpc3RlblRvIHNlYXJjaFZpZXcsICd3ZWxjb21lOnNob3cnLCAtPlxuICAgICAgQHdlbGNvbWVWaWV3IHNlYXJjaFZpZXcubW9kZWxcblxuICAgICMgTGlzdGVuIHRvIHNlYXJjaCBiaWxscyBzdWJtaXQgZXZlbnRcbiAgICBAbGlzdGVuVG8gc2VhcmNoVmlldywgJ3NlYXJjaDpiaWxsczpzdWJtaXQnLCAoIHF1ZXJ5ICkgLT5cbiAgICAgIEByb3V0ZXIubmF2aWdhdGUgJ2JpbGxzL3NlYXJjaC8nICsgcXVlcnksIHRyaWdnZXI6IHRydWVcblxuICAgICMgU2hvdyB0aGUgc2VhcmNoIHZpZXcgaW4gdGhlIHNlYXJjaCByZWdpb25cbiAgICBAb3B0aW9ucy5yZWdpb25zLnNlYXJjaC5zaG93IHNlYXJjaFZpZXdcblxuICAjIFNlYXJjaCBmb3IgYmlsbHMgbWF0Y2hpbmcgdGhlIHF1ZXJ5IGFuZCBkaXNwbGF5IHJlc3VsdHNcbiAgc2VhcmNoUmVzdWx0czogKCBxdWVyeSApIC0+XG4gICAgIyBTdGFydCB0aGUgc3Bpbm5lciBpbiB0aGUgY29udGVudCByZWdpb25cbiAgICBAc2hvd1NwaW5uZXIgQG9wdGlvbnMucmVnaW9ucy5jb250ZW50XG5cbiAgICBiaWxsc0NvbGxlY3Rpb24gPSBuZXcgQmlsbHNDb2xsZWN0aW9uIHF1ZXJ5OiBxdWVyeVxuICAgIGJpbGxzQ29sbGVjdGlvbi5mZXRjaCgpLnRoZW4gPT5cbiAgICAgIHNlYXJjaFJlc3VsdHMgPSBuZXcgU2VhcmNoUmVzdWx0cyBjb2xsZWN0aW9uOiBiaWxsc0NvbGxlY3Rpb25cblxuICAgICAgQGxpc3RlblRvIHNlYXJjaFJlc3VsdHMsICdiaWxsOnN1Ym1pdCcsICggYmlsbElkICkgLT5cbiAgICAgICAgQHJvdXRlci5uYXZpZ2F0ZSAnYmlsbHMvJyArIGJpbGxJZCwgeyB0cmlnZ2VyOiB0cnVlIH1cblxuICAgICAgQG9wdGlvbnMucmVnaW9ucy5jb250ZW50LnNob3cgc2VhcmNoUmVzdWx0c1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbkNvbnRyb2xsZXJcbiIsImNsYXNzIEJ1YmJsZUNoYXJ0XG4gIGNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IGRhdGFcbiAgICBAd2lkdGggPSAkKFwiI2NoYXJ0XCIpLndpZHRoKClcbiAgICBAaGVpZ2h0ID0gJChcIiNjaGFydFwiKS5oZWlnaHQoKVxuXG4gICAgZDMuc2VsZWN0aW9uOjptb3ZlVG9Gcm9udCA9IC0+XG4gICAgICBAZWFjaCAtPlxuICAgICAgICBAcGFyZW50Tm9kZS5hcHBlbmRDaGlsZCB0aGlzXG4gICAgICAgIHJldHVyblxuXG4gICAjY3JlYXRlIGJ1dHRvbnMgYW5kIGFwcGVuZFxuICAgIGJ1dHRvbnMgPSBbXG4gICAgICBbJ2NvbWJpbmVkJywgJ0FsbCBCaWxscyddLFxuICAgICAgWydieVllYXInLCAnQnkgQ29uZ3Jlc3MnXSxcbiAgICAgIFsnYnlQYXJ0eScsICdCeSBQYXJ0eSddXG4gICAgXVxuXG4gICAgYnV0dG9uSG9sZGVyID0gJChcIiNidWJibGVDaGFydFwiKVxuICAgIGZvciBwYWlyIGluIGJ1dHRvbnNcbiAgICAgIGJ1dHRvbkhvbGRlci5hcHBlbmQoXCI8YnV0dG9uIGlkPSN7cGFpclswXX0+I3twYWlyWzFdfTwvYnV0dG9uPlwiKVxuXG4gICAgIyBsb2NhdGlvbnMgdGhlIG5vZGVzIHdpbGwgbW92ZSB0b3dhcmRzXG4gICAgIyBkZXBlbmRpbmcgb24gd2hpY2ggdmlldyBpcyBjdXJyZW50bHkgYmVpbmdcbiAgICAjIHVzZWRcbiAgICBAY2VudGVyID0ge3g6IEB3aWR0aCAvIDIsIHk6IEBoZWlnaHQgLyAyfVxuICAgIEB5ZWFyX2NlbnRlcnMgPSB7XG4gICAgICBcIjExMVwiOiB7eDogQHdpZHRoIC8gMywgeTogQGhlaWdodCAvIDJ9LFxuICAgICAgXCIxMTJcIjoge3g6IEB3aWR0aCAvIDIsIHk6IEBoZWlnaHQgLyAyfSxcbiAgICAgIFwiMTEzXCI6IHt4OiAyLjMgKiBAd2lkdGggLyAzLCB5OiBAaGVpZ2h0IC8gMn1cbiAgICB9XG4gICAgQHBhcnR5X2NlbnRlcnMgPSB7XG4gICAgICBcIlJlcHVibGljYW5cIjoge3g6IEB3aWR0aCAvIDMsIHk6IEBoZWlnaHQgLyAyfSxcbiAgICAgIFwiU3BsaXRcIjoge3g6IEB3aWR0aCAvIDIsIHk6IEBoZWlnaHQgLyAyfSxcbiAgICAgIFwiRGVtb2NyYXRcIjoge3g6IDIuMyAqIEB3aWR0aCAvIDMsIHk6IEBoZWlnaHQgLyAyfVxuICAgIH1cblxuICAgICMgdXNlZCB3aGVuIHNldHRpbmcgdXAgZm9yY2UgYW5kXG4gICAgIyBtb3ZpbmcgYXJvdW5kIG5vZGVzXG4gICAgQGxheW91dF9ncmF2aXR5ID0gLTAuMDFcbiAgICBAZGFtcGVyID0gMC4xXG5cbiAgICAjIHRoZXNlIHdpbGwgYmUgc2V0IGluIGNyZWF0ZV9ub2RlcyBhbmQgY3JlYXRlX3Zpc1xuICAgIEB2aXMgPSBudWxsXG4gICAgQG5vZGVzID0gW11cbiAgICBAZm9yY2UgPSBudWxsXG4gICAgQGNpcmNsZXMgPSBudWxsXG5cbiAgICAjIG5pY2UgbG9va2luZyBjb2xvcnMgLSBubyByZWFzb24gdG8gYnVjayB0aGUgdHJlbmRcbiAgICBAZmlsbF9jb2xvciA9IGQzLnNjYWxlLm9yZGluYWwoKVxuICAgICAgLmRvbWFpbihbXCJsb3dcIiwgXCJtZWRpdW1cIiwgXCJoaWdoXCJdKVxuICAgICAgLnJhbmdlKFtcIiNkODRiMmFcIiwgXCIjYmVjY2FlXCIsIFwiIzdhYTI1Y1wiXSlcblxuICAgICMgdXNlIHRoZSBtYXggdG90YWxfYW1vdW50IGluIHRoZSBkYXRhIGFzIHRoZSBtYXggaW4gdGhlIHNjYWxlJ3MgZG9tYWluXG4gICAgbWF4X2Ftb3VudCA9IGQzLm1heChAZGF0YSwgKGQpIC0+IHBhcnNlSW50KGQubGFzdF92ZXJzaW9uLnBhZ2VzKSlcbiAgICBAcmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgNDVdKVxuXG4gICMgY3JlYXRlIG5vZGUgb2JqZWN0cyBmcm9tIG9yaWdpbmFsIGRhdGFcbiAgIyB0aGF0IHdpbGwgc2VydmUgYXMgdGhlIGRhdGEgYmVoaW5kIGVhY2hcbiAgIyBidWJibGUgaW4gdGhlIHZpcywgdGhlbiBhZGQgZWFjaCBub2RlXG4gICMgdG8gQG5vZGVzIHRvIGJlIHVzZWQgbGF0ZXJcbiAgICB0aGlzLmNyZWF0ZV9ub2RlcygpXG4gICAgdGhpcy5jcmVhdGVfdmlzKClcblxuICBjcmVhdGVfbm9kZXM6ICgpID0+XG4gICAgQGRhdGEuZm9yRWFjaCAoZCwgaSkgPT5cbiAgICAgIG5vZGUgPSB7XG4gICAgICAgIGlkOiBkLmJpbGxfaWRcbiAgICAgICAgcmFkaXVzOiBAcmFkaXVzX3NjYWxlKHBhcnNlSW50KGQubGFzdF92ZXJzaW9uLnBhZ2VzKSlcbiAgICAgICAgdmFsdWU6IGQubGFzdF92ZXJzaW9uLnBhZ2VzXG4gICAgICAgIG5hbWU6IGQuc2hvcnRfdGl0bGVcbiAgICAgICAgZGVzY3JpcHRpb246IGQub2ZmaWNpYWxfdGl0bGVcbiAgICAgICAgc3BvbnNvcjogaWYgZC5zcG9uc29yIHRoZW4gZC5zcG9uc29yLnRpdGxlICsgXCIgXCIgKyBkLnNwb25zb3IuZmlyc3RfbmFtZSArIFwiIFwiICsgZC5zcG9uc29yLmxhc3RfbmFtZSBlbHNlIG51bGxcbiAgICAgICAgc3BvbnNvcklkOiBkLnNwb25zb3JfaWRcbiAgICAgICAgY29tbWl0dGVlOiBkLmNvbW1pdHRlZV9pZHNcbiAgICAgICAgaW50cm9kdWNlZDogZC5pbnRyb2R1Y2VkX29uXG4gICAgICAgICMgcGFydHk6IGQucGFydHlcbiAgICAgICAgY29uZ3Jlc3M6IGQuY29uZ3Jlc3NcbiAgICAgICAgZXhpdGVkOiBkLmxhc3RfYWN0aW9uX2F0XG4gICAgICAgIHg6IE1hdGgucmFuZG9tKCkgKiA5MDBcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSAqIDgwMCBcbiAgICAgIH1cbiAgICAgIEBub2Rlcy5wdXNoIG5vZGVcblxuICAgIEBub2Rlcy5zb3J0IChhLGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG5cblxuXG4gICMgY3JlYXRlIHN2ZyBhdCAjdmlzIGFuZCB0aGVuIFxuICAjIGNyZWF0ZSBjaXJjbGUgcmVwcmVzZW50YXRpb24gZm9yIGVhY2ggbm9kZVxuICBjcmVhdGVfdmlzOiAoKSA9PlxuICAgIEB2aXMgPSBkMy5zZWxlY3QoXCIjYnViYmxlQ2hhcnRcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIEB3aWR0aClcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIEBoZWlnaHQpXG4gICAgICAuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKVxuXG4gICAgQGNpcmNsZXMgPSBAdmlzLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgLmRhdGEoQG5vZGVzLCAoZCkgLT4gZC5pZClcblxuICAgICMgdXNlZCBiZWNhdXNlIHdlIG5lZWQgJ3RoaXMnIGluIHRoZSBcbiAgICAjIG1vdXNlIGNhbGxiYWNrc1xuICAgIHRoYXQgPSB0aGlzXG5cblxuICAgICMgcmFkaXVzIHdpbGwgYmUgc2V0IHRvIDAgaW5pdGlhbGx5LlxuICAgICMgc2VlIHRyYW5zaXRpb24gYmVsb3dcblxuICAgIEBjaXJjbGVzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAuYXR0cihcInJcIiwgMClcbiAgICAgIC5hdHRyKFwiY2xhc3NcIixcImJ1YmJsZVwiKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIChkKSA9PiBAZmlsbF9jb2xvcihkLmdyb3VwKSlcbiAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuNSlcbiAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIChkKSA9PiBkMy5yZ2IoQGZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpKVxuICAgICAgLmF0dHIoXCJkYXRhLWJpbGxcIiwgKGQpIC0+IFwiI3tkLmlkfVwiKVxuICAgICAgLm9uKFwibW91c2VvdmVyXCIsIChkLGkpIC0+IHRoYXQuc2hvd19kZXRhaWxzKGQsaSx0aGlzKSlcbiAgICAgIC5vbihcIm1vdXNlb3V0XCIsIChkLGkpIC0+IHRoYXQuaGlkZV9kZXRhaWxzKGQsaSx0aGlzKSlcblxuICAgICMgRmFuY3kgdHJhbnNpdGlvbiB0byBtYWtlIGJ1YmJsZXMgYXBwZWFyLCBlbmRpbmcgd2l0aCB0aGVcbiAgICAjIGNvcnJlY3QgcmFkaXVzXG4gICAgQGNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMDApLmF0dHIoXCJyXCIsIChkKSAtPiBcbiAgICAgIGQucmFkaXVzKVxuXG5cblxuICAjIENoYXJnZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBmb3IgZWFjaCBub2RlLlxuICAjIENoYXJnZSBpcyBwcm9wb3J0aW9uYWwgdG8gdGhlIGRpYW1ldGVyIG9mIHRoZVxuICAjIGNpcmNsZSAod2hpY2ggaXMgc3RvcmVkIGluIHRoZSByYWRpdXMgYXR0cmlidXRlXG4gICMgb2YgdGhlIGNpcmNsZSdzIGFzc29jaWF0ZWQgZGF0YS5cbiAgIyBUaGlzIGlzIGRvbmUgdG8gYWxsb3cgZm9yIGFjY3VyYXRlIGNvbGxpc2lvbiBcbiAgIyBkZXRlY3Rpb24gd2l0aCBub2RlcyBvZiBkaWZmZXJlbnQgc2l6ZXMuXG4gICMgQ2hhcmdlIGlzIG5lZ2F0aXZlIGJlY2F1c2Ugd2Ugd2FudCBub2RlcyB0byBcbiAgIyByZXBlbC5cbiAgIyBEaXZpZGluZyBieSA4IHNjYWxlcyBkb3duIHRoZSBjaGFyZ2UgdG8gYmVcbiAgIyBhcHByb3ByaWF0ZSBmb3IgdGhlIHZpc3VhbGl6YXRpb24gZGltZW5zaW9ucy5cbiAgY2hhcmdlOiAoZCkgLT5cbiAgICBkLnJhZGl1cyAqIGQucmFkaXVzIC8gLSA4LjdcblxuXG4gICMgU3RhcnRzIHVwIHRoZSBmb3JjZSBsYXlvdXQgd2l0aFxuICAjIHRoZSBkZWZhdWx0IHZhbHVlc1xuICBzdGFydDogKCkgPT5cbiAgICBAZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKVxuICAgICAgLm5vZGVzKEBub2RlcylcbiAgICAgIC5zaXplKFtAd2lkdGgsIEBoZWlnaHRdKVxuXG4gICMgU2V0cyB1cCBmb3JjZSBsYXlvdXQgdG8gZGlzcGxheVxuICAjIGFsbCBub2RlcyBpbiBvbmUgY2lyY2xlLlxuICBkaXNwbGF5X2dyb3VwX2FsbDogKCkgPT5cbiAgICBAZm9yY2UuZ3Jhdml0eShAbGF5b3V0X2dyYXZpdHkpXG4gICAgICAuY2hhcmdlKHRoaXMuY2hhcmdlKVxuICAgICAgLmZyaWN0aW9uKC45KVxuICAgICAgLm9uIFwidGlja1wiLCAoZSkgPT5cbiAgICAgICAgQGNpcmNsZXMuZWFjaCh0aGlzLm1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpXG4gICAgICAgICAgLmF0dHIoXCJjeFwiLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKFwiY3lcIiwgKGQpIC0+IGQueSlcbiAgICBAZm9yY2Uuc3RhcnQoKVxuXG4gICAgdGhpcy5oaWRlX3llYXJzKClcblxuICAjIE1vdmVzIGFsbCBjaXJjbGVzIHRvd2FyZHMgdGhlIEBjZW50ZXJcbiAgIyBvZiB0aGUgdmlzdWFsaXphdGlvblxuICBtb3ZlX3Rvd2FyZHNfY2VudGVyOiAoYWxwaGEpID0+XG4gICAgKGQpID0+XG4gICAgICBkLnggPSBkLnggKyAoQGNlbnRlci54IC0gZC54KSAqIChAZGFtcGVyICsgMC4wMjUpICogYWxwaGFcbiAgICAgIGQueSA9IGQueSArIChAY2VudGVyLnkgLSBkLnkpICogKEBkYW1wZXIgKyAwLjAyNSkgKiBhbHBoYVxuXG4gICMgc2V0cyB0aGUgZGlzcGxheSBvZiBidWJibGVzIHRvIGJlIHNlcGFyYXRlZFxuICAjIGludG8gZWFjaCB5ZWFyLiBEb2VzIHRoaXMgYnkgY2FsbGluZyBtb3ZlX3Rvd2FyZHNfeWVhclxuICBkaXNwbGF5X2J5X3llYXI6ICgpID0+XG4gICAgQGZvcmNlLmdyYXZpdHkoQGxheW91dF9ncmF2aXR5KVxuICAgICAgLmNoYXJnZSh0aGlzLmNoYXJnZSlcbiAgICAgIC5mcmljdGlvbigwLjkpXG4gICAgICAub24gXCJ0aWNrXCIsIChlKSA9PlxuICAgICAgICBAY2lyY2xlcy5lYWNoKHRoaXMubW92ZV90b3dhcmRzX3llYXIoZS5hbHBoYSkpXG4gICAgICAgICAgLmF0dHIoXCJjeFwiLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKFwiY3lcIiwgKGQpIC0+IGQueSlcbiAgICBAZm9yY2Uuc3RhcnQoKVxuXG4gICAgdGhpcy5kaXNwbGF5X3llYXJzKClcblxuICBkaXNwbGF5X2J5X3BhcnR5OiAoKSA9PlxuICAgIEBmb3JjZS5ncmF2aXR5KEBsYXlvdXRfZ3Jhdml0eSlcbiAgICAgIC5jaGFyZ2UodGhpcy5jaGFyZ2UpXG4gICAgICAuZnJpY3Rpb24oMC44KVxuICAgICAgLm9uIFwidGlja1wiLCAoZSkgPT5cbiAgICAgICAgQGNpcmNsZXMuZWFjaCh0aGlzLm1vdmVfdG93YXJkc19wYXJ0eShlLmFscGhhKSlcbiAgICAgICAgICAuYXR0cihcImN4XCIsIChkKSAtPiBkLngpXG4gICAgICAgICAgLmF0dHIoXCJjeVwiLCAoZCkgLT4gZC55KVxuICAgIEBmb3JjZS5zdGFydCgpXG5cbiAgICB0aGlzLmRpc3BsYXlfcGFydHlzKClcblxuICAjIG1vdmUgYWxsIGNpcmNsZXMgdG8gdGhlaXIgYXNzb2NpYXRlZCBAeWVhcl9jZW50ZXJzIFxuICBtb3ZlX3Rvd2FyZHNfeWVhcjogKGFscGhhKSA9PlxuICAgIChkKSA9PlxuICAgICAgdGFyZ2V0ID0gQHllYXJfY2VudGVyc1tkLmNvbmdyZXNzXVxuICAgICAgZC54ID0gZC54ICsgKHRhcmdldC54IC0gZC54KSAqIChAZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMVxuICAgICAgZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqIChAZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMVxuXG4gIG1vdmVfdG93YXJkc19wYXJ0eTogKGFscGhhKSA9PlxuICAgIChkKSA9PlxuICAgICAgdGFyZ2V0ID0gQHBhcnR5X2NlbnRlcnNbZC5wYXJ0eV1cbiAgICAgIGQueCA9IGQueCArICh0YXJnZXQueCAtIGQueCkgKiAoQGRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjFcbiAgICAgIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAoQGRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjFcblxuICAjIE1ldGhvZCB0byBkaXNwbGF5IHllYXIgdGl0bGVzXG4gIGRpc3BsYXlfeWVhcnM6ICgpID0+XG4gICAgeWVhcnNfeCA9IHtcIjExMVwiOiAxNjAsIFwiMTEyXCI6IEB3aWR0aCAvIDIsIFwiMTEzXCI6IEB3aWR0aCAtIDE2MH1cbiAgICB5ZWFyc19kYXRhID0gZDMua2V5cyh5ZWFyc194KVxuICAgIHllYXJzID0gQHZpcy5zZWxlY3RBbGwoXCIueWVhcnNcIilcbiAgICAgIC5kYXRhKHllYXJzX2RhdGEpXG5cbiAgICB5ZWFycy5lbnRlcigpLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ5ZWFyc1wiKVxuICAgICAgLmF0dHIoXCJ4XCIsIChkKSA9PiB5ZWFyc194W2RdIClcbiAgICAgIC5hdHRyKFwieVwiLCA0MClcbiAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgIC50ZXh0KChkKSAtPiBkKVxuXG4gIGRpc3BsYXlfcGFydHlzOiAoKSA9PlxuICAgIHBhcnR5c194ID0ge1wiUmVwdWJsaWNhblwiOiAxNjAsIFwiU3BsaXRcIjogQHdpZHRoIC8gMiwgXCJEZW1vY3JhdFwiOiBAd2lkdGggLSAxNjB9XG4gICAgcGFydHlzX2RhdGEgPSBkMy5rZXlzKHBhcnR5c194KVxuICAgIHBhcnR5cyA9IEB2aXMuc2VsZWN0QWxsKFwiLnBhcnR5c1wiKVxuICAgICAgLmRhdGEocGFydHlzX2RhdGEpXG5cbiAgICB5ZWFycy5lbnRlcigpLmFwcGVuZChcInRleHRcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwYXJ0eXNcIilcbiAgICAgIC5hdHRyKFwieFwiLCAoZCkgPT4gcGFydHlzX3hbZF0gKVxuICAgICAgLmF0dHIoXCJ5XCIsIDQwKVxuICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgLnRleHQoKGQpIC0+IGQpXG5cbiAgIyBNZXRob2QgdG8gaGlkZSB5ZWFyIHRpdGxlc1xuICBoaWRlX3llYXJzOiAoKSA9PlxuICAgIHllYXJzID0gQHZpcy5zZWxlY3RBbGwoXCIueWVhcnNcIikucmVtb3ZlKClcblxuICAjaGlnaGxpZ2h0IG1vdXNlZCBiaWxsXG4gIHNob3dfZGV0YWlsczogKGRhdGEsIGksIGVsZW1lbnQpID0+XG4gICAgc2VsID0gZDMuc2VsZWN0KGVsZW1lbnQpXG4gICAgc2VsLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKVxuICAgIHNlbC5tb3ZlVG9Gcm9udCgpXG5cbiAgaGlkZV9kZXRhaWxzOiAoZGF0YSwgaSwgZWxlbWVudCkgPT5cbiAgICBkMy5zZWxlY3QoZWxlbWVudCkuYXR0cihcInN0cm9rZVwiLCAoZCkgPT4gZDMucmdiKEBmaWxsX2NvbG9yKGQuZ3JvdXApKS5kYXJrZXIoKSlcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQnViYmxlQ2hhcnQiLCJidWlsZERhdGEgPSAoanNvbiwgaSkgLT5cbiAgdGVtcCA9IHt9XG4gIHRlbXAubnVtYmVyID0ganNvbi5udW1iZXJcbiAgdGVtcC5yZXBZID0gK2pzb24udm90ZS5yZXB1YmxpY2FuLnllc1xuICB0ZW1wLnJlcE4gPSAranNvbi52b3RlLnJlcHVibGljYW4ubm9cbiAgdGVtcC5yZXBBYnMgPSAranNvbi52b3RlLnJlcHVibGljYW4ubm90X3ZvdGluZ1xuICB0ZW1wLmRlbVkgPSAranNvbi52b3RlLmRlbW9jcmF0aWMueWVzXG4gIHRlbXAuZGVtTiA9ICtqc29uLnZvdGUuZGVtb2NyYXRpYy5ub1xuICB0ZW1wLmRlbUFicyA9ICtqc29uLnZvdGUuZGVtb2NyYXRpYy5ub3Rfdm90aW5nXG4gIHRlbXAuYW1kdCA9IGpzb24uYW1lbmRtZW50X2lkXG4gIHRlbXAuYmlsbCA9IGpzb24uYmlsbF9pZFxuICB0ZW1wXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYnVpbGREYXRhOiBidWlsZERhdGFcbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgXG4gIGxlYXN0U3VwcG9ydGVkOiAoYSwgYikgLT5cbiAgICAoYi5kZW1ZICsgYi5yZXBZKSAtIChhLmRlbVkgKyBhLnJlcFkpXG5cbiAgbW9zdFN1cHBvcnRlZDogKGEsIGIpIC0+XG4gICAgKGEuZGVtWSArIGEucmVwWSkgLSAoYi5kZW1ZICsgYi5yZXBZKVxuICBcbiAgZGVtb2NyYXRUb3RhbDogKGEsIGIpIC0+XG4gICAgYi5kZW1ZIC0gYS5kZW1ZXG4gIFxuICByZXB1YmxpY2FuVG90YWw6IChhLCBiKSAtPlxuICAgIGIucmVwWSAtIGEucmVwWVxuICBcbiAgZGVtb2NyYXREaWZmOiAoYSwgYikgLT5cbiAgICAoYi5kZW1ZIC8gYi5yZXBZKSAtIChhLmRlbVkgLyBhLnJlcFkpXG4gIFxuICByZXB1YmxpY2FuRGlmZjogKGEsIGIpIC0+XG4gICAgKGIucmVwWSAvIGIuZGVtWSkgLSAoYS5yZXBZIC8gYS5kZW1ZKVxuICBcbiAgbmV3ZXN0Rmlyc3Q6IChhLCBiKSAtPlxuICAgIGEubnVtYmVyIC0gYi5udW1iZXJcbiAgXG4gIG9sZGVzdEZpcnN0OiAoYSwgYikgLT5cbiAgICBiLm51bWJlciAtIGEubnVtYmVyXG5cblxuICBzb3J0Qnk6IChpdGVtLCBzb3J0RnVuYykgLT5cbiAgICBpdGVtXG4gICAgICAuc2VsZWN0QWxsICdnLmFtZHQtYmFyJ1xuICAgICAgLnNvcnQgc29ydEZ1bmNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSAyMDBcbiAgICAgIC5kdXJhdGlvbiA1MDBcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAoZCwgaSkgLT5cbiAgICAgICAgJ3RyYW5zbGF0ZSgnICsgMCArICcsJyArIGkgKiAxNSArICcpJ1xuIiwiY2xhc3MgQmlsbE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWxcbiAgaW5pdGlhbGl6ZTogKCBvcHRpb25zICkgLT5cbiAgICBAdXJsID0gJ2h0dHA6Ly9vbW5pYnVzLWJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2JpbGxzLycgK1xuICAgICAgb3B0aW9ucy5pZCArICcvdm90ZXMnXG5cbiAgdXJsUm9vdDogQHVybFxuXG5cbiAgcGFyc2U6ICggcmVzcG9uc2UgKSAtPlxuICAgIGRhdGEgPSB7fVxuICAgIGRhdGEudm90ZXMgPSByZXNwb25zZVxuICAgIGRhdGFcblxubW9kdWxlLmV4cG9ydHMgPSBCaWxsTW9kZWxcbiIsImNsYXNzIEVuYWN0ZWRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsXG4gIGluaXRpYWxpemU6ICggb3B0aW9ucyApIC0+XG5cbiAgcGFyc2U6ICggcmVzcG9uc2UgKSAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IEVuYWN0ZWRNb2RlbFxuIiwiY2xhc3MgQW1lbmRJbmZvIGV4dGVuZHMgQmFja2JvbmUuTW9kZWxcbiAgdXJsUm9vdDogJ2h0dHA6Ly9vbW5pYnVzLWJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2JpbGxzLydcblxubW9kdWxlLmV4cG9ydHMgPSBBbWVuZEluZm8iLCJjbGFzcyBBbWVuZE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWxcblxubW9kdWxlLmV4cG9ydHMgPSBBbWVuZE1vZGVsIiwiY2xhc3MgQmlsbEhvdmVyTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEJpbGxIb3Zlck1vZGVsIiwiY2xhc3MgRW5hY3RlZEFnZ01vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWxcblxubW9kdWxlLmV4cG9ydHMgPSBFbmFjdGVkQWdnTW9kZWwiLCJjbGFzcyBTZWFyY2hSZXN1bHQgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoUmVzdWx0XG4iLCJfID0gd2luZG93Ll9cbnV0aWwgPSByZXF1aXJlICcuLi8uLi9oZWxwZXJzL2dyYXBoLXV0aWwuY29mZmVlJ1xuc29ydFV0aWwgPSByZXF1aXJlICcuLi8uLi9oZWxwZXJzL3NvcnRpbmcuY29mZmVlJ1xuXG5jbGFzcyBDaGFydFZpZXcgZXh0ZW5kcyBNYXJpb25ldHRlLkl0ZW1WaWV3XG4gIHRlbXBsYXRlOiByZXF1aXJlICcuL2NoYXJ0LXZpZXcuamFkZSdcbiAgbW9kZWw6IFwiQmlsbE1vZGVsXCJcbiAgY2xhc3NOYW1lOiAnbWFpbidcblxuICBldmVudHM6XG4gICAgJ21vdXNlb3ZlciBbZGF0YS1hbWR0XSc6ICdzaG93QW1lbmRtZW50RGF0YSdcbiAgICAnY2xpY2sgI29sZGVzdCc6ICdvbGRlc3RGaXJzdCdcbiAgICAnY2xpY2sgI25ld2VzdCc6ICduZXdlc3RGaXJzdCdcbiAgICAnY2xpY2sgI2RlbS10b3RhbCc6ICdkZW1Ub3RhbCdcbiAgICAnY2xpY2sgI3JlcC10b3RhbCc6ICdyZXBUb3RhbCdcbiAgICAnY2xpY2sgI2RlbS1iaWFzZWQnOiAnZGVtQmlhc2VkJ1xuICAgICdjbGljayAjcmVwLWJpYXNlZCc6ICdyZXBCaWFzZWQnXG4gICAgJ2NsaWNrICNsZWFzdC1zdXBwb3J0ZWQnOiAnbW9zdFN1cHBvcnQnXG4gICAgJ2NsaWNrICNtb3N0LXN1cHBvcnRlZCc6ICdsZWFzdFN1cHBvcnQnXG5cbiAgaW5pdGlhbGl6ZTogLT5cblxuICBAZGVmYXVsdHM6IC0+XG4gICAgbWFyZ2luID1cbiAgICAgIHRvcDogMzBcbiAgICAgIHJpZ2h0OiAxMFxuICAgICAgYm90dG9tOiAxMFxuICAgICAgbGVmdDogMTBcblxuICByZW5kZXI6IC0+XG4gICAgdm90ZXMgPSBAbW9kZWwuZ2V0ICd2b3RlcydcblxuICAgIGRhdGEgPSB2b3Rlcy5maWx0ZXIgKCBhbW1lbmRtZW50ICkgLT5cbiAgICAgIGlmIGFtbWVuZG1lbnQudm90ZVxuICAgICAgICByZXR1cm4gYW1tZW5kbWVudFxuICAgICAgXG4gICAgZGF0YSA9IGRhdGEubWFwIHV0aWwuYnVpbGREYXRhXG4gICAgICAuc29ydCBzb3J0VXRpbC5vcmRlclxuXG4gICAgcGFyc2VEYXRlID0gZDMudGltZS5mb3JtYXQoXCIlWS0lbS0lZFQlSDolTTolU1pcIikucGFyc2VcblxuICAgIG1hcmdpbiA9XG4gICAgICB0b3A6IDMwXG4gICAgICByaWdodDogMTBcbiAgICAgIGJvdHRvbTogMTBcbiAgICAgIGxlZnQ6IDEwXG5cbiAgICB3aWR0aCA9ICQoXCIjY2hhcnRcIikud2lkdGgoKSAtIG1hcmdpbi5yaWdodCAtIG1hcmdpbi5sZWZ0XG5cbiAgICBoZWlnaHQgPSBkYXRhLmxlbmd0aCAqIDEyXG5cbiAgICB4ID0gZDMuc2NhbGVcbiAgICAgIC5saW5lYXIoKVxuICAgICAgLnJhbmdlIFswLCB3aWR0aF1cblxuICAgIHkgPSBkMy5zY2FsZS5vcmRpbmFsKClcbiAgICAgIC5yYW5nZVJvdW5kQmFuZHMgWzAsIGhlaWdodF0sIC4yXG5cbiAgICBtYWtlUG9zaXRpdmUgPSAoeCktPlxuICAgICAgTWF0aC5hYnMgeFxuXG4gICAgdGlja3MgPSBbLTI1MCwgLTIwMCwgLTE1MCwgLTEwMCwgLTUwICwgMCwgNTAsIDEwMCwgMTUwLCAyMDAsIDI1MF1cblxuXG4gICAgYnV0dG9ucyA9IFtcbiAgICAgIFsnb2xkZXN0JywgJ29sZGVzdCddLFxuICAgICAgWyduZXdlc3QnLCAnbmV3ZXN0J10sXG4gICAgICBbJ2RlbS10b3RhbCcsICdtb3N0IGRlbSB2b3RlcyddLFxuICAgICAgWydyZXAtdG90YWwnLCAnbW9zdCByZXAgdm90ZXMnXSxcbiAgICAgIFsnZGVtLWJpYXNlZCcsICdtb3N0IGRlbSB3ZWlnaHRlZCddLFxuICAgICAgWydyZXAtYmlhc2VkJywgJ21vc3QgcmVwIHdlaWdodGVkJ10sXG4gICAgICBbJ2xlYXN0LXN1cHBvcnRlZCcsICdsZWFzdCBzdXBwb3J0ZWQnXSxcbiAgICAgIFsnbW9zdC1zdXBwb3J0ZWQnLCAnbW9zdCBzdXBwb3J0ZWQnXVxuICAgIF1cblxuICAgIGJ1dHRvbkhvbGRlciA9IEAkZWxcbiAgICBmb3IgcGFpciBpbiBidXR0b25zXG4gICAgICBidXR0b25Ib2xkZXIuYXBwZW5kKFwiPGJ1dHRvbiBpZD0je3BhaXJbMF19PiN7cGFpclsxXX08L2J1dHRvbj5cIilcblxuICAgIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgLnNjYWxlIHhcbiAgICAgIC5vcmllbnQgJ3RvcCdcbiAgICAgIC50aWNrVmFsdWVzIHRpY2tzXG4gICAgICAudGlja0Zvcm1hdCBtYWtlUG9zaXRpdmVcblxuICAgIHN0YXRpY0F4aXMgPSBkM1xuICAgICAgLnNlbGVjdCAnI2F4aXMnXG4gICAgICAuYXBwZW5kICdzdmcnXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHRcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsICczMHB4J1xuICAgICAgLmFwcGVuZCAnZydcbiAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgbWFyZ2luLmxlZnQgKyAnLCcgKyBtYXJnaW4udG9wICsgJyknXG5cbiAgICBzdmcgPSBkMy5zZWxlY3QgQGVsXG4gICAgICAuYXBwZW5kICdzdmcnXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHRcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tXG4gICAgICAuYXBwZW5kICdnJ1xuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2luLmxlZnQgKyAnKSdcblxuICAgIGRlbXMgPSBkYXRhLm1hcCAoZWwpIC0+XG4gICAgICBlbC5kZW1ZXG4gICAgcmVwcyA9IGRhdGEubWFwIChlbCkgLT5cbiAgICAgIGVsLnJlcFlcblxuICAgIG1heCA9IE1hdGgubWF4IChkMy5tYXggZGVtcyksIChkMy5tYXggcmVwcylcblxuICAgIHguZG9tYWluIFsgLW1heCwgbWF4IF1cbiAgICAgIC5uaWNlKCk7XG4gICAgeS5kb21haW4gZGF0YS5tYXAgKGQpIC0+XG4gICAgICBkLm51bWJlclxuXG4gICAgc3ZnXG4gICAgICAuc2VsZWN0QWxsICcuYmFyJ1xuICAgICAgICAuZGF0YSBkYXRhXG4gICAgICAuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kICdnJ1xuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYW1kdC1iYXInXG4gICAgICAgIC5lYWNoIChlbCwgaSkgLT5cbiAgICAgICAgICBkMy5zZWxlY3QgQFxuICAgICAgICAgICAgLmFwcGVuZCAncmVjdCdcbiAgICAgICAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgcmVwdWJsaWNhbidcbiAgICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgLT5cbiAgICAgICAgICAgICAgMTBcbiAgICAgICAgICAgIC5hdHRyICd3aWR0aCcsIChkKSAtPlxuICAgICAgICAgICAgICBNYXRoLmFicyAoeCBkLnJlcFkpIC0gKHggMClcbiAgICAgICAgICAgIC5hdHRyICd4JywgKGQpIC0+XG4gICAgICAgICAgICAgIHggMFxuICAgICAgICAgIGQzLnNlbGVjdCBAXG4gICAgICAgICAgICAuYXBwZW5kICdyZWN0J1xuICAgICAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhciBkZW1vY3JhdCdcbiAgICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgLT5cbiAgICAgICAgICAgICAgMTBcbiAgICAgICAgICAgIC5hdHRyICd3aWR0aCcsIChkKSAtPlxuICAgICAgICAgICAgICBNYXRoLmFicyAoeCBkLmRlbVkpIC0gKHggMClcbiAgICAgICAgICAgIC5hdHRyICd4JywgKGQpIC0+XG4gICAgICAgICAgICAgIHggLWQuZGVtWVxuICAgICAgICAgIGQzLnNlbGVjdCBAXG4gICAgICAgICAgICAuYXR0ciAnZGF0YS1hbWR0JywgKGQpIC0+XG4gICAgICAgICAgICAgIGQuYW1kdFxuICAgICAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIDAgKyAnLCcgKyBpICogMTUgKyAnKSdcblxuXG4gICAgc3RhdGljQXhpc1xuICAgICAgLmFwcGVuZCAnZydcbiAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAuY2FsbCB4QXhpc1xuXG4gICAgc3ZnXG4gICAgICAuYXBwZW5kICdnJ1xuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKSdcbiAgICAgIC5hcHBlbmQgJ2xpbmUnXG4gICAgICAgIC5hdHRyICd4MScsIHggMFxuICAgICAgICAuYXR0ciAneDInLCB4IDBcbiAgICAgICAgLmF0dHIgJ3kyJywgaGVpZ2h0XG4gICAgQHN2ZyA9IHN2Z1xuXG5cbiAgc2hvd0FtZW5kbWVudERhdGE6IChlKSAtPlxuICAgIGFtZW5kbWVudElkID0gQCQoIGUuY3VycmVudFRhcmdldCApLmF0dHIgJ2RhdGEtYW1kdCdcbiAgICBhbWVuZG1lbnREYXRhID0gXy5maW5kV2hlcmUgQG1vZGVsLmdldCggJ3ZvdGVzJyApLCBhbWVuZG1lbnRfaWQ6IGFtZW5kbWVudElkXG4gICAgQHRyaWdnZXIgJ3Nob3dBbWVuZG1lbnREYXRhJywgYW1lbmRtZW50RGF0YVxuXG4gIG9sZGVzdEZpcnN0OiAoZSkgLT5cbiAgICBzb3J0VXRpbC5zb3J0QnkgQHN2Zywgc29ydFV0aWwub2xkZXN0Rmlyc3RcblxuICBuZXdlc3RGaXJzdDogKGUpIC0+XG4gICAgc29ydFV0aWwuc29ydEJ5IEBzdmcsIHNvcnRVdGlsLm5ld2VzdEZpcnN0XG5cbiAgZGVtVG90YWw6IChlKSAtPlxuICAgIHNvcnRVdGlsLnNvcnRCeSBAc3ZnLCBzb3J0VXRpbC5kZW1vY3JhdFRvdGFsXG5cbiAgcmVwVG90YWw6IChlKSAtPlxuICAgIHNvcnRVdGlsLnNvcnRCeSBAc3ZnLCBzb3J0VXRpbC5yZXB1YmxpY2FuVG90YWxcblxuICBkZW1CaWFzZWQ6IChlKSAtPlxuICAgIHNvcnRVdGlsLnNvcnRCeSBAc3ZnLCBzb3J0VXRpbC5kZW1vY3JhdERpZmZcblxuICByZXBCaWFzZWQ6IChlKSAtPlxuICAgIHNvcnRVdGlsLnNvcnRCeSBAc3ZnLCBzb3J0VXRpbC5yZXB1YmxpY2FuRGlmZlxuXG4gIG1vc3RTdXBwb3J0OiAoZSkgLT5cbiAgICBzb3J0VXRpbC5zb3J0QnkgQHN2Zywgc29ydFV0aWwubGVhc3RTdXBwb3J0ZWRcblxuICBsZWFzdFN1cHBvcnQ6IChlKSAtPlxuICAgIHNvcnRVdGlsLnNvcnRCeSBAc3ZnLCBzb3J0VXRpbC5tb3N0U3VwcG9ydGVkXG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRWaWV3XG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcblxuYnVmLnB1c2goXCI8ZGl2IGlkPVxcXCJheGlzXFxcIj48L2Rpdj48ZGl2IGlkPVxcXCJjaGFydHNcXFwiPjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJjbGFzcyBDb250ZW50TGF5b3V0IGV4dGVuZHMgTWFyaW9uZXR0ZS5MYXlvdXRWaWV3XG4gIGF0dHJpYnV0ZXM6XG4gICAgaWQ6ICdjb250ZW50TGF5b3V0LWxheW91dCdcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicm93XCI+JytcbiAgICAgICc8ZGl2IGlkPVwiYXhpc1wiIGNsYXNzPVwiY29sLW1kLThcIj48L2Rpdj4nK1xuICAgICAgJzxkaXYgaWQ9XCJjaGFydFwiIGNsYXNzPVwiY29sLW1kLThcIj48L2Rpdj4nK1xuICAgICAgJzxkaXYgaWQ9XCJtZXRhXCIgY2xhc3M9XCJjb2wtbWQtNFwiPjwvZGl2PicrXG4gICAgICAnPC9kaXY+JytcbiAgICAnPC9kaXY+J1xuICByZWdpb25zOlxuICAgIGNoYXJ0OiAnI2NoYXJ0J1xuICAgIG1ldGE6ICcjbWV0YSdcblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZW50TGF5b3V0XG4iLCJfID0gd2luZG93Ll9cbnV0aWwgPSByZXF1aXJlICcuLi8uLi9oZWxwZXJzL2dyYXBoLXV0aWwuY29mZmVlJ1xuQnViYmxlQ2hhcnQgPSByZXF1aXJlICcuLy4uLy4uL2hlbHBlcnMvYnViYmxlLWNoYXJ0LmNvZmZlZSdcblxuXG5jbGFzcyBFbmFjdGVkVmlldyBleHRlbmRzIE1hcmlvbmV0dGUuSXRlbVZpZXdcbiAgdGVtcGxhdGU6IHJlcXVpcmUgJy4vZW5hY3RlZC12aWV3LmphZGUnXG4gIG1vZGVsOiBcIkVuYWN0ZWRNb2RlbFwiXG4gIGlkOiBcImJ1YmJsZUNoYXJ0XCJcblxuXG4gIGV2ZW50czpcbiAgICAnY2xpY2sgY2lyY2xlJzogXCJzaG93QmlsbERhdGFcIlxuICAgICdjbGljayAjY29tYmluZWQnOiBcImNvbWJpbmVcIlxuICAgICdjbGljayAjYnlZZWFyJzogJ2J5WWVhcidcbiAgICAnY2xpY2sgI2J5UGFydHknOiAnYnlQYXJ0eSdcbiAgICAnbW91c2VvdmVyIFtjbGFzc349YnViYmxlXSc6ICdzaG93RGV0YWlscydcbiAgXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGJpbGxzID0gQG1vZGVsLmdldCAnYmlsbHMnXG5cbiAgY29tYmluZTogLT5cbiAgICBCdWJibGVDaGFydC5kaXNwbGF5X2FsbCgpXG5cbiAgYnlQYXJ0eTogLT5cbiAgICBCdWJibGVDaGFydC5kaXNwbGF5X3BhcnR5KClcblxuICBieVllYXI6IC0+XG4gICAgQnViYmxlQ2hhcnQuZGlzcGxheV95ZWFyKClcblxuICBzaG93RGV0YWlsczogKGUpIC0+XG4gICAgYmlsbElkID0gQCQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKFwiZGF0YS1iaWxsXCIpXG4gICAgYmlsbERhdGEgPSBfLmZpbmRXaGVyZSBAbW9kZWwuZ2V0KCAnYmlsbHMnICksIGJpbGxfaWQ6IGJpbGxJZFxuICAgIEB0cmlnZ2VyIFwic2hvd01ldGFcIiwgYmlsbERhdGFcblxuXG4gIHNob3dCaWxsRGF0YTogKGUpIC0+XG4gICAgYmlsbElkID0gQCQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKFwiZGF0YS1iaWxsXCIpXG4gICAgYmlsbElkID0gYmlsbElkLnNsaWNlKCAtMyApICsgJy0nICsgYmlsbElkLnNsaWNlKCAwLCAtNCApXG4gICAgQHRyaWdnZXIgJ3Nob3dCaWxsJywgYmlsbElkIFxuXG4gIHJlbmRlcjogLT5cbiAgICAkID0+XG5cbiAgICAgIGNoYXJ0ID0gbnVsbFxuXG4gICAgICByZW5kZXJfdmlzID0gKGpzb24pIC0+XG4gICAgICAgIGNoYXJ0ID0gbmV3IEJ1YmJsZUNoYXJ0IGpzb25cbiAgICAgICAgY2hhcnQuc3RhcnQoKVxuICAgICAgICBCdWJibGVDaGFydC5kaXNwbGF5X2FsbCgpXG4gICAgICBCdWJibGVDaGFydC5kaXNwbGF5X2FsbCA9ICgpID0+XG4gICAgICAgIGNoYXJ0LmRpc3BsYXlfZ3JvdXBfYWxsKClcbiAgICAgIEJ1YmJsZUNoYXJ0LnNob3dfZGV0YWlscyA9IChlKSA9PlxuICAgICAgICBjaGFydC5zaG93X2RldGFpbHMoZSlcbiAgICAgIEJ1YmJsZUNoYXJ0LmRpc3BsYXlfeWVhciA9ICgpID0+XG4gICAgICAgIGNoYXJ0LmRpc3BsYXlfYnlfeWVhcigpXG4gICAgICBCdWJibGVDaGFydC5kaXNwbGF5X3BhcnR5ID0gKCkgPT5cbiAgICAgICAgY2hhcnQuZGlzcGxheV9ieV9wYXJ0eSgpXG4gICAgICBCdWJibGVDaGFydC50cmFuc2l0aW9uQmlsbD0oKSA9PlxuICAgICAgICBjaGFydC50cmFuc2l0aW9uQmlsbCgpXG4gICAgICBCdWJibGVDaGFydC50b2dnbGVfdmlldyA9ICh2aWV3X3R5cGUpID0+XG4gICAgICAgIGlmIHZpZXdfdHlwZSA9PSAneWVhcidcbiAgICAgICAgICBCdWJibGVDaGFydC5kaXNwbGF5X3llYXIoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQnViYmxlQ2hhcnQuZGlzcGxheV9hbGwoKVxuICAgICAgICAgIFxuICAgICAgI1JlbmRlciB0aGUgY2hhcnRcbiAgICAgIHJlbmRlcl92aXMgQGJpbGxzXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbmFjdGVkVmlld1xuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG5cbmJ1Zi5wdXNoKFwiPGRpdiBpZD1cXFwiY2hhcnRzXFxcIj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiY2xhc3MgUmVzdWx0VmlldyBleHRlbmRzIE1hcmlvbmV0dGUuSXRlbVZpZXdcbiAgdGFnTmFtZTogJ2xpJ1xuICBjbGFzc05hbWU6ICdiaWxsLXJlc3VsdCdcbiAgdGVtcGxhdGU6IHJlcXVpcmUgJy4vcmVzdWx0LXZpZXcuamFkZSdcbiAgZXZlbnRzOlxuICAgICdjbGljayc6ICdiaWxsUmVzdWx0J1xuXG4gIGJpbGxSZXN1bHQ6IC0+XG4gICAgQHRyaWdnZXIgJ2JpbGw6c3VibWl0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3VsdFZpZXdcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGxvY2Fsc18gPSAobG9jYWxzIHx8IHt9KSxzaG9ydF90aXRsZSA9IGxvY2Fsc18uc2hvcnRfdGl0bGUsbmlja25hbWVzID0gbG9jYWxzXy5uaWNrbmFtZXMsc3BvbnNvciA9IGxvY2Fsc18uc3BvbnNvcjtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiYmlsbC1pbmZvXFxcIj48cCBjbGFzcz1cXFwiYmlsbC10aXRsZVxcXCI+VGl0bGU6IFwiICsgKGphZGUuZXNjYXBlKChqYWRlLmludGVycCA9ICBzaG9ydF90aXRsZSApID09IG51bGwgPyAnJyA6IGphZGUuaW50ZXJwKSkgKyBcIjwvcD5cIik7XG5pZiAoIG5pY2tuYW1lcylcbntcbmJ1Zi5wdXNoKFwiPHAgY2xhc3M9XFxcImJpbGwtbmlja25hbWVzXFxcIj5OaWNrbmFtZXM6XCIpO1xuLy8gaXRlcmF0ZSBuaWNrbmFtZXNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gbmlja25hbWVzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgaSA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaSA8ICQkbDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9ICQkb2JqW2ldO1xuXG5idWYucHVzaChcIiBcIiArIChqYWRlLmVzY2FwZSgoamFkZS5pbnRlcnAgPSAgbmFtZSApID09IG51bGwgPyAnJyA6IGphZGUuaW50ZXJwKSkgKyBcIlwiKTtcbmlmKGkgPCBuaWNrbmFtZXMubGVuZ3RoLTEpXG57XG5idWYucHVzaChcIixcIik7XG59XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgaSBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIG5hbWUgPSAkJG9ialtpXTtcblxuYnVmLnB1c2goXCIgXCIgKyAoamFkZS5lc2NhcGUoKGphZGUuaW50ZXJwID0gIG5hbWUgKSA9PSBudWxsID8gJycgOiBqYWRlLmludGVycCkpICsgXCJcIik7XG5pZihpIDwgbmlja25hbWVzLmxlbmd0aC0xKVxue1xuYnVmLnB1c2goXCIsXCIpO1xufVxuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjwvcD5cIik7XG59XG5idWYucHVzaChcIjxwIGNsYXNzPVxcXCJiaWxsLXNwb25zb3JcXFwiPlNwb25zb3I6IFwiICsgKGphZGUuZXNjYXBlKChqYWRlLmludGVycCA9ICBzcG9uc29yLmZpcnN0X25hbWUgKSA9PSBudWxsID8gJycgOiBqYWRlLmludGVycCkpICsgXCIgXCIgKyAoamFkZS5lc2NhcGUoKGphZGUuaW50ZXJwID0gIHNwb25zb3IubGFzdF9uYW1lICkgPT0gbnVsbCA/ICcnIDogamFkZS5pbnRlcnApKSArIFwiPC9wPjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJjbGFzcyBTZWFyY2hSZXN1bHRzIGV4dGVuZHMgTWFyaW9uZXR0ZS5Db21wb3NpdGVWaWV3XG4gIHRhZ05hbWU6ICdkaXYnXG4gIGNsYXNzTmFtZTogJ3NlYXJjaC1yZXN1bHRzJ1xuICB0ZW1wbGF0ZTogcmVxdWlyZSAnLi9zZWFyY2gtcmVzdWx0cy12aWV3LmphZGUnXG4gIGNoaWxkVmlldzogcmVxdWlyZSAnLi9yZXN1bHQtdmlldy5jb2ZmZWUnXG4gIGNoaWxkVmlld0NvbnRhaW5lcjogJy5yZXN1bHRzLWNvbnRhaW5lcidcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBvbiAnY2hpbGR2aWV3OmJpbGw6c3VibWl0JywgKCBkYXRhICkgLT5cbiAgICAgIGJpbGwgPSBkYXRhLm1vZGVsLmdldCAnYmlsbF9pZCdcbiAgICAgIGJpbGxJZCA9IGJpbGwuc2xpY2UoIC0zICkgKyAnLScgKyBiaWxsLnNsaWNlKCAwLCAtNCApXG4gICAgICBAdHJpZ2dlciAnYmlsbDpzdWJtaXQnLCBiaWxsSWRcbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoUmVzdWx0c1xuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG5cbmJ1Zi5wdXNoKFwiPGgzPlNlYXJjaCBSZXN1bHRzPC9oMz48dWwgY2xhc3M9XFxcInJlc3VsdHMtY29udGFpbmVyXFxcIj48L3VsPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJjbGFzcyBBbWVuZEluZm9WaWV3IGV4dGVuZHMgTWFyaW9uZXR0ZS5JdGVtVmlld1xuXG4gIGluaXRpYWxpemU6ICggb3B0aW9ucyApIC0+XG4gICAgYW1lbmRzID0gQG1vZGVsLmdldCAndm90ZXMnXG4gICAgQG1vZGVsLnNldCAneWVzQWdnJywgYW1lbmRzLnJlZHVjZSAoIGFjYywgYW1lbmQgKSAtPlxuICAgICAgaWYgYW1lbmQudm90ZVxuICAgICAgICB2b3RlID0gYW1lbmQudm90ZVxuICAgICAgICBhY2MuZGVtWSArPSArdm90ZS5kZW1vY3JhdGljLnllc1xuICAgICAgICBhY2MucmVwWSArPSArdm90ZS5yZXB1YmxpY2FuLnllc1xuICAgICAgICBhY2MudG90YWwgKz0gKCArdm90ZS50b3RhbC55ZXMgKyArdm90ZS50b3RhbC5ubyApXG4gICAgICByZXR1cm4gYWNjXG4gICAgICwgZGVtWTogMCwgcmVwWTogMCwgdG90YWw6IDBcblxuICByZW5kZXI6IC0+XG4gICAgZGF0YSA9IEBtb2RlbC5nZXQgJ3llc0FnZydcbiAgICAkID0+XG4gICAgICB3aWR0aCA9IDI4MFxuICAgICAgaGVpZ2h0ID0gMjgwXG4gICAgICByYWRpdXMgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDJcbiAgICAgIFxuICAgICAgdGVtcCA9IGRhdGFcbiAgICAgIGRhdGEgPSBbXVxuICAgICAgZGVtWSA9IHRlbXAuZGVtWVxuICAgICAgcmVwWSA9IHRlbXAucmVwWVxuICAgICAgdG90YWwgPSB0ZW1wLnRvdGFsXG4gICAgICBub25ZID0gdGVtcC50b3RhbCAtIGRlbVkgLSByZXBZXG4gICAgICBkYXRhLnB1c2ggdGl0bGU6ICdEZW1vY3JhdGljJywgdm90ZXM6IGRlbVksIHBlcmNlbnQ6IE1hdGgucm91bmQoIGRlbVkgLyB0b3RhbCAqIDEwMCApICsgJyUnXG4gICAgICBkYXRhLnB1c2ggdGl0bGU6ICdSZXB1YmxpY2FuJywgdm90ZXM6IHJlcFksIHBlcmNlbnQ6IE1hdGgucm91bmQoIHJlcFkgLyB0b3RhbCAqIDEwMCApICsgJyUnXG4gICAgICBkYXRhLnB1c2ggdGl0bGU6ICdObycsIHZvdGVzOiBub25ZLCBwZXJjZW50OiBNYXRoLnJvdW5kKCBub25ZIC8gdG90YWwgKiAxMDAgKSArICclJ1xuXG4gICAgICBhcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzIHJhZGl1cyAtIDEwXG4gICAgICAgIC5pbm5lclJhZGl1cyByYWRpdXMgLSA3MFxuXG4gICAgICBwaWUgPSBkMy5sYXlvdXQucGllKClcbiAgICAgICAgLnNvcnQgbnVsbFxuICAgICAgICAudmFsdWUgKGQpIC0+XG4gICAgICAgICAgZC52b3Rlc1xuXG4gICAgICBzdmcgPSBkMy5zZWxlY3QgQGVsXG4gICAgICAgLmFwcGVuZCBcInN2Z1wiXG4gICAgICAgIC5hdHRyIFwid2lkdGhcIiwgd2lkdGhcbiAgICAgICAgLmF0dHIgXCJoZWlnaHRcIiwgaGVpZ2h0XG4gICAgICAgLmFwcGVuZCBcImdcIlxuICAgICAgICAuYXR0ciBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHdpZHRoIC8gMiArIFwiLFwiICsgaGVpZ2h0IC8gMiArIFwiKVwiXG5cbiAgICAgIGcgPSBzdmcuc2VsZWN0QWxsIFwiLmFyY1wiXG4gICAgICAgIC5kYXRhIHBpZSBkYXRhXG4gICAgICAgLmVudGVyKCkuYXBwZW5kIFwiZ1wiXG4gICAgICAgIC5hdHRyIFwiY2xhc3NcIiwgXCJhcmNcIlxuXG4gICAgICBnLmFwcGVuZCBcInBhdGhcIlxuICAgICAgICAgIC5hdHRyIFwiZFwiLCBhcmNcbiAgICAgICAgICAuc3R5bGUgXCJmaWxsXCIsIChkKSAtPlxuICAgICAgICAgICAgaWYgZC5kYXRhLnRpdGxlIGlzICdEZW1vY3JhdGljJyB0aGVuIHJldHVybiAnYmx1ZSdcbiAgICAgICAgICAgIGlmIGQuZGF0YS50aXRsZSBpcyAnUmVwdWJsaWNhbicgdGhlbiByZXR1cm4gJ3JlZCdcbiAgICAgICAgICAgIGlmIGQuZGF0YS50aXRsZSBpcyAnTm8nIHRoZW4gcmV0dXJuICdncmF5J1xuXG4gICAgICBnLmFwcGVuZCBcInRleHRcIlxuICAgICAgICAgIC5hdHRyIFwiY2xhc3NcIiwgXCJwaWUtY2hhcnQtdGV4dFwiXG4gICAgICAgICAgLmF0dHIgXCJ0cmFuc2Zvcm1cIiwgKGQpIC0+XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIGFyYy5jZW50cm9pZChkKSArIFwiKVwiXG4gICAgICAgICAgLmF0dHIgXCJkeVwiLCBcIi4zNWVtXCJcbiAgICAgICAgICAuc3R5bGUgXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiXG4gICAgICAgICAgLnRleHQgKGQpIC0+XG4gICAgICAgICAgICBkLmRhdGEucGVyY2VudFxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbWVuZEluZm9WaWV3IiwiXG5jbGFzcyBBbWVuZFZpZXcgZXh0ZW5kcyBNYXJpb25ldHRlLkl0ZW1WaWV3XG4gIHRlbXBsYXRlOiByZXF1aXJlICcuL21ldGEtYW1lbmQtdmlldy5qYWRlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFtZW5kVmlldyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGxvY2Fsc18gPSAobG9jYWxzIHx8IHt9KSxkYXRhID0gbG9jYWxzXy5kYXRhO1xuYnVmLnB1c2goXCI8cD5EZXNjcmlwdGlvbjogXCIgKyAoamFkZS5lc2NhcGUoKGphZGUuaW50ZXJwID0gIGRhdGEudm90ZS5kZXNjcmlwdGlvbiApID09IG51bGwgPyAnJyA6IGphZGUuaW50ZXJwKSkgKyBcIjwvcD48cD5SZWFzb24gZm9yIFZvdGU6IFwiICsgKGphZGUuZXNjYXBlKChqYWRlLmludGVycCA9ICBkYXRhLnZvdGUucXVlc3Rpb24gKSA9PSBudWxsID8gJycgOiBqYWRlLmludGVycCkpICsgXCI8L3A+PHA+Vm90ZSBUeXBlOiBcIiArIChqYWRlLmVzY2FwZSgoamFkZS5pbnRlcnAgPSAgZGF0YS52b3RlX3R5cGUgKSA9PSBudWxsID8gJycgOiBqYWRlLmludGVycCkpICsgXCI8L3A+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIlxuY2xhc3MgQmlsbEhvdmVyVmlldyBleHRlbmRzIE1hcmlvbmV0dGUuSXRlbVZpZXdcbiAgdGVtcGxhdGU6IHJlcXVpcmUgJy4vbWV0YS1iaWxsLWhvdmVyLXZpZXcuamFkZSdcblxubW9kdWxlLmV4cG9ydHMgPSBCaWxsSG92ZXJWaWV3IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgbG9jYWxzXyA9IChsb2NhbHMgfHwge30pLGRhdGEgPSBsb2NhbHNfLmRhdGE7XG5idWYucHVzaChcIjxQPlwiICsgKGphZGUuZXNjYXBlKChqYWRlLmludGVycCA9ICBkYXRhLmJpbGxfaWQgKSA9PSBudWxsID8gJycgOiBqYWRlLmludGVycCkpICsgXCI8L1A+PFA+XCIgKyAoamFkZS5lc2NhcGUoKGphZGUuaW50ZXJwID0gIGRhdGEub2ZmaWNpYWxfdGl0bGUgKSA9PSBudWxsID8gJycgOiBqYWRlLmludGVycCkpICsgXCI8L1A+PFA+XCIgKyAoamFkZS5lc2NhcGUoKGphZGUuaW50ZXJwID0gIGRhdGEuZW5hY3RlZF9hcy5sYXdfdHlwZSApID09IG51bGwgPyAnJyA6IGphZGUuaW50ZXJwKSkgKyBcIjwvUD5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiY2xhc3MgRW5hY3RlZEFnZ1ZpZXcgZXh0ZW5kcyBNYXJpb25ldHRlLkl0ZW1WaWV3XG4gIHRlbXBsYXRlOiByZXF1aXJlICcuL21ldGEtZW5hY3RlZC1hZ2ctdmlldy5qYWRlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVuYWN0ZWRBZ2dWaWV3IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG5cbmJ1Zi5wdXNoKFwiPHA+c29tZSBFbmFjdGVkIGFnZ3JlZ2F0aW9uIGRhdGEgaGVyZTwvcD5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiXG5jbGFzcyBNZXRhSW5mb1ZpZXcgZXh0ZW5kcyBNYXJpb25ldHRlLkl0ZW1WaWV3XG4gIHRlbXBsYXRlOiAnPHA+SG92ZXIgb3ZlciB0aGUgZGlzcGxheSBmb3IgbW9yZSBpbmZvcm1hdGlvbi48cD4nXG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YUluZm9WaWV3IiwiY2xhc3MgTWV0YUxheW91dCBleHRlbmRzIE1hcmlvbmV0dGUuTGF5b3V0Vmlld1xuXG4gIHRlbXBsYXRlOiAnPGRpdj4nK1xuICAnPGRpdiBpZD1cIm1ldGEtMVwiPjwvZGl2PicrXG4gICc8ZGl2IGlkPVwibWV0YS0yXCI+PC9kaXY+JytcbiAgJzxkaXYgaWQ9XCJtZXRhLTNcIj48L2Rpdj4nK1xuICAnPC9kaXY+J1xuXG4gIHJlZ2lvbnM6XG4gICAgbWV0YTE6ICcjbWV0YS0xJ1xuICAgIG1ldGEyOiAnI21ldGEtMidcbiAgICBtZXRhMzogJyNtZXRhLTMnXG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YUxheW91dCIsImNsYXNzIFNlYXJjaCBleHRlbmRzIE1hcmlvbmV0dGUuSXRlbVZpZXdcbiAgdGVtcGxhdGU6IHJlcXVpcmUgJy4vc2VhcmNoLXZpZXcuamFkZSdcbiAgY2xhc3NOYW1lOiAnc2VhcmNoLXZpZXcnXG5cbiAgaW5pdGlhbGl6ZTogLT5cblxuICBldmVudHM6XG4gICAgJ2NsaWNrICNmaW5kLWJpbGwnOiAnZmluZEJpbGwnXG4gICAgJ2NsaWNrICNpbmZvcm1hdGlvbic6ICd3ZWxjb21lU2hvdydcbiAgICAnY2xpY2sgI3NlYXJjaC1iaWxscyc6ICdzZWFyY2hCaWxscydcbiAgICAna2V5cHJlc3MgI2NvbmdyZXNzJzogJ2NvbmdyZXNzU3VibWl0J1xuICAgICdrZXlwcmVzcyAjYmlsbC1udW1iZXInOiAnYmlsbFN1Ym1pdCdcbiAgICAna2V5cHJlc3MgI2ZpbmQtaW5wdXQnOiAnc2VhcmNoU3VibWl0J1xuXG4gIGZpbmRCaWxsOiAoZSkgLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAdHJpZ2dlciAnZmluZEJpbGw6c3VibWl0JywgQGJpbGxJZCgpXG4gICAgQGNsZWFyRGF0YSgpXG5cbiAgd2VsY29tZVNob3c6IChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEB0cmlnZ2VyICd3ZWxjb21lOnNob3cnXG5cbiAgc2VhcmNoQmlsbHM6IChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHF1ZXJ5ID0gQCRlbC5maW5kKCcjZmluZC1pbnB1dCcpLnZhbCgpXG4gICAgQHRyaWdnZXIgJ3NlYXJjaDpiaWxsczpzdWJtaXQnLCBxdWVyeVxuICAgIEBjbGVhckRhdGEoKVxuXG4gIGNvbmdyZXNzU3VibWl0OiAoZSkgLT5cbiAgICBiaWxsID0gQCQoICcjYmlsbC1udW1iZXInICkudmFsKClcbiAgICBjb25ncmVzcyA9IEAkKCAnI2NvbmdyZXNzJyApLnZhbCgpXG4gICAgaWYgZS53aGljaCBpcyAxMyBhbmQgYmlsbCBhbmQgY29uZ3Jlc3NcbiAgICAgIEB0cmlnZ2VyICdmaW5kQmlsbDpzdWJtaXQnLCBAYmlsbElkKClcbiAgICAgIEBjbGVhckRhdGEoKVxuXG4gIGJpbGxTdWJtaXQ6IChlKSAtPlxuICAgIGNvbmdyZXNzID0gQCQoICcjY29uZ3Jlc3MnICkudmFsKClcbiAgICBiaWxsID0gQCQoICcjYmlsbC1udW1iZXInICkudmFsKClcbiAgICBpZiBlLndoaWNoIGlzIDEzIGFuZCBjb25ncmVzcyBhbmQgYmlsbFxuICAgICAgQHRyaWdnZXIgJ2ZpbmRCaWxsOnN1Ym1pdCcsIEBiaWxsSWQoKVxuICAgICAgQGNsZWFyRGF0YSgpXG5cbiAgc2VhcmNoU3VibWl0OiAoZSkgLT5cbiAgICBxdWVyeSA9IEAkKCAnI2ZpbmQtaW5wdXQnICkudmFsKClcbiAgICBpZiBlLndoaWNoIGlzIDEzIGFuZCBxdWVyeVxuICAgICAgQHRyaWdnZXIgJ3NlYXJjaDpiaWxsczpzdWJtaXQnLCBxdWVyeVxuICAgICAgQGNsZWFyRGF0YSgpXG5cbiAgYmlsbElkOiAoKSAtPlxuICAgIEAkKCAnI2NvbmdyZXNzJyApLnZhbCgpICsgJy0nICsgQCQoICcjYmlsbC1udW1iZXInICkudmFsKClcbiAgY2xlYXJEYXRhOiAoKSAtPlxuICAgIEAkKCAnI2NvbmdyZXNzJyApLnZhbCgnJylcbiAgICBAJCggJyNiaWxsLW51bWJlcicgKS52YWwoJycpXG4gICAgQCQoICcjZmluZC1pbnB1dCcgKS52YWwoJycpXG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcblxuYnVmLnB1c2goXCI8aDQgY2xhc3M9XFxcInNlYXJjaC1pbnRyb1xcXCI+SWYgeW91IGtub3cgdGhlIEJpbGwgeW91J3JlIGxvb2tpbmcgZm9yIGdvIGFoZWFkIGFuZCBlbnRlciB0aGUgY29uZ3Jlc3MgYW5kIEJpbGwgbnVtYmVycy4gIE9yIHlvdSBjYW4gc2VhcmNoIHRocm91Z2ggYmlsbHMgd2l0aCBrZXl3b3Jkcy48L2g0PjxkaXYgY2xhc3M9XFxcImZvcm0tZmllbGQgZW50ZXItYmlsbFxcXCI+PGlucHV0IGlkPVxcXCJjb25ncmVzc1xcXCIgdHlwZT1cXFwibnVtYmVyXFxcIiBtYXg9XFxcIjExM1xcXCIgcGxhY2Vob2xkZXI9XFxcIkVudGVyIENvbmdyZXNzIGhlcmVcXFwiLz48aW5wdXQgaWQ9XFxcImJpbGwtbnVtYmVyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgdGhlIGJpbGwgbnVtYmVyIGhlcmUhIGV4LiBocjIzOTdcXFwiLz48YnV0dG9uIGlkPVxcXCJmaW5kLWJpbGxcXFwiPlNob3cgQmlsbDwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvcm0tZmllbGQgZW50ZXItc2VhcmNoLXN0cmluZ1xcXCI+PGlucHV0IGlkPVxcXCJmaW5kLWlucHV0XFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgS2V5d29yZHMgdG8gU2VhcmNoIEJpbGxzXFxcIi8+PGJ1dHRvbiBpZD1cXFwic2VhcmNoLWJpbGxzXFxcIj5GaW5kIEJpbGxzPC9idXR0b24+PC9kaXY+PHAgaWQ9XFxcImluZm9ybWF0aW9uXFxcIiBjbGFzcz1cXFwiaW5mby1pY29uXFxcIj48aW1nIHNyYz1cXFwiL2luZm8taWNvbi5wbmdcXFwiLz48L3A+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImNsYXNzIFdlbGNvbWVWaWV3IGV4dGVuZHMgTWFyaW9uZXR0ZS5JdGVtVmlld1xuICB0ZW1wbGF0ZTogcmVxdWlyZSAnLi93ZWxjb21lLXZpZXcuamFkZSdcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEB0cmlnZ2VyICd3ZWxjb21lOnNob3cnXG5cbiAgdHJpZ2dlcnM6XG4gICAgJ2NsaWNrIC53ZWxjb21lLWNsb3NlJzogJ3dlbGNvbWU6Y2xvc2UnXG5cbm1vZHVsZS5leHBvcnRzID0gV2VsY29tZVZpZXdcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xuXG5idWYucHVzaChcIjxoMT5XZWxjb21lIHRvIE9tbmlidXMhPC9oMT48cD5BbiBpbnRlcmFjdGl2ZSBsZWdpc2xhdGlvbiB2aXN1YWxpemF0aW9uIGFwcCB0aGF0IHdpbGwgaGVscCB5b3UgdW5kZXJzdGFuZFxcbndoYXQncyBhY3V0YWxseSBnb2luZyBvbiBpbiBXYXNoaW5ndG9uIEQuQyEgV2UndmUgcHJlbG9hZGVkIG9uZSBvZiBvdXJcXG5mYXZvcml0ZXMuPC9wPjxwPkV4cGxvcmUgdGhlIGNoYXJ0IGFuZCB0YWJsZSBiZWxvd1xcbm9yIHVzZSB0aGUgc2VhcmNoIGJhciB0byBzZWFyY2ggZm9yIGEgcGFydGljdWxhciBiaWxsLjwvcD48cCBjbGFzcz1cXFwid2VsY29tZS1jbG9zZVxcXCI+PGltZyBzcmM9XFxcIi9pY29uX3gucG5nXFxcIi8+PC9wPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLG51bGwsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLmphZGU9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykuZmlsdGVyKG51bGxzKS5qb2luKCcgJykgOiB2YWw7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9ICBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKVxuKDEpXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSJdfQ==
