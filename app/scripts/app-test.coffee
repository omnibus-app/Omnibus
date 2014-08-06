expect = chai.expect

App = require "./app.coffee"
MainController = require "./controller.coffee"
App.start()

describe "app", ->
  it "search region should  exist", ->
    expect( App.search ).to.exist
  it "chart region should exist", ->
    expect( App.chart ).to.exist
  it "sideData region should exist", ->
    expect( App.meta ).to.exist
