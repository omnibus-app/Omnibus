_ = window._
util = require '../../helpers/graph-util.coffee'
data = require './../../../../assets/data/enacted.json'
BubbleChart = require './../../helpers/bubble-chart.coffee'


class EnactedView extends Marionette.ItemView
  template: require './enacted-view.jade'
  model: "EnactedModel"
  tagName: "svg"

  initialize: ->


  render: ->
    $ ->

      chart = null
      @data = JSON.stringify data


      render_vis = (json) ->
        chart = new BubbleChart json
        chart.start()
        BubbleChart.display_all()
      BubbleChart.display_all = () =>
        chart.display_group_all()
      BubbleChart.display_year = () =>
        chart.display_by_year()
      BubbleChart.toggle_view = (view_type) =>
        if view_type == 'year'
          BubbleChart.display_year()
        else
          BubbleChart.display_all()

      #Render the chart
      render_vis data


module.exports = EnactedView
