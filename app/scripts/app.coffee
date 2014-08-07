MainRouter = require './router.coffee'
MainController = require './controller.coffee'
WelcomeView = require './views/welcome-view.coffee'
SearchView = require './views/search-view.coffee'
ContentLayout = require './views/content-layout.coffee'
MetaLayout = require './views/meta-layout.coffee'
ChartView = require './views/chart-view.coffee'
MetaView = require './views/meta-view.coffee'
BillModel = require './models/bill-model.coffee'

App = new Backbone.Marionette.Application()

App.addRegions
  welcome: '#welcome'
  search: '#search'
  content: '#content'

App.addInitializer ( options ) ->
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

  # Set initial bill model
  billModel = new BillModel id: '113-hr2397'
  
  # fetch the model and set views on completion
  billModel.fetch().then =>
    welcomeView = new WelcomeView model: billModel
    @welcome.show welcomeView 

    searchView = new SearchView
    @search.show searchView

    contentLayout = new ContentLayout
    @content.show contentLayout

    chartView = new ChartView model: billModel
    contentLayout.chart.show chartView

    metaLayout = new MetaLayout
    contentLayout.meta.show metaLayout
    
    sponsor = new MetaView model: billModel
    sponsorTwo = new MetaView model: billModel
    sponsorThree = new MetaView model: billModel
    metaLayout[ 'meta1' ].show sponsor
    metaLayout[ 'meta2' ].show sponsorTwo
    metaLayout[ 'meta3' ].show sponsorThree


  # Start backbone history after init
App.on 'initialize:after', ( options ) ->
  # pushState set to true to eliminate '#'
  if Backbone.history then Backbone.history.start pushState: true

window.App = App

module.exports = App

