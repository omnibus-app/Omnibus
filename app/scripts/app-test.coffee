App = require './app'
expect = chai.expect
should = chai.should()

App.start()

module.exports =
  describe 'app:', ->

    describe 'regions', ->
      it 'should exist', ->
        should.exist App.search
        should.exist App.chart
        should.exist App.sideData
