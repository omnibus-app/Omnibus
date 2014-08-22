class AmendInfoView extends Marionette.ItemView

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
      data.push title: 'Democratic', votes: demY, percent: Math.round( demY / total * 100 ) + '%'
      data.push title: 'Republican', votes: repY, percent: Math.round( repY / total * 100 ) + '%'
      data.push title: 'No', votes: nonY, percent: Math.round( nonY / total * 100 ) + '%'

      arc = d3.svg.arc()
        .outerRadius radius - 10
        .innerRadius radius - 70

      pie = d3.layout.pie()
        .sort null
        .value (d) ->
          d.votes

      svg = d3.select @el
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
            if d.data.title is 'Democratic' then return 'blue'
            if d.data.title is 'Republican' then return 'red'
            if d.data.title is 'No' then return 'gray'

      g.append "text"
          .attr "class", "pie-chart-text"
          .attr "transform", (d) ->
            "translate(" + arc.centroid(d) + ")"
          .attr "dy", ".35em"
          .style "text-anchor", "middle"
          .text (d) ->
            d.data.percent



module.exports = AmendInfoView