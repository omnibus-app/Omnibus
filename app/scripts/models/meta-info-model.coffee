class InfoModel extends Backbone.Model
  urlRoot: 'http://omnibus-backend.azurewebsites.net/api/bills/'
  parse: ( response ) ->
    JSON.parse response

module.exports = InfoModel