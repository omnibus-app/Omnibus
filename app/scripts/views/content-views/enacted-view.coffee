_ = window._
util = require '../../helpers/graph-util.coffee'
data = require './../../../../assets/data/enacted.json'
bubbles = require './../../helpers/bubble-chart.coffee'

class EnactedtView extends Marionette.ItemView
  template: require './enacted-view.jade'
  model: "EnactedModel"
  tagName: "svg"

  initialize: ->

  @defaults: ->
    margin =
      top: 30
      right: 10
      bottom: 10
      left: 10

  render: ->
    #votes = @model.get 'votes'

    #data = data.map util.buildData

    # parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse

    # margin =
    #   top: 30
    #   right: 10
    #   bottom: 10
    #   left: 10

    @data = data
    # console.log data
    # width = $("#chart").width() - margin.right - margin.left
    # height = data.length * 12

    $ ->

      chart = null


      render_vis = (json) ->
        chart = new BubbleChart json
        chart.start()
        root.display_all()
      root.display_all = () =>
        chart.display_group_all()
      root.display_year = () =>
        chart.display_by_year()
      root.toggle_view = (view_type) =>
        if view_type == 'year'
          root.display_year()
        else
          root.display_all()

      d3.json @data, render_vis


module.exports = EnactedView
