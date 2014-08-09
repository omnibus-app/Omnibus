Rickshaw = require 'rickshaw'
class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'


  initialize: ->
  	@graph = new Rickshaw.Graph(
  	  element: document.querySelector("#charts")
  	  renderer: "area"
  	  width: 580
  	  height: 230
  	  series: [
        color: "steelblue"
        data: [
          {
            x: 0
            y: 40
          }
          {
            x: 1
            y: 49
          }
          {
            x: 2
            y: 38
          }
          {
            x: 3
            y: 30
          }
          {
            x: 4
            y: 32
          }
        ]
      ]
  	)
  render: ->
  	@graph.render()


module.exports = ChartView