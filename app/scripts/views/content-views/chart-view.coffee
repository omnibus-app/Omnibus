_ = window._
util = require '../../helpers/graph-util.coffee'
sortUtil = require '../../helpers/sorting.coffee'

class ChartView extends Marionette.ItemView
  template: require './chart-view.jade'
  model: "BillModel"
  className: 'test'

  events:
    'mouseover [data-amdt]': 'showAmendmentData'
    'click #oldest': 'oldestFirst'
    'click #newest': 'newestFirst'
    'click #dem-total': 'demTotal'
    'click #rep-total': 'repTotal'
    'click #dem-biased': 'demBiased'
    'click #rep-biased': 'repBiased'
    'click #least-voted': 'leastVoted'
    'click #most-voted': 'mostVoted'

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
      .sort sortUtil.order

    parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse

    margin =
      top: 30
      right: 10
      bottom: 10
      left: 10

    width = $("#chart").width() - margin.right - margin.left

    height = data.length * 12

    x = d3.scale
      .linear()
      .range [0, width]

    y = d3.scale.ordinal()
      .rangeRoundBands [0, height], .2

    makePositive = (x)->
      Math.abs x

    ticks = [-250, -200, -150, -100, -50 , 0, 50, 100, 150, 200, 250]


    buttons = [
      ['oldest', 'oldest'],
      ['newest', 'newest'],
      ['dem-total', 'most dem votes'],
      ['rep-total', 'most rep votes'],
      ['dem-biased', 'most dem weighted'],
      ['rep-biased', 'most rep weighted'],
      ['most-voted', 'most voted'],
      ['least-voted', 'least voted']
    ]

    buttonHolder = $("#bubbleChart")
    for pair in buttons
      buttonHolder.append("<button id=#{pair[0]}>#{pair[1]}</button>")

    console.log @$el

    xAxis = d3.svg.axis()
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
    console.log svg

    dems = data.map (el) ->
      el.demY
    reps = data.map (el) ->
      el.repY

    max = Math.max (d3.max dems), (d3.max reps)

    x.domain [ -max, max ]
      .nice();
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
            .attr 'class', 'bar republican'
            .attr 'height', (d) ->
              10
            .attr 'width', (d) ->
              Math.abs (x d.repY) - (x 0)
            .attr 'x', (d) ->
              x 0
          d3.select @
            .append 'rect'
            .attr 'class', 'bar democrat'
            .attr 'height', (d) ->
              10
            .attr 'width', (d) ->
              Math.abs (x d.demY) - (x 0)
            .attr 'x', (d) ->
              x -d.demY
          d3.select @
            .attr 'data-amdt', (d) ->
              d.amdt
            .attr 'transform', 'translate(' + 0 + ',' + i * 15 + ')'


    staticAxis
      .append 'g'
      .attr 'class', 'x axis'
      .call xAxis

    svg
      .append 'g'
        .attr 'class', 'y axis'
        .attr 'transform', 'translate(0, 0)'
      .append 'line'
        .attr 'x1', x 0
        .attr 'x2', x 0
        .attr 'y2', height
    @svg = svg


  showAmendmentData: (e) ->
    amendmentId = @$( e.currentTarget ).attr 'data-amdt'
    amendmentData = _.findWhere @model.get( 'votes' ), amendment_id: amendmentId
    @trigger 'showAmendmentData', amendmentData

  oldestFirst: (e) ->
    sortUtil.sortBy @svg, sortUtil.oldestFirst

  newestFirst: (e) ->
    sortUtil.sortBy @svg, sortUtil.newestFirst

  demTotal: (e) ->
    sortUtil.sortBy @svg, sortUtil.democratTotal

  repTotal: (e) ->
    sortUtil.sortBy @svg, sortUtil.republicanTotal

  demBiased: (e) ->
    sortUtil.sortBy @svg, sortUtil.democratDiff

  repBiased: (e) ->
    sortUtil.sortBy @svg, sortUtil.republicanDiff

  leastVoted: (e) ->
    sortUtil.sortBy @svg, sortUtil.noVote

  mostVoted: (e) ->
    sortUtil.sortBy @svg, sortUtil.mostVote

module.exports = ChartView
