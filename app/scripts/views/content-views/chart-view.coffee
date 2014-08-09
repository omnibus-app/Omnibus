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

    @graph.render()	


module.exports = ChartView