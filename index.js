d3.json('public/region.json', function(error, region) {
  var lithuania = region.features.filter(function(d) { return d.properties.ADM0_A3 == 'LTU' })[0];
  console.log(region);

  var width = 800;
  var height = 500;

  var svg = d3.select('body').append('svg') 
    .attr('width', width)
    .attr('height', height);

  var defs = svg.append('svg:defs')

  var crossPattern = defs.append('svg:pattern')
    .attr('id', 'crossPattern')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 10)
    .attr('height', 10)

  crossPattern.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', '#FFF')

  crossPattern.append('path')
    .attr('d', 'M0,0 l10,10')

  var dotPattern = defs.append('svg:pattern')
    .attr('id', 'dotPattern')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 10)
    .attr('height', 10)

  dotPattern.append('path')
    .attr('d', 'M0,10 l10,-10')

  var background = svg.append('rect')
    .attr('id', 'background')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'url(#dotPattern)');

  var projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0]);

  var path = d3.geo.path()
    .projection(projection);

  var bounds = path.bounds(lithuania);

  var scale = .90 / Math.max(
    (bounds[1][0] - bounds[0][0]) / width,
    (bounds[1][1] - bounds[0][1]) / height);
  var translate = [
    (width - scale * (bounds[1][0] + bounds[0][0])) / 2,
    (height - scale * (bounds[1][1] + bounds[0][1])) / 2
  ];

  projection
    .scale(scale)
    .translate(translate);

  svg.append('g').selectAll('path')
    .data(region.features)
    .enter().append('path')
      .attr("class", function(d) { return "subunit " + d.properties.ADM0_A3; })
      .attr('fill', 'url(#crossPattern)')
      .attr('d', path)

  d3.json('public/stations.json', function(error, stations) {
    var points = [];

    console.log(stations.stations);

    var g = svg.append('g')
    
    g.selectAll('path')
      .data(stations.stations)
      .enter().append('circle')
        .attr('class', 'station')
        .attr('r', 3)
        .attr('name', function(d) { return d.name })
        .attr('cx', function(d) { return projection([d.longitude, d.latitude])[0] })
        .attr('cy', function(d) { return projection([d.longitude, d.latitude])[1] })
  })
});