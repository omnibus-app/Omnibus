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
      series: [
        color: "steelblue"
        data: data
      ]
    )

    @highlighter = new Rickshaw.Graph.Behavior.Series.Highlight(
      graph: @graph
    )

    @hoverDetail = new Rickshaw.Graph.HoverDetail(
      graph: @graph
      xFormatter: (x) ->
        x + "seconds"

      yFormatter: (y) ->
        Math.floor(y) + " percent"
    )
    
    @x_axis = new Rickshaw.Graph.Axis.Time
      graph: @graph

    @y_axis = new Rickshaw.Graph.Axis.Time
      graph: @graph

    @x_axis.render()
    @y_axis.render()
    @graph.render()	


module.exports = ChartView