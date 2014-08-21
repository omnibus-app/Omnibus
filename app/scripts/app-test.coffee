expect = chai.expect
fixtures = require 'js-fixtures'

App = require "./app.coffee"
$
describe "app", ->

  beforeEach () ->
    fixtures.load './test/test.html'
    $ = fixtures.window().$


  it "Welcome should have three regions", -> 
    expect( $('#search') ).to.exist
    expect( $('#welcome') ).to.exist
    expect( $('#content') ).to.exist
  # it "Should have a controller and router", ->
    # expect( $controller ).to.exist
    # expect( App.router ).to.exist
  # it "Should navigate to home from root", ->
  #   var App.controller.home = sinon.spy()
  #   App.router.navigate( '', { trigger: true })

  #   expect( App.controller.home )