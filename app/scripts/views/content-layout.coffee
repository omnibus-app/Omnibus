class Content extends Marionette.LayoutView
  attributes:
    id: 'content-layout',
  template: '<div>'+
    '<div id="chart">test chart</div>'+
    '<div id="meta">test meta</div>'+
    '</div>',
  regions:
    chart: '#chart',
    meta: '#meta'

module.exports = Content