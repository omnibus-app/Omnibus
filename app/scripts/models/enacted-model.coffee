class EnactedModel extends Backbone.Model
  initialize: ( options ) ->
    @url = 'http://omnibus-backend.azurewebsites.net/api/congress/' +
      options.id + '/enacted'

  urlRoot: @url


  parse: ( response ) ->
    data = {}
    data.votes = response
    data

module.exports = EnactedModel
