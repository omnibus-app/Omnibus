_ = window._
util = require '../../helpers/graph-util.coffee'
data = require './../../../../assets/data/enacted.json'
BubbleChart = require './../../helpers/bubble-chart.coffee'


class EnactedView extends Marionette.ItemView
  template: require './enacted-view.jade'
  model: "EnactedModel"
  id: "bubbleChart"

  events:
    'click [class~=bubble]': "fun"
  
  initialize: ->
    console.log @el
    
    

    fun: ->
      console.log 'hey'


    # this.d3 = d3.select(this.el)
    showBillData: (e) ->
      console.log e
      console.log 'hey'

  render: ->
    $ ->

      chart = null

      render_vis = (json) ->
        chart = new BubbleChart json
        chart.start()
        BubbleChart.display_all()
      BubbleChart.display_all = () =>
        chart.display_group_all()
      BubbleChart.display_year = () =>
        chart.display_by_year()
      BubbleChart.transitionBill=() =>
        chart.transitionBill()
      BubbleChart.toggle_view = (view_type) =>
        if view_type == 'year'
          BubbleChart.display_year()
        else
          BubbleChart.display_all()
          
      #Render the chart
      render_vis data 

#     ar = d3.select('data-bill-id')
#     console.log ar


#     amendmentId = @$( e.currentTarget ).attr 'data-bill'
#     # amendmentData = _.findWhere @model.get( 'votes' ), amendment_id: amendmentId
#     # @trigger 'showAmendmentData', amendmentData

module.exports = EnactedView
