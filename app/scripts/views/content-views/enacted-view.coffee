_ = window._
util = require '../../helpers/graph-util.coffee'
# data = require './../../../../assets/data/enacted.json'
BubbleChart = require './../../helpers/bubble-chart.coffee'


class EnactedView extends Marionette.ItemView
  template: require './enacted-view.jade'
  model: "EnactedModel"
  id: "bubbleChart"


  events:
    'click circle': "showBillData"
    'click #combined': "combine"
    'click #byYear': 'byYear'
    'click #byParty': 'byParty'
    'mouseover [class~=bubble]': 'showDetails'
  
  initialize: ->
    @bills = @model.get 'bills'

  combine: ->
    BubbleChart.display_all()

  byParty: ->
    BubbleChart.display_party()

  byYear: ->
    BubbleChart.display_year()

  showDetails: (e) ->
    billId = @$(e.currentTarget).attr("data-bill")
    billData = _.findWhere @model.get( 'bills' ), bill_id: billId
    @trigger "showMeta", billData


  showBillData: (e) ->
    billId = JSON.stringify @$(e.currentTarget).attr("data-bill")
    @trigger 'showBill', billId 

  render: ->
    that = @
    $ ->

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
      BubbleChart.display_party = () =>
        chart.display_by_party()
      BubbleChart.transitionBill=() =>
        chart.transitionBill()
      BubbleChart.toggle_view = (view_type) =>
        if view_type == 'year'
          BubbleChart.display_year()
        else
          BubbleChart.display_all()
          
      #Render the chart
      render_vis that.bills


#     amendmentId = @$( e.currentTarget ).attr 'data-bill'
#     # amendmentData = _.findWhere @model.get( 'votes' ), amendment_id: amendmentId
#     # @trigger 'showAmendmentData', amendmentData

module.exports = EnactedView
