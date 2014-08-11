Rickshaw = require 'rickshaw'
util = require '../../helpers/graph-util.coffee'
d3 = require 'd3'
class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'
  model: "BillModel"


  initialize: ->

  render: ->
    formatDate = d3.time.format.iso
    simpleBill = @model.attributes.results[0]
    @graph = new Rickshaw.Graph(
      element: @el
      renderer: "area"
      width: 750
      height: 400
      padding: ->
        top: 0.02
        left: 0.02
        right: 0.08
        bottom: 0.02
      series: [
        color: "steelblue"
        data: util.findData simpleBill
        name: 'action number'
      ]
    )

    @x_axis = new Rickshaw.Graph.Axis.X
      graph: @graph
      tickFormat: (x)->
      	new Date(x).toLocaleDateString()

    @y_axis = new Rickshaw.Graph.Axis.Y
      graph: @graph

    @highlighter = new Rickshaw.Graph.Behavior.Series.Highlight(
      graph: @graph
    )

    @hoverDetail = new Rickshaw.Graph.HoverDetail(
      graph: @graph
      xFormatter: (x) ->
        new Date(x).toLocaleDateString()

      yFormatter: (y) ->
        Math.floor(y)
    )

    @x_axis.render()
    @y_axis.render()
    @graph.render()


module.exports = ChartView
