App = require './app'
expect = chai.expect
should = chai.should()


module.exports =
  describe 'app:', ->

    beforeEach ( done ) ->
      app = new App.start()

    describe 'regions', ->
      should.exist app.search
      should.exist app.chart
      should.exist app.sideData
