class WelcomeView extends Marionette.ItemView
  template: require './welcome-view.jade'

  initialize: ->
    @trigger 'welcome:show'

  triggers:
    'click .welcome-close': 'welcome:close'

module.exports = WelcomeView
