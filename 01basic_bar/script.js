// For reference: https://www.d3-graph-gallery.com/graph/barplot_basic.html

let graphic = document.querySelector('#graphic');

// set the dimensions and margins of the graph
let margin = {top: 30, right: 30, bottom: 70, left: 60};
let width = graphic.getAttribute('width') - margin.left - margin.right;
let height = graphic.getAttribute('height') - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#graphic")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data.csv").then(function(data) {
    // Tool tip
    // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    let div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // X axis
    let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Book; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "end")
        .style("font", "14px times");

    // Find the largest y-value
    let maxVal = 0;
    for (let i = 0; i < data.length; i++) {
        if (parseInt(data[i].Count) > maxVal) {
            maxVal = parseInt(data[i].Count);
        }
    }
    // Round up to the nearest 5
    maxVal = Math.ceil(maxVal/5)*5;

    // Add Y axis
    let y = d3.scaleLinear()
    .domain([0, maxVal])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font", "14px times");


    // Bars
    svg.selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
        .attr('class', 'bar')
        .attr("x", d => x(d.Book))
        .attr("y", d => y(d.Count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Count))
        .on("mouseover", function(event, d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);
            div.html(d.Count)	
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
});