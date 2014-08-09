
class WelcomeView extends Marionette.ItemView
  template: require './welcome-view.jade'

  triggers:
    'click .welcome-close': 'welcome:close'

module.exports = WelcomeView
