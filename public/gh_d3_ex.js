function appendToPage(top_week, top_day){
  $("#q1").html("Week <span class='day'>" + top_week + "</span> had the most commits");
  var day = top_day.shift().replace(",","");
  var number = top_day.shift();
  $("#q2").html("Day with highest number of commits for the year: <span class='day'>"+ day + "</span> at a total of: <span class='number'>" + number + "</span>");
}


var drawGraph = function(){
  var margin = {top: 20, right: 20, bottom: 30, left: 100},
      width = 760 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("graph_data.json", function(error, data) {
    appendToPage(data.top_commit_week, data.top_commit_day);
    data = data.graph_data;
    x.domain(data.map(function(d) { console.log(d); return d.letter; }));
    y.domain([0, d3.max(data, function(d) { console.log(d); return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        // .attr("transform", "rotate(-90)")
        .attr("y", -6)
        .attr("dy", ".3em")
        .style("text-anchor", "end")
        .text("Number of Commits");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });

  });

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  }
}

$(document).ready(drawGraph);