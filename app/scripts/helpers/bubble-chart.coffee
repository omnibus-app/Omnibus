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

   #create buttons and append
    buttons = [
      ['combined', 'All Bills'],
      ['byYear', 'By Congress'],
      ['byParty', 'By Party']
    ]

    buttonHolder = $("#bubbleChart")
    for pair in buttons
      buttonHolder.append("<button id=#{pair[0]}>#{pair[1]}</button>")

    # locations the nodes will move towards
    # depending on which view is currently being
    # used
    @center = {x: @width / 2, y: @height / 2}
    @year_centers = {
      "111": {x: @width / 3, y: @height / 2},
      "112": {x: @width / 2, y: @height / 2},
      "113": {x: 2.3 * @width / 3, y: @height / 2}
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
      .range(["#920005", "#013F8A"])

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
        exited: d.last_action_at
        x: Math.random() * 900
        y: Math.random() * 800 
      }
      @nodes.push node

    @nodes.sort (a,b) -> b.value - a.value



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
      .attr("r", 0)
      .attr("class","bubble")
      .attr("fill", (d) => 
        return "#ddd" if isNaN d.support
        @fill_color(d.support))
      .attr("stroke-width", 1.5)
      .attr("stroke", (d) => d3.rgb(@fill_color(d.group)).darker())
      .attr("data-bill", (d) -> "#{d.id}")
      .on("mouseover", (d,i) -> that.show_details(d,i,this))
      .on("mouseout", (d,i) -> that.hide_details(d,i,this))

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
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(.9)
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
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_year(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()

    this.display_years()

  display_by_party: () =>
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.8)
      .on "tick", (e) =>
        @circles.each(this.move_towards_party(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", 300)
    @force.start()

    this.display_partys()

  # move all circles to their associated @year_centers 
  move_towards_year: (alpha) =>
    (d) =>
      target = @year_centers[d.congress]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 1.1
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 1.1


      # .attr("fill", (d) => 
      #   return "#ddd" if isNaN(d.support)
      #   @fill_color(d.support)) 
  that = this

  move_towards_party: (alpha) =>
    # @vis.selectAll("*").remove()
    # @vis.selectAll("circle").data(@data).enter().append("circle").attr("class","bubble")
    (d) =>
      if isNaN d.support 
        d.x = d.x * (@damper + 0.02) * alpha
        d.y = d.y * (@damper + 0.02) * alpha
      else
        target = @support_scale[d.support]
        d.x = target * (@damper + 0.02) * alpha * 1.1
        d.y = d.y



  # Method to display year titles
  display_years: () =>
    congress_x = {"111": 160, "112": @width / 2, "113": @width - 160}
    years_x = {"2009-2010": 160, "2011-2012": @width / 2, "2013-2014": @width - 160}
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

  display_partys: () =>
    partys_x = {"Republican": 160, "Split": @width / 2, "Democrat": @width - 160}
    partys_data = d3.keys(partys_x)
    partys = @vis.selectAll(".partys")
      .data(partys_data)

    partys.enter().append("text")
      .attr("class", "partys")
      .attr("x", (d) => partys_x[d] )
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text((d) -> d)

  # Method to hide year titles
  hide_years: () =>
    years = @vis.selectAll(".years").remove()

  #highlight moused bill
  show_details: (data, i, element) =>
    sel = d3.select(element)
    sel.attr("stroke", "black")
    sel.moveToFront()

  hide_details: (data, i, element) =>
    d3.select(element).attr("stroke", (d) => d3.rgb(@fill_color(d.group)).darker())



module.exports = BubbleChart