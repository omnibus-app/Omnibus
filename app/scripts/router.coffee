
class MainRouter extends Marionette.AppRouter
  routes:
    '': 'home'

  home: =>
    # Delegate to the controller instantiated in App for the initial routing
    @navigate 'home',
      trigger: true,
      # Replace true will replace the url without changing the history
      replace: true

module.exports = MainRouter
