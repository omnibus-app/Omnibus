class ContentLayout extends Marionette.LayoutView
  attributes:
    id: 'contentLayout-layout'
  template: '<div class="row">'+
      '<div id="axis" class="col-md-12"></div>'+
      '<div id="chart" class="col-md-12"></div>'+
      '<div id="meta" class="col-md-12"></div>'+
      '</div>'+
    '</div>'
  regions:
    chart: '#chart'
    meta: '#meta'

module.exports = ContentLayout
