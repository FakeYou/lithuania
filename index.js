d3.json('public/baltic.json', function(error, region) {
  var lithuania = region.objects.region.geometries.filter(function(d) { 
    return d.id == 'LTU' 
  })[0];

  var width = 1000;
  var height = 752;

  var svg = d3.select('body').append('svg') 
    .attr('width', width)
    .attr('height', height);

  // var defs = svg.append('svg:defs')
  // createPatterns(defs);

  var background = svg.append('rect')
    .attr('id', 'background')
    .attr('width', width)
    .attr('height', height)

  var projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0]);

  var path = d3.geo.path()
    .projection(projection);

  var bounds = path.bounds(topojson.feature(region, lithuania));

  var scale = .86 / Math.max(
    (bounds[1][0] - bounds[0][0]) / width,
    (bounds[1][1] - bounds[0][1]) / height);
  var translate = [
    (width - scale * (bounds[1][0] + bounds[0][0])) / 2,
    (height - scale * (bounds[1][1] + bounds[0][1])) / 2
  ];

  projection
    .scale(scale)
    .translate(translate);

  var countries = svg.append('g')
    .attr('id', 'countries')

  countries.selectAll('path')
    .data(topojson.feature(region, region.objects.region).features)
    .enter().append('path')
      .attr('class', function(d) { return 'country ' + d.properties.ADM0_A3; })
      // .attr('fill', 'url(#crossPattern)')
      .attr('d', path)

  countries.append('path')
    .datum(topojson.mesh(region, region.objects.region, function(a, b) { return a !== b; }))
    .attr('d', path)
    .attr('class', 'country-border');

  countries.selectAll('text')
    .data(topojson.feature(region, region.objects.region).features)
    .enter().append('text')
      .attr('class', function(d) { return 'country-label ' + d.properties.ADM0_A3;; })
      .attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')' })
      .text(function(d) { return d.properties.SOVEREIGNT }); 

  d3.select('.country-label.BLR').attr('transform', 'translate(900,650)');
  d3.select('.country-label.POL').attr('transform', 'translate(300,700)');
  d3.select('.country-label.LVA').attr('transform', 'translate(850,100)');

  svg.append('text')
    .attr('id', 'title')
    .attr('x', 20)
    .attr('y', 50)
    .text('Weather stations in Lithuania');

  d3.json('public/stations.json', function(error, stations) {
    var points = [];

    var g = svg.append('g')
      .attr('id', 'stations')
    
    g.selectAll('path')
      .data(stations.stations)
      .enter().append('circle')
        .attr('class', 'station')
        .attr('r', 2)
        .attr('name', function(d) { return d.name })
        .attr('cx', function(d) { return projection([d.longitude, d.latitude])[0] })
        .attr('cy', function(d) { return projection([d.longitude, d.latitude])[1] })

    g.selectAll('path')
      .data(stations.stations)
      .enter().append('text')
        .attr('class', function(d) { return 'station-label ' + d.name.toLowerCase().replace(' ', '-'); }) 
        .attr('x', function(d) { return projection([d.longitude, d.latitude])[0] })
        .attr('y', function(d) { return projection([d.longitude, d.latitude])[1] + 15 })
        .text(function(d) { return d.name.toLowerCase(); })

    var label = d3.select('.station-label.kaunas-intl')
    label.attr('y', label.attr('y') - 22)

    var label = d3.select('.station-label.siauliai')
    label.attr('y', label.attr('y') - 22)

  })
});

function createPatterns(defs) {
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
    .attr('d', 'M-5,-5 l20,20')

  var dotPattern = defs.append('svg:pattern')
    .attr('id', 'dotPattern')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 10)
    .attr('height', 10)

  dotPattern.append('path')
    .attr('d', 'M0,10 l10,-10')
}