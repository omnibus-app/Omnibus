_ = window._
util = require '../../helpers/graph-util.coffee'
BubbleChart = require './../../helpers/bubble-chart.coffee'


class EnactedView extends Marionette.ItemView
  template: require './enacted-view.jade'
  model: "EnactedModel"
  id: "bubbleChart"


  events:
    'click circle': "showBillData"
    'mouseout circle': 'hideDetails'
    'mouseover [class~=bubble]': 'showDetails'

  initialize: ->
    @bills = @model.get 'bills'
    @on "buttonClick", ( method ) =>
      @[method]()

    $("#axis").remove()

  allBills: ->
    BubbleChart.display_all()

  byCongress: ->
    BubbleChart.display_year()

  asTimeline: ->
    BubbleChart.display_timeline()

  showDetails: (e) ->
    billId = @$(e.currentTarget).attr("data-bill")
    billData = _.findWhere @model.get( 'bills' ), bill_id: billId
    @trigger "showMeta", billData

  hideDetails: ->
    @trigger "showMeta", null

  showBillData: (e) ->
    target = $ e.currentTarget
    return if target.is ".unanimous-consent"
    billId = target.attr("data-bill")
    billId = billId.slice( -3 ) + '-' + billId.slice( 0, -4 )
    @trigger 'showBill', billId
    d3.selectAll("circle").remove()

  render: ->
    $ =>

      chart = null

      render_vis = (json) ->
        chart = new BubbleChart json
        chart.start()
        BubbleChart.display_all()
      BubbleChart.display_all = () =>
        chart.display_group_all()
      BubbleChart.show_details = (e) =>
        chart.show_details(e)
      BubbleChart.display_year = () =>
        chart.display_by_year()
      BubbleChart.display_timeline = () =>
        chart.display_timeline()
      BubbleChart.transitionBill=() =>
        chart.transitionBill()
      # BubbleChart.toggle_view = (view_type) =>
      #   if view_type == 'year'
      #     BubbleChart.display_year()
      #   else
      #     BubbleChart.display_all()

      #Render the chart
      render_vis @bills

      window.bubble = @


module.exports = EnactedView
