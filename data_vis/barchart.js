// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 50, left: 90},
    width = 430 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#svg2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv( "https://raw.githubusercontent.com/Weasell/CSE-5544-Final-Project/main/climate.csv", function(data) { 
  data.sort(function(a, b) {
    return d3.descending(+a.sum, +b.sum);
  });
  data = data.slice(0,10);
  // Add X axis
  var x = d3.scaleLinear()
        .domain([0, 130000000])
        .range([ 0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.Country; }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Country); })
    .attr("width", function(d) { return x(d.sum); })
    .attr("height", y.bandwidth() )
    // .attr("fill", "#69b3a2")
    .attr("fill", function (d) {
      // return colorScale(d.total);
      return d.Non_OECD=="No"?"rgba(0,0,256,1)":"#69b3a2";
      // return "rgba(0,0,256,1)";
    })
})
