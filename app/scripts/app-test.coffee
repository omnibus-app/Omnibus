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
