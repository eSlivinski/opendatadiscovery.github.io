app.factory('legendService', function($rootScope) {

  var limits = {
      state: [14000, 12000, 10000, 8000],
      county: [8000, 7500, 7000, 6500]
  };
  var colors = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
  var width = 300;
  var barHeight = 30;
  var x = d3.scale.linear().range([0, width]);
  var chart = d3.select('.chart').attr('width', width);
  var transform = d3.svg.transform().translate(function(d, i) { return [0,  i * barHeight]; });

  return {

    limits: limits,

    colors: colors,

    update: function(stats) {
      
      x.domain([0, d3.max(stats)]);

      chart.attr("height", barHeight * stats.length);

      var bar = chart.selectAll('g')
                  .data(stats)
                .enter().append('g')
                  .attr("transform", transform);

      bar.append('rect')
          .attr('fill', function(d, i) { return colors[i]; })
          .attr('width', function(d) { return x(d); })
          .attr('height', barHeight - 5);

      bar.append('text')
          .attr('x', function(d) { return x(d) - 8; })
          .attr('y', barHeight - 9)
          .text(function(d) { return d; });
    }
  };
});
