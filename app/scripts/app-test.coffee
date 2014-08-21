expect = chai.expect
App = require "./app.coffee"

describe "app", ->
  App.start()

  it "Welcome should have three regions", ->
    expect( App.welcome ).to.exist
    expect( App.search ).to.exist
    expect( App.content ).to.exist
  it "Should have a controller and router", ->
    expect( App.controller ).to.exist
    expect( App.router ).to.exist
  # it "Should navigate to home from root", ->
  #   var App.controller.home = sinon.spy()
  #   App.router.navigate( '', { trigger: true })

  #   expect( App.controller.home )