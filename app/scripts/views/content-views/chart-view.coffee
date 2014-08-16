util = require '../../helpers/graph-util.coffee'
d3 = require 'd3'
class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'
  model: "BillModel"


  initialize: ->

  render: ->
    formatDate = d3.time.format.iso


module.exports = ChartView
