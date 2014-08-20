class SearchResults extends Marionette.CompositeView
  tagName: 'div'
  className: 'search-results'
  template: require './search-results-view.jade'
  childView: require './result-view.coffee'
  childViewContainer: '.results-container'

  initialize: ->
    @on 'childview:bill:submit', ( data ) ->
      bill = data.model.get 'bill_id'
      billId = bill.slice( -3 ) + '-' + bill.slice( 0, -4 )
      @trigger 'bill:submit', billId
module.exports = SearchResults
