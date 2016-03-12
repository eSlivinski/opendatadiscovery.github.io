app.service('legendService', function($rootScope) {

  var limits = this.limits = {
      state: [14000, 12000, 10000, 8000],
      county: [8000, 7500, 7000, 6500]
  };

  var colors = this.colors = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];

  var updateLegend = function(stat, type) {
      var sum = _.sum(stat);

      var xscale = d3.scale.linear()
              .domain([_.min(stat), _.max(stat)])
              .range([0, 800]);

      var	xAxis = d3.svg.axis();
  		    xAxis
            .orient('bottom')
    				.scale(xscale);

      var yscale = d3.scale.linear()
  						.domain([0, stat.length - 1])
  						.range([0, 480]);

      var	yAxis = d3.svg.axis();
    			yAxis
    				.orient('left')
    				.scale(yscale)
    				.tickValues(function(d, i) {
                if (i < limits[type].length) {
                    return '< ' + limits[type][i].toString();
                } else {
                    return '>' + limits[type][limits[type].length - 1].toString();
                }
            });

      var cavans = d3.select('#legend')
          .selectAll('div')
          .data(stat)
          .enter()
          .append('div')
              .style('width', function(value) { return value / sum * 600 + 'px'; })
              .style('background-color', function(value, index) { return colors[index]; })
          .append('span')
              .text(function(value) { return value; });
          // .append('g')
          //     .call(yAxis)
          // .append('g')
          //     .call(xAxis);
  };

  $rootScope.$on('state_map:loaded', function(event, data) {
      updateLegend(data, 'state');
  });

  $rootScope.$on('county_map:loaded', function(event, data) {
      updateLegend(data, 'county');
  });
});
