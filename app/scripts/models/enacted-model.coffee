class EnactedModel extends Backbone.Model
  initialize: ( options ) ->
    bills = @get 'bills'
    bills.sort ( a, b ) ->
      a.last_version.pages - b.last_version.pages

    pages = bills.reduce ( acc, bill ) ->
      acc.numBills++
      acc.pages += +bill.last_version.pages
      acc.pageStore.push +bill.last_version.pages
      return acc
    , pages: 0, numBills: 0, pageStore: []

    @set 'bills', bills
    @set 'pages', pages

    @findStats 2, 2
  

  findStats: ( percent, number ) ->
    pages = @get 'pages'
    pages.getTopPercent = percent
    pages.getTopNumber = number

    sumArray = ( pageArray ) -> 
      pageArray.reduce ( acc, pages ) ->
        acc += pages
        return acc
      , 0

    length = Math.floor( pages.pageStore.length * ( percent / 100 ) )
    topPages = pages.pageStore.slice -length

    pages.topNumber = Math.round ( sumArray pages.pageStore.slice -number ) / pages.pages * 100 

    pages.topPagesPercent = Math.round ( sumArray topPages ) / pages.pages * 100 
    @set 'pages', pages


  parse: ( response ) ->

module.exports = EnactedModel
