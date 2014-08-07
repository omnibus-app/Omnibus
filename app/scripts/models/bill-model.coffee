class BillModel extends Backbone.Model
  urlRoot: 'http://omnibus-backend.azurewebsites.net/api/bills/'
  initialize: (id) ->
    @id = id;
    # @_when = @when( @getAmendments(), @getVotes() )

  then: (callback) ->
  	@_when.then( callback )
  	@

  getAmendments: ->
  	$.ajax( "/api/bills/#{ @id }/amendments" ).then ( data ) =>
  		@amendments = new Amendments( data.results )

  getVotes: ->
  	$.ajax( "/api/bills/#{ @id }/votes" ).then ( data ) =>
  		@votes = new Votes( data.results )

  parse: ( response ) ->
    data = {}
    data.results = JSON.parse response

module.exports = BillModel