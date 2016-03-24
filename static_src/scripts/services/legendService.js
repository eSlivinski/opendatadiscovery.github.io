app.service('legendService', function($rootScope) {

  var limits = this.limits = {
      state: [14000, 12000, 10000, 8000],
      county: [8000, 7500, 7000, 6500]
  };

  var colors = this.colors = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];

  var padding = { left: 60, top: 10, right: 10, bottom: 30 };
  var h = 210 - (padding.top + padding.bottom),
      w = 350 - (padding.left + padding.right) ;

  var updateLegend = function(stat, type) {
      d3.selectAll('#d3Legend').remove();

      var sum = _.sum(stat);

      var xscale = d3.scale.linear()
              .domain([0, _.max(stat)/sum])
              .range([0, w]);

      var yscale = d3.scale.linear()
  						.domain([0, stat.length - 1])
  						.range([h, 0]);

      // Define Labels
      var yTicks = _.map(stat, function(d, i) {
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
              .attr('height', h + (padding.top + padding.bottom))
              .attr('width', w + (padding.left + padding.right));

          // Add x axis
          svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + [ padding.left,  (h + padding.top) ]  + ")")
                .call(xAxis);

      // Create container within svg that is adjusted to specified padding
      var g = svg.append('g')
              .attr('height', h)
              .attr('width', w)
              .attr('transform', function() {
                return 'translate (' + [padding.left, padding.top  ] + ')'
              });

      var bars = g.selectAll('.bars')
              .data(stat)
              .enter().append('rect')
              .attr('class', 'bars')
              .attr('width', 0)
              .attr('height', (h/stat.length - 10))
              .attr('x', 0)
              .attr('y', function(d, i) { return i * (h/stat.length) })
              .attr('fill', function(d, i) { return colors[i]; });

      var labels = svg.selectAll('.y-labels')
              .data(stat)
              .enter().append('text')
              .text(function(d, i) { return yTicks[i]; })
              .attr('x', 0)
              .attr('y', function(d, i) { return (i * (h/stat.length)) + ((h/stat.length - 10)/2) })
              .attr('class', 'y-labels')
              .attr('dy', '1.2em');


      /* Animate Elements IN */
          bars
            .transition()
            .duration(1000).delay(700)
            .attr('width', function(d) { return xscale(d/sum); });

  };



  $rootScope.$on('state_map:loaded', function(event, data) {
      updateLegend(data, 'state');
  });

  $rootScope.$on('county_map:loaded', function(event, data) {
      updateLegend(data, 'county');
  });
});
