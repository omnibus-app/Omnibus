margin =
  top: 10
  right: 10
  bottom: 100
  left: 40
margin2 =
  top: 430
  right: 10
  bottom: 20
  left: 40
# 
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom,
height2 = 500 - margin2.top - margin2.bottom;
# 
parseDate = d3.time
  .format()
  .parse
# 
x = d3.time
  .scale()
  .range [0, width]
x2 = d3.time
  .scale()
  .range([0, width])
y = d3.scale
  .linear()
  .range [height, 0]
y2 = d3.scale
  .linear()
  .range [height2, 0]
# 
xAxis = d3.svg
  .axis()
  .scale x
  .orient 'bottom'
xAxis = d3.svg
  .axis()
  .scale x2
  .orient 'bottom'
yAxis = d3.svg
  .axis()
  .scale y
  .orient 'left'
#
area = d3.svg
  .area()
  .x ( d ) -> x d.close
  .y0 height
  .y1 ( d ) -> y d.len 
#
area2 = d3.svg
  .area()
  .x ( d ) -> x d.close
  .y0 height2
  .y1 ( d ) -> y d.len

svg = d3.select 'body'
  .append 'clipPath'
  .attr 'id', 'clip'
  .append 'rect'
  .attr 'width', width
  .attr 'heigth', heigth

svg.append 'defs'
  .append 'clipPath'
  .attr 'id', 'clip'
  .append 'rect'
  .attr 'width', width
  .attr 'height', height

focus = svg.append 'g'
  .attr 'class'
  .attr 'transform', 'translate(' + margin2.left + ',' + margin2.top + ')'
# this isn't done yet









