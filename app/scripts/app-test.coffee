expect = chai.expect

App = require "./app.coffee"
MainController = require "./controller.coffee"
App.start()

describe "app", ->
  it "Welcome region should  exist", ->
    expect( App.welcome ).to.exist
  it "Search region should exist", ->
    expect( App.search ).to.exist
  it "content region should exist", ->
    expect( App.content ).to.exist
  it "Should have a controller", ->
    expect( App.controller ).to.exist
  it "Should have a router", ->
    expect( App.router ).to.exist
  