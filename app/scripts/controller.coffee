# Require Views and Models

class MainController extends Marionette.Controller
  initialize: ( options ) ->
    @router = options.router
    @regions = options.regions

  showBill: ->
    # ?? Fetch model with bill_Id

    # Make view with Model
    # Listen for events

    # Show view in a region
    # Navigate to route

module.exports = MainController
