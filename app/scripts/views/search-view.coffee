class Search extends Marionette.ItemView
  template: require './search-view.jade'

  initialize: ->

  events: 
    'click .find-bill': 'findBill'

  findBill: (e) ->
    e.preventDefault()
    billId = @$el.find('.search-input').val()
    @trigger 'findBill:submit', billId

module.exports = Search