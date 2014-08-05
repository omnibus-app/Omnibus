MainRouter = require './router'
MainController = require './controller'

App = new Backbone.Marionette.Application()

App.addRegions
  info: '#info'
  search: '#search'
  chart: '#chart'
  meta: '#meta'

App.addInitializer ( data ) =>
  # Add router
  router = new MainRouter()

  # Add controller - This is mainly for doing the dirty work of the router
  controller = new MainController
    router: router
    regions:
      info: this.info
      search: this.search
      chart: this.chart
      meta: this.meta


  # Add appRoutes using processAppRoutes which will delegate to the controller
  # for route functions
  router.processAppRoutes controller,
  # routes will go here
    'bill/:id': 'showBill'



  # Start backbone history after init
App.on 'initialize:after', ( options ) ->
  # pushState set to true to eliminate '#'

  if Backbone.history then Backbone.history.start pushState: true



module.exports = App
