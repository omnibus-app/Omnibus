# Require Views and Models
WelcomeView = require './views/welcome-view.coffee'
SearchView = require './views/search-view.coffee'
ContentLayout = require './views/content-layout.coffee'
MetaLayout = require './views/meta-layout.coffee'
ChartView = require './views/chart-view.coffee'
MetaView = require './views/meta-view.coffee'
BillModel = require './models/bill-model.coffee'


class MainController extends Marionette.Controller
  initialize: ( options ) ->

  getData: ->
    currentCongress = 113
    firstBill = 'hr2397'
    firstBillId = currentCongress + '-' + firstBill

    billModel = new BillModel id: firstBillId
    billModel.fetch().then -> billModel

    # if not window.localStorage.getItem firstBillId
    #   billModel = new BillModel id: firstBillId
    #   billModel.fetch().then ->
    #     window.localStorage.setItem firstBillId, JSON.stringify billModel
    #     console.log 'original', billModel
    #     billModel
    # else
    #   billModel = JSON.parse window.localStorage.getItem firstBillId 
    #   console.log 'else', billModel
    #   billModel



  showBill: ( id ) ->

  home: ->
    @getData().then ( billModel ) =>
      welcomeView = new WelcomeView model: billModel
      @options.regions.welcome.show welcomeView 

      searchView = new SearchView
      @options.regions.search.show searchView

      contentLayout = new ContentLayout
      @options.regions.content.show contentLayout

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



module.exports = MainController
