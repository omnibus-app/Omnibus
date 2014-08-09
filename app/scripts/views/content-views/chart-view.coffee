Rickshaw = require 'rickshaw'
d3 = require 'd3'
class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'
  model: "BillModel"


  initialize: ->

  render: ->
    formatDate = d3.time.format.iso
    simpleBill = @model.attributes.results[0]
    console.log simpleBill.actions


    seriesData = [[]]

    random = new Rickshaw.Fixtures.RandomData(50)

    i = 1
    while i < simpleBill.actions.length
      simpleBill["actions"][i] = {
        x: formatDate.parse(simpleBill["actions"][i]["datetime"].getTime())
        y: 1
        description: simpleBill.actions[i]["description"]
      }
      seriesData.push simpleBill['actions'][i]
      i++
    console.log seriesData


    @graph = new Rickshaw.Graph(
      element: @el
      renderer: "multi"
      dotSize: 5
      padding: {top: 0.02, left: 0.02, right: 0.02, bottom: 0.02}
      series: [{
         name: "overview"
         color: "steelblue"
         renderer: "line"
         data: [{x: formatDate.parse(simpleBill["introduced_date"]).getTime(), y: 0}
          {x: formatDate.parse(simpleBill["house_passage_vote"]).getTime(), y: 1}
          {x: formatDate.parse(simpleBill["latest_major_action_date"]).getTime(), y: 1}]
      }
      {
         name: "actions"
      	 color: "red"
      	 data: seriesData[0]
      	 renderer: "scatterplot"
      }
      ]
    )


    #Axes aren't rendering properly
    @x_axis = new Rickshaw.Graph.Axis.X
      graph: @graph
      tickFormat: (x)->
      	new Date(x).toLocaleDateString()

    @y_axis = new Rickshaw.Graph.Axis.Time
      graph: @graph

    @highlighter = new Rickshaw.Graph.Behavior.Series.Highlight(
      graph: @graph
    )

    @hoverDetail = new Rickshaw.Graph.HoverDetail(
      graph: @graph
      xFormatter: (x) ->
        new Date(x).toLocaleDateString()

      yFormatter: (y) ->
        Math.floor(y) + "% Y axes units"
    )

    @x_axis.render()
    @y_axis.render()
    @graph.render()


module.exports = ChartView