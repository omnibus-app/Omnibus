MainRouter = require './router'
MainController = require './controller'

class App extends Backbone.Marionette.Application

# Add the regions with a selector - Names are TBD
App.addRegions {
  search: '#search',
  chart: '#chart',
  sideData: '#sideData'
}

App.addInitializer ( data ) =>
  # Add router
  @router = new MainRouter()

  # Add controller - This is mainly for doing the dirty work of the router
  @controller = new MainController()

  # Add appRoutes using processAppRoutes which will delegate to the controller
  # for route functions
  @router.processAppRoutes @controller, {
    # routes will go here
    # 'this/route': 'doThis'
  }

# Start backbone history after init
App.on 'initialize:after', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start({ pushState: true })

module.exports = App
