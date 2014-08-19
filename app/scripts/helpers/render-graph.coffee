util = require('./graph-util.coffee')

getData = (target, svg) ->
  d3.json target, (error, json) ->
    data = json.map util.buildData

    x.domain d3.extent data, (d) ->
      if d.demY > d.repY then d.demY else d.repY
    y.domain data.map (d) ->
      d.number

    util.buildData data

  svg
    .append 'g'
    .attr 'class', 'x axis'
    .call xAxis
  svg
    .append 'g'
      .attr 'class', 'y axis'
    .append 'line'
      .attr 'x1', x 0
      .attr 'x2', x 0
      .attr 'y2', height