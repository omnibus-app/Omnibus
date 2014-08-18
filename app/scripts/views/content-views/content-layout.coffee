class ContentLayout extends Marionette.LayoutView
  attributes:
    id: 'contentLayout-layout'
  template: '<div>'+
    '<div id="axis" class="col-md-8"></div>'+
    '<div id="chart" class="col-md-8">test chart</div>'+
    '<div id="meta" class="col-md-4">test meta</div>'+
    '</div>'
  regions:
    chart: '#chart'
    meta: '#meta'

module.exports = ContentLayout
