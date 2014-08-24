class ContentLayout extends Marionette.LayoutView
  attributes:
    id: 'contentLayout-layout'
  template: """
    <div class="row">
      <div id="controls" class="col-md-12"></div>
      <div id="axis" class="col-md-12"></div>
      <div id="chart" class="col-md-8"></div>
      <div id="meta" class="col-md-4"></div>
      </div>
    </div>
    """
  regions:
    controls: '#controls'
    chart: '#chart'
    meta: '#meta'

module.exports = ContentLayout
