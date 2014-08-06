MainController = require './controller.coffee'

App = new Backbone.Marionette.Application()

currentCongress = 113
firstBill = 'hr2397'
firstBillId = currentCongress + '-' + firstBill

App.addRegions
  welcome: '#welcome'
  search: '#search'
  content: '#content'

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
      'bill/:id': 'showBill'


  # Start backbone history after init
App.on 'start', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start pushState: true


window.App = App

module.exports = App

