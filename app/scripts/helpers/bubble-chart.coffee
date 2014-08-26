datum = require './../../../public/data/all-enacted-with-passing-vote.json'
class BubbleChart
  constructor: (data) ->
    @data = data
    @width = $("#chart").width()
    @height = $("#chart").height()

    d3.selection::moveToFront = ->
      @each ->
        @parentNode.appendChild this
        return

    # locations the nodes will move towards
    # depending on which view is currently being
    # used
    @center = {x: @width / 2, y: @height / 2}
    @year_centers = {
      "111": {x: @width / 3, y: @height / 2},
      "112": {x: @width / 2, y: @height / 2},
      "113": {x: 2 * @width / 3, y: @height / 2}
    }
    @party_centers = {
      "Republican": {x: @width / 3, y: @height / 2},
      "Split": {x: @width / 2, y: @height / 2},
      "Democrat": {x: 2.3 * @width / 3, y: @height / 2}
    }

    # used when setting up force and
    # moving around nodes
    @layout_gravity = -0.01
    @damper = 0.1

    # these will be set in create_nodes and create_vis
    @vis = null
    @nodes = []
    @force = null
    @circles = null


    # use the max total_amount in the data as the max in the scale's domain
    max_amount = d3.max(@data, (d) -> parseInt(d.last_version.pages))
    @radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 45])

    parseDate = d3.time.format.utc("%Y-%m-%d").parse;

    # Map support data from datum onto @data
    @data = @data.map (d) ->
      if datum[d.bill_id]
        id = d.bill_id
        d.support = {demVotes: parseInt(datum[id].democratic.yes), repVotes: parseInt(datum[id].republican.yes), allVoteTotal: parseInt(datum[id].total.yes) + parseInt(datum[id].total.no) + parseInt(datum[id].total.no) + parseInt(datum[id].total.present), allVotes: datum[id].total}
      else d.support = false
      return d


    # Function for filling colors of nodes
    @fill_color = d3.scale.linear()
      .domain([0, 1])
      # .range(["#DC2039", "#405CD6"])
      .range(["#DC2039", "#2A53C1"])

    @support_scale = d3.scale.linear()
      .domain([0, 1])
      .range([0, @width])


  # create node objects from original data
  # that will serve as the data behind each
  # bubble in the vis, then add each node
  # to @nodes to be used later
    this.create_nodes()
    this.create_vis()

  create_nodes: () =>
    parseDate = d3.time.format("%Y-%m-%d").parse;
    @data.forEach (d, i) =>
      node = {
        id: d.bill_id
        radius: @radius_scale(parseInt(d.last_version.pages))
        value: d.last_version.pages
        name: d.short_title
        description: d.official_title
        sponsor: if d.sponsor then d.sponsor.title + " " + d.sponsor.first_name + " " + d.sponsor.last_name else null
        support: d.support.demVotes / d.support.allVoteTotal
        sponsorId: d.sponsor_id
        committee: d.committee_ids
        introduced: d.introduced_on
        congress: d.congress
        exited: parseDate d.last_action_at
        x: Math.random() * 900
        y: Math.random() * 800
      }
      @nodes.push node

    @nodes.sort (a,b) -> b.exited - a.exited



  # create svg at #vis and then
  # create circle representation for each node
  create_vis: () =>
    @vis = d3.select("#bubbleChart").append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .attr("id", "svg_vis")

    @circles = @vis.selectAll("circle")
      .data(@nodes, (d) -> d.id)

    # used because we need 'this' in the
    # mouse callbacks
    that = this



    # radius will be set to 0 initially.
    # see transition below

    @circles.enter().append("circle")
      .attr "r", 0
      .attr "class", (d) =>
        str = "bubble"
        if isNaN d.support
          str += " unanimous-consent"
        str
      .attr "fill", (d) =>
        return "#ddd" if isNaN d.support
        @fill_color(d.support)
      .attr "stroke-width", 1.5
      .attr "stroke", (d) => d3.rgb(@fill_color(d.group)).darker()
      .attr "data-bill", (d) -> "#{d.id}"
      .on "mouseover", (d,i) -> that.show_details( d, i, this)
      .on "mouseout", (d,i) -> that.hide_details( d, i, this)

    # Fancy transition to make bubbles appear, ending with the
    # correct radius
    @circles.transition().duration(2000).attr("r", (d) ->
      d.radius)



  # Charge function that is called for each node.
  # Charge is proportional to the diameter of the
  # circle (which is stored in the radius attribute
  # of the circle's associated data.
  # This is done to allow for accurate collision
  # detection with nodes of different sizes.
  # Charge is negative because we want nodes to
  # repel.
  # Dividing by 8 scales down the charge to be
  # appropriate for the visualization dimensions.
  charge: (d) ->
    d.radius * d.radius / - 8.7


  # Starts up the force layout with
  # the default values
  start: () =>
    @force = d3.layout.force()
      .nodes(@nodes)
      .size([@width, @height])

  # Sets up force layout to display
  # all nodes in one circle.
  display_group_all: () =>
    d3.selectAll(".x").remove() if d3.select(".x")
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(.85)
      .on "tick", (e) =>
        @circles.each(this.move_towards_center(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()

    this.hide_years()

  # Moves all circles towards the @center
  # of the visualization
  move_towards_center: (alpha) =>
    (d) =>
      d.x = d.x + (@center.x - d.x) * (@damper + 0.025) * alpha
      d.y = d.y + (@center.y - d.y) * (@damper + 0.025) * alpha

  # sets the display of bubbles to be separated
  # into each year. Does this by calling move_towards_year
  display_by_year: () =>
    d3.selectAll(".x").remove() if d3.select(".x")
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_year(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()

    this.display_years()


  # move all circles to their associated @year_centers
  move_towards_year: (alpha) =>
    (d) =>
      target = @year_centers[d.congress]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 1.1
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 1.1


  # Method to display year titles
  display_years: () =>
    congress_x = {"111": 160, "112": @width / 2, "113": @width - 160}
    years_x = {"2009-2010": 160, "2011-2012": @width / 2, "2013-2014": @width - 160}
    years = @vis.selectAll([".sixYears"]).remove() if $(".sixYears")

    congress_data = d3.keys(congress_x)
    years_data = d3.keys(years_x)
    congress = @vis.selectAll(".congress")
      .data(congress_data)

    congress.enter().append("text")
      .attr("class", "congress")
      .attr("x", (d) => congress_x[d] )
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text((d) -> d)

    years = @vis.selectAll(".years")
      .data(years_data)

    years.enter().append("text")
      .attr("class", "years")
      .attr("x", (d) => years_x[d] )
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .text((d) -> d)


  display_timeline: () =>

    @hide_years()
    timeline = @vis.selectAll("circle")


    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.75)
      .on "tick", (e) =>
        @circles.each(this.move_timeline(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()



  move_timeline: (alpha) =>
    parseDate = d3.time.format.utc("%Y-%m-%d").parse;
    minDate111 = d3.min(@data, (d) ->
      if d.congress is 111 
        +parseDate d.last_action_at)
    maxDate111 = d3.max(@data, (d) ->
      if d.congress is 111 
        +parseDate d.last_action_at)
    minDate112 = d3.min(@data, (d) ->
      if d.congress is 112 
        +parseDate d.last_action_at)
    maxDate112 = d3.max(@data, (d) ->
      if d.congress is 112 
        +parseDate d.last_action_at)
    minDate113 = d3.min(@data, (d) ->
      if d.congress is 113 
        +parseDate d.last_action_at)
    maxDate113 = d3.max(@data, (d) ->
      if d.congress is 113 
        +parseDate d.last_action_at)
    timeScale = d3.time.scale().domain([minDate111, maxDate111]).range([95, @width - 125])
    timeScale2 = d3.time.scale().domain([minDate112, maxDate112]).range([95, @width - 125])
    timeScale3 = d3.time.scale().domain([minDate113, maxDate113]).range([95, @width - 125])
    

    xAxis = d3.svg.axis()
        .scale(timeScale)
        .tickSize(6, 0)
        .orient("top")

    gx = @vis.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + @height / 2.5 + ")")
    .call(xAxis)

    xAxis2 = d3.svg.axis()
        .scale(timeScale2)
        .tickSize(6, 0)
        .orient("top")

    gx = @vis.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + @height / 1.5 + ")")
    .call(xAxis2)

    xAxis3 = d3.svg.axis()
        .scale(timeScale3)
        .tickSize(6, 0)
        .orient("top")

    gx = @vis.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + @height / .75 + ")")
    .call(xAxis3)

    (d) =>
      @time_centers = {
        111 : {x: timeScale(d.exited), y: 180},
        112 : {x: timeScale2(d.exited), y: @height / 2},
        113 : {x: timeScale3(d.exited), y: @height - 180}
      }
      target = @time_centers[d.congress]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 2
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 2
    



  # Method to hide year titles
  hide_years: () =>

    years = @vis.selectAll([".years", ".congress"]).remove() if d3.select([".congress"])
    sixYears_x = { "All Enacted Bills for the last 3 congresses 2009-2014": @width / 2}
    sixYears_data = d3.keys(sixYears_x)
    sixYears = @vis.selectAll(".sixYears")
      .data(sixYears_data)

    sixYears.enter().append("text")
      .attr("class", "sixYears")
      .attr("x", (d) => sixYears_x[d] )
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text((d) -> d) 

  #highlight moused bill
  show_details: (data, i, element) =>
    sel = d3.select(element)
    sel.attr("stroke", "black")
    sel.moveToFront()

  hide_details: (data, i, element) =>
    d3.select(element).attr("stroke", (d) => d3.rgb(@fill_color(d.group)).darker())



module.exports = BubbleChart
