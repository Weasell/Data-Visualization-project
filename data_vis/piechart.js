// set the dimensions and margins of the graph
var width3 = 300
height3 = 300
margin3 = 40

var time = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999",
            "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
            "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width3, height3) / 2 - margin3

// append the svg object to the div called 'my_dataviz'
var svg3 = d3.select("#svg3")
    .append("svg")
    .attr("width", width3)
    .attr("height", height3)
    .append("g")
    .attr("transform", "translate(" + width3 / 2 + "," + height3 / 2 + ")");

// set the color scale
var color = d3.scaleOrdinal()
    .domain(["OECD", "NonOECD"])
    .range(["rgba(0,0,256,1)", "#69b3a2"]);

function slidecontrol() {
    d3.select("#timeslide").on("input", function () {
        timeValue = time[+this.value];
        d3.select("#range").nodes()[0].innerHTML = timeValue;
        var timeyear = "e_" + timeValue;
        getData(timeyear);
    });
}
function getData(year){
    d3.csv("https://raw.githubusercontent.com/Weasell/CSE-5544-Final-Project/main/climate.csv", function (d) {
        let showData = { OECD: 0, NonOECD: 0 };
        for (var i = 0; i < d.length; i++) {
            if (d[i][year] != "..") {
                if (d[i].Non_OECD == "Yes") {
                    showData.NonOECD = showData.NonOECD + parseInt(d[i][year]);
                }
                else {
                    showData.OECD = showData.OECD + parseInt(d[i][year]);
                }
            }
        }
        render(showData)
    })
}
function render(showData){
    var pie = d3.pie()
            .value(function (d) { return d.value; })
            .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
        var data_ready = pie(d3.entries(showData))
        // map to data
        var u = svg3.selectAll("path")
            .data(data_ready)
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        u
            .enter()
            .append('path')
            .merge(u)
            .transition()
            .duration(1000)
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', function (d) { return (color(d.data.key)) })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)
        u
            .enter()
            .append('text')
            .transition()
            .duration(1000)
                .text(function(d){ console.log(d.data.key) ;return d.data.key})
                .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                .style("fill", "white")
                .style("text-anchor", "middle")
                .style("font-size", 12)
        // u
        //     .enter()
        //     .append("text")
        //     .attr("transform", function(d) {
        //         var _d = arcGenerator.centroid(d);
        //         _d[0] *= 2.5;	//multiply by a constant factor
        //         _d[1] *= 2.5;	//multiply by a constant factor
        //         return "translate(" + _d + ")";
        //     })
        //     .attr("dy", ".50em")
        //     .style("text-anchor", "middle")
        //     .transition()
        //     .duration(1000)
        //         .text(function(d) {
        //             console.log(d)
        //             let value = (d.data.value/(showData.NonOECD+showData.OECD)*100).toFixed(2)
        //             return value + '%';
        //         });
        u
            .exit()
            .remove()
}

getData("e_1990")
slidecontrol();
