class VoteModel extends Backbone.Model
  initialize: ( options ) ->
    @url = 'http://omnibus-backend.azurewebsites.net/api/votes/bill' + 
      options.id + '/votes'

  urlRoot: @url


  parse: ( response ) ->
    data = {}
    data.results = JSON.parse response
    console.log data.results

module.exports = VoteModel