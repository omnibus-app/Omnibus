class ResultView extends Marionette.ItemView
  tagName: 'li'
  className: 'bill-result'
  template: require './result-view.jade'
  events:
    'click': 'billResult'

  billResult: ->
    @trigger 'bill:submit'

module.exports = ResultView
