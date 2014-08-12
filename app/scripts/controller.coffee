# Require Views and Models
WelcomeView = require './views/welcome-view.coffee'
SearchView = require './views/search-view.coffee'
ContentLayout = require './views/content-views/content-layout.coffee'
ChartView = require './views/content-views/chart-view.coffee'
SearchResults = require './views/content-views/search-results-view.coffee'
MetaLayout = require './views/meta-views/meta-layout.coffee'
MetaView = require './views/meta-views/meta-view.coffee'
BillModel = require './models/bill-model.coffee'
BillsCollection = require './collections/bills-collection.coffee'


class MainController extends Marionette.Controller
  initialize: ( options ) ->
    # Shows loading spinner on init
    @showSpinner @options.regions.content 

  # Takes a region which it empties and attachs a loading spinner
  showSpinner: ( region ) ->
    region.empty()
    # Loading spinner is created on App
    region.$el.append App.spinner.el

  # Grabs data from NYT wrapper for a given bill Id ( congress - bill: '113-hr2397' )
  getData: ( billId )->
    deferred = new $.Deferred()
    # Check if the billId is stored in local storage
    if not window.localStorage.getItem billId
      # If not, create the model with the id
      billModel = new BillModel id: billId
      # Fetch the model to make a request to NYT wrapper
      billModel.fetch().then ( res ) ->
        window.localStorage.setItem billId, res
        # Resolve the promise with the model instance
        deferred.resolve( billModel )
    else
      # If the billId exists in local storage, create a new model with the
      # parse data and resolve the promise with it
      billModel = new BillModel JSON.parse window.localStorage.getItem billId
      deferred.resolve( billModel )

    deferred.promise()

  # Used to show a bills data when the billId is known
  showBill: ( id ) ->
    # Start the spinner in the content region
    @showSpinner @options.regions.content
    # Call for the bill model using the id
    @getData( id ).then ( billModel ) =>
      # Call to show all with the bill model
      @showAll billModel

  # Used to kick off the initial visualization before user bill selection
  home: ->
    # Parameters for the initial view bill
    currentCongress = 113
    firstBill = 'hr2397'
    firstBillId = currentCongress + '-' + firstBill

    #Show the bill data
    @showBill firstBillId 

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
  searchView: ( billModel ) ->
    # Create the search view with the billModel (bill model not currently used)
    searchView = new SearchView model: billModel
 
    # Listen to submit event on known bill number
    @listenTo searchView, 'findBill:submit', ( billId ) ->
      # Navigate to the address with the billId
      @router.navigate 'bills/' + billId, trigger: true

    # Listen to show Welcome view event on info button click
    @listenTo searchView, 'welcome:show', ->
      # Show the welcome view with the bill model
      @welcomeView searchView.model

    # Listen to search bills submit event
    @listenTo searchView, 'search:bills:submit', ( query ) ->
      # forward the query to searchResults
      @router.navigate 'bills/search/' + query, trigger: true
      # @searchResults( query )

    # Show the search view in the search region
    @options.regions.search.show searchView

  # Search for bills matching the query and display results
  searchResults: ( query ) ->
    # Start the spinner in the content region
    @showSpinner @options.regions.content
    
    # Set parameters and reference to this
    that = @
    billsCollection = 'unknown'
    searchResults = 'unknown'

    # Make a request for search results
    $.ajax
      url: 'http://omnibus-backend.azurewebsites.net/api/bills/search?q=' + query
      data: JSON
    .then ( data ) -> 
      # Parse the returned data
      data = JSON.parse( data ).results
      # Create a collection with the results
      billsCollection = new BillsCollection data
    .then ( data ) ->
      # Make composite view with bills collection
      searchResults = new SearchResults collection: billsCollection

      # Listen for click on itemView bill result
      that.listenTo searchResults, 'bill:submit', ( billId ) ->
        # Navigate to the address with the billId
        that.router.navigate 'bills/' + billId, { trigger: true }

      # Show composite view
      that.options.regions.content.show searchResults

  # Recreates content and search regions with new bill model
  showAll: ( billModel ) ->
    # Update view region with bill model
    @searchView billModel
 
    # Check local storage to see if the user has visited the site before
    if not window.localStorage.getItem 'omnibus-visited'
      # If not, show the welcome view and set the state to 'visited'
      @welcomeView billModel
      window.localStorage.setItem 'omnibus-visited', true
    
    # Populate the content region
    contentLayout = new ContentLayout
    @options.regions.content.show contentLayout

    chartView = new ChartView model: billModel
    contentLayout.chart.show chartView

    metaLayout = new MetaLayout
    contentLayout.meta.show metaLayout
    
    # Create all meta views
    sponsor = new MetaView model: billModel
    sponsorTwo = new MetaView model: billModel
    sponsorThree = new MetaView model: billModel
    metaLayout[ 'meta1' ].show sponsor
    metaLayout[ 'meta2' ].show sponsorTwo
    metaLayout[ 'meta3' ].show sponsorThree
    


module.exports = MainController
