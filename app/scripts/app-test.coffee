App = require './app'
chai = require '../../bower_components/chai/chai.js'
expect = chai.expect
should = chai.should()

describe 'app:', ->

  beforeEach ( done ) ->
    app = new App.start()

  describe 'regions', ->
    should.exist app.search
    should.exist app.chart
    should.exist app.sideData
