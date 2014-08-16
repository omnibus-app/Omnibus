MainController = require './controller.coffee'

App = new Backbone.Marionette.Application()

App.addRegions
  welcome: '#welcome'
  search: '#search'
  content: '#content'

App.spinnerOptions =
    radius: 30, lines: 22, length:16, speed: .75

# App.spinner = new Spinner @spinnerOptions
App.spinner = new Spinner @spinnerOptions
 .spin()

# App.addInitializer ( options ) ->
App.on 'before:start', ( options ) ->
  @controller = new MainController
    regions:
      welcome: @welcome
      search: @search
      content: @content
  @router = new Marionette.AppRouter
    controller: @controller
    appRoutes: 
      '': 'home'
      'bills/:id': 'showBill'
      'bills/search/:query': 'searchResults'
  @controller.router = @router


  # Start backbone history after init
App.on 'start', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start pushState: true


window.App = App

module.exports = App
