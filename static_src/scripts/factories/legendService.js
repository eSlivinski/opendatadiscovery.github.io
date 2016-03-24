app.factory('legendService', function($rootScope) {

  var limits = {
      state: [14000, 12000, 10000, 8000],
      county: [8000, 7500, 7000, 6500]
  };
  var colors = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
  var padding = { left: 60, top: 10, right: 10, bottom: 30 };
  var height = 210 - (padding.top + padding.bottom);
  var width = 350 - (padding.left + padding.right);

  return {

    limits: limits,

    colors: colors,

    update: function(stats, type) {

      d3.selectAll('#d3Legend').remove();

      var sum = _.sum(stats);

      var xscale = d3.scale.linear()
        .domain([0, _.max(stats)])
        .range([0, width]);

      var yscale = d3.scale.linear()
              .domain([0, stats.length - 1])
              .range([height, 0]);

      // Define Labels
      var yTicks = _.map(stats, function(d, i) {
                        if (i < limits[type].length) {
                            return '< ' + limits[type][i].toString();
                        } else {
                            return '> ' + limits[type][limits[type].length - 1].toString();
                        }
                    });

      var	xAxis = d3.svg.axis()
              .orient('bottom')
    				  .scale(xscale);

      // Create SVG
      var svg = d3.select('#legend')
              .append('svg')
              .attr('id', 'd3Legend')
              .attr('height', height + (padding.top + padding.bottom))
              .attr('width', width + (padding.left + padding.right));

      // Add x axis
      svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [ padding.left,  (height + padding.top) ]  + ")")
            .call(xAxis);

      // Create container within svg that is adjusted to specified padding
      var g = svg.append('g')
              .attr('height', height)
              .attr('width', width)
              .attr('transform', function() {
                return 'translate (' + [padding.left, padding.top  ] + ')';
              });

              var bars = g.selectAll('.bars')
                .data(stats)
                .enter().append('rect')
                .attr('class', 'bars')
                .attr('width', 0)
                .attr('height', (height/stats.length - 10))
                .attr('x', 0)
                .attr('y', function(d, i) { return i * (height / stats.length); })
                .attr('fill', function(d, i) { return colors[i]; });

      var labels = svg.selectAll('.y-labels')
              .data(stats)
              .enter().append('text')
              .text(function(d, i) { return yTicks[i]; })
              .attr('x', 0)
              .attr('y', function(d, i) { return (i * (height / stats.length)) + ((height / stats.length - 10)/2); })
              .attr('class', 'y-labels')
              .attr('dy', '1.2em');

      /* Animate Elements IN */
      bars
        .transition()
        .duration(1000).delay(700)
        .attr('width', function(d) { return xscale(d); });

    }
  };
});
