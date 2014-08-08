class MetaLayout extends Marionette.LayoutView

  template: '<div>'+
  '<div id="meta-1">Meta 1</div>'+
  '<div id="meta-2">Meta 2</div>'+
  '<div id="meta-3">Meta 3</div>'+
  '</div>'

  regions:
    meta1: '#meta-1'
    meta2: '#meta-2'
    meta3: '#meta-3'

module.exports = MetaLayout