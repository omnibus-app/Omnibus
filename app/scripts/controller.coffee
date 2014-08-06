# Require Views and Models


class MainController extends Marionette.Controller
  initialize: ( options ) ->
    @router = options.router
    @regions = options.regions

  showBill: ( id ) ->
    # ?? Fetch model with bill_Id
    billModel = new BillModel
      id: id

    # Make view with Model
    # Listen for events
    billView = new billView
      model: billModel

    # Show view in a region
    # Navigate to route


module.exports = MainController
