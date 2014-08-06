MainRouter = require './router.coffee'
MainController = require './controller.coffee'
WelcomeView = require './views/welcome-view.coffee'
SearchView = require './views/search-view.coffee'
ContentLayout = require './views/content-layout.coffee'
MetaLayout = require './views/meta-layout.coffee'
BillModel = require './models/bill-model.coffee'


App = new Backbone.Marionette.Application()

currentCongress = 113
firstBill = 'hr2390'

App.addRegions
  welcome: '#welcome'
  search: '#search'
  content: '#content'

App.addInitializer ( options ) ->
  console.log @
  @router = new MainRouter
    controller: new MainController
      regions:
        welcome: @welcome
        search: @search
        content: @content
    appRoutes: 
      'bill/:id': 'showBill'


# Store initial billModel in local storage for quick retrieval
  # window.localStorage.setItem
  #   currentCongress + firstBill,
  #   new BillModel id: currentCongress + firstBill
  welcomeView = new WelcomeView
  @welcome.show welcomeView 

  searchView = new SearchView
  @search.show searchView

  contentLayout = new ContentLayout
  @content.show contentLayout

  metaLayout = new MetaLayout

  contentLayout.meta.show metaLayout


  # Start backbone history after init
App.on 'initialize:after', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start pushState: true

window.App = App

module.exports = App

