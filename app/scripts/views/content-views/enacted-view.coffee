_ = window._
util = require '../../helpers/graph-util.coffee'

class EnactedtView extends Marionette.ItemView
  template: require './enacted-view.jade'
  model: "EnactedModel"
  tagName: "svg"

  events:
    'mouseover [data-amdt]': 'showAmendmentData'

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

    parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse

    margin =
      top: 30
      right: 10
      bottom: 10
      left: 10

    width = $("#chart").width() - margin.right - margin.left

    height = data.length * 12


module.exports = EnactedView
