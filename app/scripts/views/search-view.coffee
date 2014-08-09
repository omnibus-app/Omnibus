class Search extends Marionette.ItemView
  template: require './search-view.jade'

  initialize: ->

  events: 
    'click #find-bill': 'findBill'
    'click #information': 'welcomeShow'
    'click #search-bills': 'searchBills'

  findBill: (e) ->
    e.preventDefault()
    billId = @$el.find('#congress').val() + '-' +
      @$el.find('#bill-number').val()
    @trigger 'findBill:submit', billId

  welcomeShow: (e) ->
    e.preventDefault()
    @trigger 'welcome:show'

  searchBills: (e) ->
    e.preventDefault()
    query = @$el.find('#find-input').val()
    @trigger 'search:bills:submit', query

module.exports = Search