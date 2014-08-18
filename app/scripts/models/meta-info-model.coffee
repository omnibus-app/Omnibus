class InfoModel extends Backbone.Model
  urlRoot: 'http://omnibus-backend.azurewebsites.net/api/bills/'
  parse: ( response ) ->
    data = {}
    data.results = JSON.parse response

module.exports = InfoModel