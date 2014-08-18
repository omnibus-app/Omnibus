class SubjectsModel extends Backbone.Model
  initialize: ( options ) ->
    @url = 'http://omnibus-backend.azurewebsites.net/api/bills/' +
    options.id + 
    '/subjects'

  urlRoot: @url

  parse: ( response ) ->
    data = {}
    data.results = JSON.parse response

module.exports = SubjectsModel