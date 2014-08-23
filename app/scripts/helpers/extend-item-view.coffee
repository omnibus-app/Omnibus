_.extend Marionette.ItemView.prototype,
  isInDom: -> !! el.parentNode
