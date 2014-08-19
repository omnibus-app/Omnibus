_ = window._
util = require '../../helpers/graph-util.coffee'
d3 = require 'd3'
data = require './../../../../assets/data/votes_month.json'

class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'
  model: "BillModel"
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
    votes = @model.get 'votes'

    data = votes.filter ( ammendment ) ->
      if ammendment.vote
        return ammendment

    data = data.map util.buildData

    parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse

    margin =
      top: 30
      right: 10
      bottom: 10
      left: 10

    width = $("#chart").width() - margin.right - margin.left

    height = data.length * 12

    #Set the scale
    x = d3.scale
      .linear()
      .range [0, width]

    y = d3.scale.ordinal()
      .rangeRoundBands [0, height], .2

    makePositive = (x)->
      Math.abs x

    ticks = [-250, -200, -150, -100, -50 , 0, 50, 100, 150, 200, 250]

    xAxis = d3.svg
      .axis()
      .scale x
      .orient 'top'
        .tickValues ticks
        .tickFormat makePositive

    staticAxis = d3
      .select '#axis'
      .append 'svg'
        .attr 'width', width + margin.left + margin.right
        .attr 'height', '30px'
      .append 'g'
        .attr 'transform', 'translate(' +
          margin.left + ',' + margin.top + ')'


    svg = d3.select @el
      .append 'svg'
        .attr 'width', width + margin.left + margin.right
        .attr 'height', height + margin.top + margin.bottom
      .append 'g'
        .attr 'transform', 'translate(' + margin.left + ')'

<<<<<<< HEAD
    url = 'http://localhost:3000/api/bills/113-hr2397/votes/'

    d3.json url, (error, json) ->
      data = json.map util.buildData

      x.domain d3.extent data, (d) ->
        if d.demY > d.repY then d.demY else d.repY
      y.domain data.map (d) ->
        d.number

      svg
        .selectAll '.bar'
          .data data
        .enter()
          .append 'g'
          .attr 'class', 'amdt-bar'
          .each (el, i) ->
            d3.select @
              .append 'rect'
              .attr 'class', 'republican'
              .attr 'height', (d) ->
                8
              .attr 'width', (d) ->
                d.repY
            d3.select @
              .append 'rect'
              .attr 'class', 'democrat'
              .attr 'height', (d) ->
                8
              .attr 'width', (d) ->
                d.demY
            d3.select @
              .attr 'data-amdt', (d) ->
                d.amdt
              .attr 'transform', 'translate(' + 0 + ',' + i * 10 + ')'
=======
    x.domain d3.extent data, (d) ->
      if d.demY > d.repY then d.demY else d.repY
    y.domain data.map (d) ->
      d.number

    svg
      .selectAll '.bar'
        .data data
      .enter()
        .append 'g'
        .attr 'class', 'amdt-bar'
        .each (el, i) ->
          d3.select @
            .append 'rect'
            .attr 'class', 'republican'
            .attr 'height', (d) ->
              8
            .attr 'width', (d) ->
              d.repY
          d3.select @
            .append 'rect'
            .attr 'class', 'democrat'
            .attr 'height', (d) ->
              d.demY
          d3.select @
            .attr 'data-amdt', (d) ->
              d.amdt
            .attr 'transform', 'translate(' + 0 + ',' + i * 10 + ')'
>>>>>>> dfce5329ebed1eb0a3e4ad738159e7396b7211a8

    svg
      .append 'g'
      .attr 'class', 'x axis'
      .call xAxis

    svg
      .append 'g'
        .attr 'class', 'y axis'
      .append 'line'
        .attr 'x1', x 0
        .attr 'x2', x 0
        .attr 'y2', height

  showAmendmentData: (e) ->
    amendmentId = @$( e.currentTarget ).attr 'data-amdt'
    amendmentData = _.findWhere @model.get( 'votes' ), amendment_id: amendmentId
    @trigger 'showAmendmentData', amendmentData

module.exports = ChartView
