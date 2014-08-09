class SearchResults extends Marionette.CompositeView
  template: require './search-results-view.jade'
  childView: require './result-view.coffee'
  childViewContainer: '.results-container'

  initialize: ->
    @on 'childview:bill:submit', ( data ) ->
      congress = data.model.get 'congress'
      type = data.model.get 'bill_type'
      number = data.model.get 'number'
      billId = congress + '-' + type + number
      @trigger 'bill:submit', billId
module.exports = SearchResults
