module.exports =
  noVote: (a, b) ->
    b.demAbs + b.repAbs - a.demAbs + a.repAbs
  democratTotal: (a, b) ->
    b.demY - a.demY
  republicanTotal: (a, b) ->
    b.repY - a.repY
  democratDiff: (a, b) ->
    (b.demY / b.repY) - (b.demY / b.repY)
  republicanDiff: (a, b) ->
    (b.repY / b.demY) - (a.repY / b.demY)
  order: (a, b) ->
    a.number - b.number
    
  sortBy: (sortFunc, node) ->
    svg
      .selectAll '.test'
      .sort sortFunc
      .transition()
      .delay 200
      .duration 500
      .attr 'transfrom', (d, i) ->
        'translate(' + 0 + ',' + i * 10 + ')'
