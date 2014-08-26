class AmendPieView extends Marionette.ItemView
  template: require './meta-amend-info-view.jade'

  initialize: ( options ) ->

  renderChart: =>
    votes = @model.get 'votes'
    $ =>
      width = 280
      height = 280
      radius = Math.min(width, height) / 2

      votes = votes.vote
      tot = votes.total
      dem = votes.democratic
      rep = votes.republican

      total = +tot.no + +tot.yes + +tot.not_voting

      data = []
      data.push title: 'Democrat Yes', votes: +dem.yes, percent: Math.round( +dem.yes / +total * 100 ) + '%'
      data.push title: 'Democrat No', votes: +dem.no, percent: Math.round( +dem.no / +total * 100 ) + '%'
      data.push title: 'Republican Yes', votes: +rep.yes, percent: Math.round( +rep.yes / +total * 100 ) + '%'
      data.push title: 'Republican No', votes: +rep.no, percent: Math.round( +rep.no / +total * 100 ) + '%'
      data.sort ( a, b ) ->
        b.votes - a.votes      


      arc = d3.svg.arc()
        .outerRadius radius - 10
        .innerRadius radius - 70

      pie = d3.layout.pie()
        .sort null
        .value (d) ->
          d.votes

      svg = d3.select @el.getElementsByClassName( 'chart' )[ 0 ]
       .append "svg"
        .attr "width", width
        .attr "height", height
       .append "g"
        .attr "transform", "translate(" + width / 2 + "," + height / 2 + ")"

      g = svg.selectAll ".arc"
        .data pie data
       .enter().append "g"
        .attr "class", "arc"
          
      g.append "path"
          .attr "d", arc
          .attr "class", (d) ->
            if d.data.title is 'Democrat Yes' then return "democrat"
            if d.data.title is 'Democrat No' then return "democrat-no"
            if d.data.title is 'Republican Yes' then return "republican"
            if d.data.title is 'Republican No' then return "republican-no"

      g.append "text"
          .attr "class", "pie-chart-text"
          .attr "class", ( d ) ->
            if d.data.title is 'Democrat Yes' then return "democrat-text"
            if d.data.title is 'Democrat No' then return "democrat-text"
            if d.data.title is 'Republican Yes' then return "republican-text"
            if d.data.title is 'Republican No' then return "republican-text"
          .attr "transform", (d) ->
            "translate(" + arc.centroid(d) + ")"
          .attr "dy", "1.4em"
          .style "text-anchor", "middle"
          .text (d) ->
            d.data.percent



      classNames = [ 'democrat', 'republican', 'democrat-no', 'republican-no' ]
      classTitles = [ 'Democratic Aye', 'Republican Aye', 'Democratic No', 'Republican No' ]

      legend = d3.select @el.getElementsByClassName( 'legend' )[ 0 ]
        .append 'svg'
          .attr 'width', width
          .attr 'height', height / 2.8
        .append 'g'
          .attr "transform", "translate(" + 5 + "," + 0 + ")"
      
      rectHeight = 0
      classNames.forEach ( className ) ->
        legend.append 'rect'
          .attr "transform", "translate(" + 35 + "," + rectHeight + ")"
          .attr 'class', className
          .attr 'height', 20
          .attr 'width', 20
        rectHeight += 25

      textHeight = 17
      classTitles.forEach ( classTitle ) ->
        legend.append "text"
          .attr "class", "legend-text"
          .attr "transform", "translate(" + 60 + "," + textHeight + ")"
          .text classTitle
        textHeight += 25


  render: =>
    super()
    @renderChart()

module.exports = AmendPieView