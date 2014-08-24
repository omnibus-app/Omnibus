camelToTitle = ( str ) ->
  str.replace /([A-Z])/g, " $1"
  str.charAt( 0 ).toUpperCase() + str.slice 1

module.exports = class ControlView extends Marionette.ItemView
  template: require './control-view.jade'
  initialize: ->
    @makeTriggers()

  makeTriggers: ->
    @model.get( 'buttons' ).forEach ( id ) =>
      @$el.on "click", "##{ id }", =>
        @trigger "buttonClick", id
