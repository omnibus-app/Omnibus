MainRouter = require './router'
MainController = require './controller'

App = new Backbone.Marionette.Application()

App.addRegions
  info: '#info'
  search: '#search'
  chart: '#chart'
  meta: '#meta'


App.addInitializer ( options ) =>
  @router = new MainRouter
    controller: new MainController
      regions:
        info: @info
        search: @search
        chart: @chart
        meta: @meta
    appRoutes: 
      'bill/:id': 'showBill'
  console.log @router
  console.log App

  # Start backbone history after init
App.on 'initialize:after', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start pushState: true

module.exports = App

