expect = chai.expect

fixtures = require 'js-fixtures'

App = require "./app.coffee"
$
describe "app", ->

  beforeEach () ->
    fixtures.load './test/test.html'
    $ = fixtures.window().$
  
  afterEach () ->
    fixtures.cleanUp()

  it "Welcome should have three regions", -> 
    expect( $('#search') ).to.exist
    expect( $('#welcome') ).to.exist
    expect( $('#content') ).to.exist

  it "Should not break the mighty spinenr", ->
    expect( $( App.spinnter ) ).to.exist

  it "Should exist in some form", ->
    expect( $( App ) ).to.exist

  it "Should have a controller and router", ->
    expect( $( App.router ) ).to.exist
    expect( $( App.controller ) ).to.exist

  it "Should have content", ->
    expect( $(App.content) ).to.exist

  it "Should be able to get regions", ->
    expect( $( App.getRegions().welcome ) ).to.exist
    expect( $( App.getRegions().search ) ).to.exist
    expect( $( App.getRegions().content ) ).to.exist

  it "Should have corresponding els", ->
    expect( $( App.getRegions().welcome.el ) ).to.exist
    expect( $( App.getRegions().search.el ) ).to.exist
    expect( $( App.getRegions().content.el ) ).to.exist

  it "Should trigger something", ->
    expect( $( App.trigger('something') ) ).to.exist