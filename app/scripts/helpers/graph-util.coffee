buildData = (obj) ->
  temp = {}
  temp.number = json[i].number
  temp.repY = +json[i].vote.republican.yes
  temp.repN = +json[i].vote.republican.no
  temp.repAbs = +json[i].vote.republican.not_voting
  temp.demY = +json[i].vote.democratic.yes
  temp.demN = +json[i].vote.democratic.no
  temp.demAbs = +json[i].vote.democratic.not_voting
  temp.amdt = json[i].amendment_id
  temp.bill = json[i].bill_id
  temp

buildSvg = (data) ->
  svg.selectAll '.bar'
      .data data
    .enter()
      .attr 'class', 'test'
      .each (el, i) ->
        d3.select @
          .append 'rect'
          .attr 'class', 'republican'
          .attr 'height', (d) ->
            8
          .attr 'width', (d) ->
            d.repY
        d3.select @
          .append 'rect'
          .attr 'class', 'democrat'
          .attr 'height', (d) ->
            d.demY
        d3.select @
          .attr 'data-amdt', (d) ->
            d.amdt
          .attr 'transform', 'translate(' + 0 + ',' + i * 10 + ')'
