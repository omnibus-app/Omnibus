Rickshaw = require 'rickshaw'
class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'
  data = [{ x: 0, y: 40 },
           { x: 1, y: 49 },
           { x: 2, y: 38 },
           { x: 3, y: 30 },
           { x: 4, y: 32 }]

  initialize: ->

  render: ->
    @graph = new Rickshaw.Graph(
      element: @el
      renderer: "line"
      padding: {top: 0.02, left: 0.02, right: 0.02, bottom: 0.02}
      series: [
        color: "steelblue"
        data: data
      ]
    )

    #Axes aren't rendering properly
    # @x_axis = new Rickshaw.Graph.Axis.Time
    #   graph: @graph

    # @y_axis = new Rickshaw.Graph.Axis.Time
    #   graph: @graph

    @highlighter = new Rickshaw.Graph.Behavior.Series.Highlight(
      graph: @graph
    )

    @hoverDetail = new Rickshaw.Graph.HoverDetail(
      graph: @graph
      xFormatter: (x) ->
        x + " X axes units"

      yFormatter: (y) ->
        Math.floor(y) + "% Y axes units"
    )


    # @x_axis.render()
    # @y_axis.render()
    @graph.render()	


module.exports = ChartView