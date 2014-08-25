# Assign bare Model, Collection, View to Backbone primitives.
{ Model, Collection, View } = Backbone

# Keep these in alphabetical order!
#
# Views
AboutView = require './views/about-view.coffee'
AmendInfoView = require './views/meta-views/meta-amend-info-view.coffee'
AmendPieView = require './views/meta-views/meta-amend-pie-view.coffee'
AmendView = require './views/meta-views/meta-amend-view.coffee'
BillHoverView = require './views/meta-views/meta-bill-hover-view.coffee'
ChartView = require './views/content-views/chart-view.coffee'
ContentLayout = require './views/content-views/content-layout.coffee'
ControlView = require './views/control-view.coffee'
EnactedView = require './views/content-views/enacted-view.coffee'
EnactedAggView = require './views/meta-views/meta-enacted-agg-view.coffee'
MetaInfoView = require './views/meta-views/meta-info-view.coffee'
MetaLayout = require './views/meta-views/meta-layout.coffee'
SearchResults = require './views/content-views/search-results-view.coffee'
SearchView = require './views/search-view.coffee'

# Models
AmendInfoModel = require './models/meta-amend-info-model.coffee'
BillModel = require './models/bill-model.coffee'
EnactedModel = require './models/enacted-model.coffee'

# Collections
BillsCollection = require './collections/bills-collection.coffee'


class MainController extends Marionette.Controller
  initialize: ( options ) ->

  # Takes a region which it empties and attachs a loading spinner
  showSpinner: ( region ) ->
    region.empty()
    region.$el.append App.spinner.el

  setUpButtonView: ( buttons ) ->
    buttons = new Model buttons: buttons
    controlView = new ControlView model: buttons
    @options.regions.content.currentView.controls.show controlView
    @listenTo controlView, "buttonClick", ( id ) =>
      @options.regions.content.currentView.chart.currentView.trigger "buttonClick", id

  # Used to kick off the initial visualization before user bill selection
  home: ->
    if $( '#search' ).children().length is 0
    then @searchView()
    contentLayout = new ContentLayout
    @options.regions.content.show contentLayout
    $( '#chart' ).append App.spinner.el

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
        @setUpButtonView ['allBills', 'byCongress', 'asTimeline']

  makeEnactedMeta: ( model ) ->
    chartView = @options.regions.content.currentView
    metaLayout = new MetaLayout
    chartView.meta.show metaLayout

    @listenTo chartView.chart.currentView, 'showBill', ( billId ) ->
      @router.navigate 'bills/' + billId, trigger: true

    @listenTo chartView.chart.currentView, 'showMeta', ( data ) ->
      return metaLayout['meta2'].show new MetaInfoView() unless data
      metaLayout[ 'meta2' ].show @makeBillHover data

    metaLayout[ 'meta2' ].show @makeBillHover()
    metaLayout[ 'meta1' ].show @makeEnactedAggregate model


  makeBillHover: ( hoverData ) ->
    if hoverData
      billHoverModel = new Model data: hoverData
      billHoverView = new BillHoverView model: billHoverModel
    else
      amendModel = new Model
      billHoverView = new MetaInfoView model: amendModel
    billHoverView

  makeEnactedAggregate: ( model ) ->
    enactedAggView = new EnactedAggView model: model


  # Used to show a bills data when the billId is known
  showBill: ( billId ) ->
    if $( '#search' ).children().length is 0
    then @searchView()
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
    # if not window.localStorage.getItem 'omnibus-visited'
    #   @welcomeView billModel
    #   window.localStorage.setItem 'omnibus-visited', true

    chartView = new ChartView model: billModel
    if not @options.regions.content.currentView
      contentLayout = new ContentLayout
      @options.regions.content.show contentLayout
    @options.regions.content.currentView.chart.show chartView
    @makeBillMeta billModel, billId
    @setUpButtonView [ 'mostDemVotes', 'mostRepVotes', 'mostDemWeighted', 'mostRepWeighted', 'leastSupported', 'mostSupported' ]


  makeBillMeta: ( model, billId ) ->
    chartView = @options.regions.content.currentView
    metaLayout = new MetaLayout
    chartView.meta.show metaLayout
    metaLayout[ 'meta2' ].show @makeAmendHover()
    metaLayout[ 'meta1' ].show @makeAmendHover()
    # metaLayout[ 'meta1' ].show @makeAmendAggregate model, billId

    @listenTo chartView.chart.currentView, 'showAmendmentData', (data) ->
      metaLayout[ 'meta2' ].show @makeAmendHover data
      # metaLayout[ 'meta1' ].show @makeAmendAggregate model, billId
      metaLayout[ 'meta1' ].show @makeAmendPie data

  makeAmendPie: ( data ) ->
    amendPieModel = new Model votes: data
    amendPieView = new AmendPieView model: amendPieModel
    amendPieView


  # Pass ammendment data in and create a model/view with it
  # Returns jQuery promise for consistency
  makeAmendHover: ( amendData ) ->
    if amendData
      amendModel = new Model data: amendData
      amendView = new AmendView model: amendModel
    else
      amendModel = new Model
      amendView = new MetaInfoView model: amendModel
      amendView

  makeAmendAggregate: ( model, billId ) ->
    amendInfoView = new AmendInfoView model: model
    amendInfoView

  # Displays the welcome view to new users
  # welcomeView: ( billModel ) ->
  #   # Create the welcome view with the billModel (billModel not currently used)
  #   welcomeView = new WelcomeView model: billModel
  #   # Hide the information button on search view
  #   $('#information').hide()

  #   # Empty the region when the user closes it
  #   @listenTo welcomeView, 'welcome:close', ->
  #     @options.regions.welcome.empty()
  #     # Show the information button in the search view
  #     $('#information').show()

  #   # Show the welcome vew in the welcome region
  #   @options.regions.welcome.show welcomeView

  # Initiates the Search view and
  searchView: ( ) ->

    searchView = new SearchView

    # Listen to submit event on known bill number
    @listenTo searchView, 'findBill:submit', ( billId ) ->
      @router.navigate 'bills/' + billId, trigger: true

    # Listen to show Welcome view event on info button click
    # @listenTo searchView, 'welcome:show', ->
    #   @welcomeView searchView.model

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

  showAbout: ->
    @options.regions.search.empty()
    aboutView = new AboutView()
    @options.regions.content.show aboutView

module.exports = MainController
