

class Search extends Marionette.ItemView
  template: require './search-view.jade'

  initialize: ->

  events: 
    'click .find-bill': 'findBill'
    'click .information': 'welcomeShow'

  findBill: (e) ->
    e.preventDefault()
    billId = @$el.find('.search-input').val()
    @trigger 'findBill:submit', billId

  welcomeShow: (e) ->
    e.preventDefault()
    @trigger 'welcome:show'

module.exports = Search