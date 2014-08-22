# Require Views and Models
WelcomeView = require './views/welcome-view.coffee'
SearchView = require './views/search-view.coffee'
ContentLayout = require './views/content-views/content-layout.coffee'
ChartView = require './views/content-views/chart-view.coffee'
SearchResults = require './views/content-views/search-results-view.coffee'
MetaLayout = require './views/meta-views/meta-layout.coffee'
BillModel = require './models/bill-model.coffee'
BillsCollection = require './collections/bills-collection.coffee'
AmendInfoView = require './views/meta-views/meta-amend-info-view.coffee'
AmendInfoModel = require './models/meta-amend-info-model.coffee'
AmendView = require './views/meta-views/meta-amend-view.coffee'
MetaInfoView = require './views/meta-views/meta-info-view.coffee'
AmendModel = require './models/meta-amend-model.coffee'
EnactedView = require './views/content-views/enacted-view.coffee'
EnactedModel = require './models/enacted-model.coffee'
BillHoverModel = require './models/meta-bill-hover-model.coffee'
BillHoverView = require './views/meta-views/meta-bill-hover-view.coffee'
EnactedAggView = require './views/meta-views/meta-enacted-agg-view.coffee'
EnactedAggModel = require './models/meta-enacted-agg-model.coffee'


class MainController extends Marionette.Controller
  initialize: ( options ) ->
    @searchView()

  # Takes a region which it empties and attachs a loading spinner
  showSpinner: ( region ) ->
    region.empty()
    region.$el.append App.spinner.el

  # Used to kick off the initial visualization before user bill selection
  home: ->
    contentLayout = new ContentLayout
    @options.regions.content.show contentLayout
    $('#chart').append App.spinner.el

    base = 'http://omnibus-backend.azurewebsites.net/api/congress/'
    congressOne = $.ajax base + '111/enacted'
    congressTwo = $.ajax base + '112/enacted'
    congressThree = $.ajax base + '113/enacted'

    $.when congressOne, congressTwo, congressThree
      .done ( dataOne, dataTwo, dataThree ) =>
        data = [].concat dataOne[ 0 ], dataTwo[ 0 ], dataThree[ 0 ]
        enactedModel = new EnactedModel bills: data
        enactedView = new EnactedView model: enactedModel
        @options.regions.content.currentView.chart.show enactedView
        enactedView.render()
        @makeEnactedMeta enactedModel


  makeEnactedMeta: ( model ) ->
    chartView = @options.regions.content.currentView
    metaLayout = new MetaLayout
    chartView.meta.show metaLayout

    @listenTo chartView.chart.currentView, 'showBill', ( billId ) ->
      @router.navigate 'bills/' + billId, trigger: true

    @listenTo chartView.chart.currentView, 'showMeta', ( data ) ->
      @makeBillHover data
        .then ( billView ) ->
          metaLayout[ 'meta1' ].show billView

    @makeBillHover()
      .then ( billView ) ->
        metaLayout[ 'meta1' ].show billView

    @makeEnactedAggregate model
      .then ( metaView ) ->
        metaLayout[ 'meta2' ].show metaView


  
  makeBillHover: ( hoverData ) ->
    deferred = new $.Deferred()
    if hoverData
      billHoverModel = new BillHoverModel data: hoverData
      billHoverView = new BillHoverView model: billHoverModel
    else
      amendModel = new AmendModel
      billHoverView = new MetaInfoView model: amendModel

    deferred.resolve billHoverView
    deferred.promise()

  makeEnactedAggregate: ( model ) ->
    deferred = new $.Deferred()
    # enactedAggModel = new EnactedAggModel data: data
    enactedAggView = new EnactedAggView model: model
    deferred.resolve enactedAggView

    deferred.promise()
    
  # Used to show a bills data when the billId is known
  showBill: ( billId ) ->
    @showSpinner @options.regions.content
    @getData( billId ).then ( billModel ) =>
      @makeBill billModel, billId

  # Grabs data from NYT wrapper for a given bill Id ( congress - bill: '113-hr2397' )
  getData: ( billId )->
    deferred = new $.Deferred()
    # Check if the billId is stored in local storage
    if not window.localStorage.getItem billId
      # If not, create the model with the id
      billModel = new BillModel id: billId
      # Fetch the model to make a request to NYT wrapper
      billModel.fetch().then ( res ) ->
        window.localStorage.setItem billId, JSON.stringify res
        # Resolve the promise with the model instance
        deferred.resolve billModel
    else
      # If the billId exists in local storage, create a new model with the
      # parse data and resolve the promise with it
      billModel = new BillModel votes: JSON.parse window.localStorage.getItem billId
      deferred.resolve billModel

    deferred.promise()

  # Recreates content and search regions with new bill model
  makeBill: ( billModel, billId ) ->
    # Check local storage to see if the user has visited the site before
      # If not, show the welcome view and set the state to 'visited'
    if not window.localStorage.getItem 'omnibus-visited'
      @welcomeView billModel
      window.localStorage.setItem 'omnibus-visited', true

    chartView = new ChartView model: billModel
    if not @options.regions.content.currentView
      contentLayout = new ContentLayout
      @options.regions.content.show contentLayout
    @options.regions.content.currentView.chart.show chartView

    @makeBillMeta billModel, billId

  makeBillMeta: ( model, billId ) ->
    chartView = @options.regions.content.currentView
    metaLayout = new MetaLayout
    chartView.meta.show metaLayout

    @listenTo chartView.chart.currentView, 'showAmendmentData', (data) ->
      @makeAmendHover data
        .then ( amendView ) ->
          metaLayout[ 'meta1' ].show amendView

    @makeAmendHover()
      .then ( amendView ) ->
        metaLayout[ 'meta1' ].show amendView

    @makeAmendAggregate model, billId
      .then ( metaView ) ->
        metaLayout[ 'meta2' ].show metaView
        # metaView.render()

  # Pass ammendment data in and create a model/view with it
  # Returns jQuery promise for consistency
  makeAmendHover: ( amendData ) ->
    deferred = new $.Deferred()
    if amendData
      amendModel = new AmendModel data: amendData
      amendView = new AmendView model: amendModel
    else
      amendModel = new AmendModel
      amendView = new MetaInfoView model: amendModel

    deferred.resolve amendView
    deferred.promise()

  makeAmendAggregate: ( model, billId ) ->
    deferred = new $.Deferred()
    amendInfoView = new AmendInfoView model: model
    # amendInfoView.render()
    deferred.resolve amendInfoView    

    deferred.promise()


  # Displays the welcome view to new users
  welcomeView: ( billModel ) ->
    # Create the welcome view with the billModel (billModel not currently used)
    welcomeView = new WelcomeView model: billModel
    # Hide the information button on search view
    $('#information').hide()

    # Empty the region when the user closes it
    @listenTo welcomeView, 'welcome:close', ->
      @options.regions.welcome.empty()
      # Show the information button in the search view
      $('#information').show()

    # Show the welcome vew in the welcome region
    @options.regions.welcome.show welcomeView

  # Initiates the Search view and
  searchView: ( ) ->

    searchView = new SearchView

    # Listen to submit event on known bill number
    @listenTo searchView, 'findBill:submit', ( billId ) ->
      @router.navigate 'bills/' + billId, trigger: true

    # Listen to show Welcome view event on info button click
    @listenTo searchView, 'welcome:show', ->
      @welcomeView searchView.model

    # Listen to search bills submit event
    @listenTo searchView, 'search:bills:submit', ( query ) ->
      @router.navigate 'bills/search/' + query, trigger: true

    # Show the search view in the search region
    @options.regions.search.show searchView

  # Search for bills matching the query and display results
  searchResults: ( query ) ->
    # Start the spinner in the content region
    @showSpinner @options.regions.content

    billsCollection = new BillsCollection query: query
    billsCollection.fetch().then =>
      searchResults = new SearchResults collection: billsCollection

      @listenTo searchResults, 'bill:submit', ( billId ) ->
        @router.navigate 'bills/' + billId, { trigger: true }

      @options.regions.content.show searchResults


module.exports = MainController
