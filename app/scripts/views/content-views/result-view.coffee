class ResultView extends Marionette.ItemView
  tagName: 'li'
  id: 'bill-result'
  template: require './result-view.jade'
  events: 
    'click': 'billResult'
    
  billResult: ->
    @trigger 'bill:submit'

module.exports = ResultView