class ContentLayout extends Marionette.LayoutView
  attributes:
    id: 'contentLayout-layout',
  template: '<div>'+
    '<div id="chart">test chart</div>'+
    '<div id="meta">test meta</div>'+
    '</div>',
  regions:
    chart: '#chart',
    meta: '#meta'

module.exports = ContentLayout