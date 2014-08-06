MainRouter = require './router'
MainController = require './controller'

App = new Backbone.Marionette.Application()

App.addRegions
  info: '#info'
  search: '#search'
  chart: '#chart'
  meta: '#meta'


App.addInitializer ( options ) =>
  # Add router

  # Add controller - This is mainly for doing the dirty work of the router
  @router = new MainRouter
    controller: new MainController
      regions:
        info: this.info
        search: this.search
        chart: this.chart
        meta: this.meta
    appRoutes: 
      'bill/:id': 'showBill'


  # Start backbone history after init
App.on 'initialize:after', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start pushState: true

module.exports = App

