
# Require Views and Models


MainController = new Marionette.controller.extend {
  initialize: ( options ) ->
    @router = options.router
    @regions = options.regions

  showBill: ->
    # ?? Fetch model with bill_Id

    # Make view with Model
    # Listen for events

    # Show view in a region
    # Navigate to route
}