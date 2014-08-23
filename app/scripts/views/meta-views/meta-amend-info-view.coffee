class AmendInfoView extends Marionette.ItemView
  template: require './meta-amend-info-view.jade'

  initialize: ( options ) ->
    amends = @model.get 'votes'
    @model.set 'yesAgg', amends.reduce ( acc, amend ) ->
      if amend.vote
        vote = amend.vote
        acc.demY += +vote.democratic.yes
        acc.repY += +vote.republican.yes
        acc.total += ( +vote.total.yes + +vote.total.no )
      return acc
     , demY: 0, repY: 0, total: 0

  render: ->
    data = @model.get 'yesAgg'
    $ =>
      width = 280
      height = 280
      radius = Math.min(width, height) / 2
      
      temp = data
      data = []
      demY = temp.demY
      repY = temp.repY
      total = temp.total
      nonY = temp.total - demY - repY
      data.push title: 'Democrat Yes', votes: demY, percent: Math.round( demY / total * 100 ) + '%'
      data.push title: 'Republican Yes', votes: repY, percent: Math.round( repY / total * 100 ) + '%'
      data.push title: 'Combined Nay', votes: nonY, percent: Math.round( nonY / total * 100 ) + '%'

      arc = d3.svg.arc()
        .outerRadius radius - 10
        .innerRadius radius - 70

      pie = d3.layout.pie()
        .sort null
        .value (d) ->
          d.votes

      bubsTitle = document.createElement 'div'
      bubs = document.createElement 'div'
      idP = document.createElement 'h4'
      bubsTitle.id = 'bubs-title'
      bubs.id = 'bubs'
      billId = @model.get( 'votes' )[ 0 ].bill_id


      @el.appendChild bubsTitle
      @el.firstChild.appendChild idP
      @el.firstChild.firstChild.innerText = "Bill ID: #{ billId }"
      @el.appendChild bubs

      svg = d3.select @el.lastChild
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
          .style "fill", (d) ->
            if d.data.title is 'Democrat Yes' then return 'blue'
            if d.data.title is 'Republican Yes' then return 'red'
            if d.data.title is 'Combined Nay' then return 'gray'

      g.append "text"
          .attr "class", "pie-chart-text"
          .attr "transform", (d) ->
            "translate(" + arc.centroid(d) + ")"
          .attr "dy", ".35em"
          .style "text-anchor", "middle"
          .text (d) ->
            d.data.title

      g.append "text"
          .attr "class", "pie-chart-text"
          .attr "transform", (d) ->
            "translate(" + arc.centroid(d) + ")"
          .attr "dy", "1.4em"
          .style "text-anchor", "middle"
          .text (d) ->
            d.data.percent

      titleP = document.createElement 'p'
      @el.lastChild.appendChild titleP
      @el.lastChild.lastChild.innerText = "Combined support for all amendments"



module.exports = AmendInfoView