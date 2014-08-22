class Search extends Marionette.ItemView
  template: require './search-view.jade'
  className: 'search-view'

  initialize: ->

  events:
    'click #find-bill': 'findBill'
    'click #information': 'welcomeShow'
    'click #search-bills': 'searchBills'
    'keypress #congress': 'congressSubmit'
    'keypress #bill-number': 'billSubmit'
    'keypress #find-input': 'searchSubmit'

  findBill: (e) ->
    e.preventDefault()
    @trigger 'findBill:submit', @billId()
    @clearData()

  welcomeShow: (e) ->
    e.preventDefault()
    @trigger 'welcome:show'

  searchBills: (e) ->
    e.preventDefault()
    query = @$el.find('#find-input').val()
    @trigger 'search:bills:submit', query
    @clearData()

  congressSubmit: (e) ->
    bill = @$( '#bill-number' ).val()
    congress = @$( '#congress' ).val()
    if e.which is 13 and bill and congress
      @trigger 'findBill:submit', @billId()
      @clearData()

  billSubmit: (e) ->
    congress = @$( '#congress' ).val()
    bill = @$( '#bill-number' ).val()
    if e.which is 13 and congress and bill
      @trigger 'findBill:submit', @billId()
      @clearData()

  searchSubmit: (e) ->
    query = @$( '#find-input' ).val()
    if e.which is 13 and query
      @trigger 'search:bills:submit', query
      @clearData()

  billId: () ->
    @$( '#congress' ).val() + '-' + @$( '#bill-number' ).val()
  clearData: () ->
    @$( '#congress' ).val('')
    @$( '#bill-number' ).val('')
    @$( '#find-input' ).val('')

module.exports = Search
