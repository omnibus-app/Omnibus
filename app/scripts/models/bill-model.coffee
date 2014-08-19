class BillModel extends Backbone.Model
  initialize: ( options ) ->
    @url = 'http://omnibus-backend.azurewebsites.net/api/bills/' +
      options.id + '/votes'

  urlRoot: @url


  parse: ( response ) ->
    data = {}
    data.votes = response
    data

module.exports = BillModel
