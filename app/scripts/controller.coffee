# Require Views and Models
WelcomeView = require './views/welcome-view.coffee'
SearchView = require './views/search-view.coffee'
ContentLayout = require './views/content-views/content-layout.coffee'
ChartView = require './views/content-views/chart-view.coffee'
SearchResults = require './views/content-views/search-results-view.coffee'
MetaLayout = require './views/meta-views/meta-layout.coffee'
BillModel = require './models/bill-model.coffee'
BillsCollection = require './collections/bills-collection.coffee'
SubjectsView = require './views/meta-views/meta-subjects-view.coffee'
SubjectsModel = require './models/meta-subjects-model.coffee'
InfoView = require './views/meta-views/meta-info-view.coffee'
InfoModel = require './models/meta-info-model.coffee'
AmendView = require './views/meta-views/meta-amend-view.coffee'
AmendEmptyView = require './views/meta-views/meta-amend-info-view.coffee'
AmendModel = require './models/meta-amend-model.coffee'
EnactedView = require './views/content-views/enacted-view.coffee'
EnactedModel = require './models/enacted-model.coffee'


class MainController extends Marionette.Controller
  initialize: ( options ) ->
    @searchView()
    contentLayout = new ContentLayout
    @options.regions.content.show contentLayout
    @showSpinner contentLayout.chart

  # Takes a region which it empties and attachs a loading spinner
  showSpinner: ( region ) ->
    region.empty()
    region.$el.append App.spinner.el

  # Used to kick off the initial visualization before user bill selection
  home: ->
    base = 'http://omnibus-backend.azurewebsites.net/api/congress/'
    congressOne = $.ajax base + '111/enacted'
    congressTwo = $.ajax base + '112/enacted'
    congressThree = $.ajax base + '113/enacted'

    $.when congressOne, congressTwo, congressThree
      .done ( dataOne, dataTwo, dataThree ) =>
        data = [].concat dataThree[ 0 ], dataTwo[ 0 ], dataOne[ 0 ]
        enactedModel = new EnactedModel bills: data
        enactedView = new EnactedView model: enactedModel
        @options.regions.content.currentView.chart.show enactedView
        @makeEnactedMeta enactedModel
        enactedView.render()


    # Make Meta

  makeEnactedMeta: ( model ) ->
    metaLayout = new MetaLayout
    @options.regions.content.currentView.meta.show metaLayout


  
  # makeBillHover: ( amendData ) ->
  #   deferred = new $.Deferred()
  #   if amendData
  #     amendModel = new AmendModel data: amendData
  #     amendView = new AmendView model: amendModel
  #   else
  #     amendModel = new AmendModel
  #     amendView = new AmendEmptyView model: amendModel

  #   deferred.resolve amendView
  #   deferred.promise()

  # makeBillAggregate: ( billId ) ->
  #   deferred = new $.Deferred()
  #   infoModel = new InfoModel id: billId
  #   infoModel.fetch().then ->
  #     infoView = new InfoView model: infoModel
  #     deferred.resolve infoView

  #   deferred.promise()

    


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
        console.log res
        window.localStorage.setItem billId, JSON.stringify res
        # Resolve the promise with the model instance
        deferred.resolve billModel
    else
      # If the billId exists in local storage, create a new model with the
      # parse data and resolve the promise with it
      console.log JSON.parse window.localStorage.getItem billId
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

    @makeAmendAggregate billId
      .then ( metaView ) ->
        metaLayout[ 'meta2' ].show metaView

  # Pass ammendment data in and create a model/view with it
  # Returns jQuery promise for consistency
  makeAmendHover: ( amendData ) ->
    deferred = new $.Deferred()
    if amendData
      amendModel = new AmendModel data: amendData
      amendView = new AmendView model: amendModel
    else
      amendModel = new AmendModel
      amendView = new AmendEmptyView model: amendModel

    deferred.resolve amendView
    deferred.promise()

  makeAmendAggregate: ( billId ) ->
    deferred = new $.Deferred()
    infoModel = new InfoModel id: billId
    infoModel.fetch().then ->
      infoView = new InfoView model: infoModel
      deferred.resolve infoView

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
