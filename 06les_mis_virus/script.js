// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
const width = 600 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

    // set the dimensions and margins of the graph
    const lgMargin = {top: 10, right: 30, bottom: 30, left: 40};
    const lgWidth = parseInt(d3.select('#linegraph').style('width')) - lgMargin.left - lgMargin.right;
    const lgHeight = 200 - lgMargin.top - lgMargin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graphic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

const linkGroup = svg.append("g")
    .attr("class", "links");

const nodeGroup = svg.append("g")
    .attr("class", "nodes");

const color = {
    1: 'blue', // susceptible
    2: 'yellow', // exposed
    3: 'red', // infected
    4: 'green' // recovered
}

const slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

// Listener for the slider
slider.oninput = function() {
  output.innerHTML = this.value;
  changeDay(document.getElementById('starter').value, this.value);
}

// Request the json data, save as global, then draw network.
var networkData;
var x; // x-axis for line graph
var y; // y-axis for line graph
d3.json('sim.json').then( function(data) {
    networkData = data;
    let starter = document.getElementById('starter').value;
    let day = slider.value;
    x = d3.scaleLinear()
        .range([ 0, lgWidth ])
        .domain([0, 20]); // TODO don't hard code number of days
        // .padding(0.2);

    y = d3.scaleLinear()
        .domain([0, networkData[starter].nodes.length])
        .range([ lgHeight, 0]);

    drawNetwork(starter, day); 
    drawGraph(starter, day); 
});

// Listener for the dropdown selector
document.addEventListener('input', function (event) {
	// Only run on our select menu
	if (event.target.id !== 'starter') return;

	drawNetwork(document.getElementById('starter').value, slider.value);
    drawGraph(document.getElementById('starter').value, slider.value); 
}, false);


// Function for recoloring nodes.
// Does not redraw the entire network.
function changeDay(starter, day) {
    const node = nodeGroup.selectAll("g")
        .data(networkData[starter].nodes);
    node.selectAll("circle")
            .attr('class', 'circle')
            .attr("r", 7)
            .attr('fill', d => color[d.groups[day]]); 
    
    // Move line for current day to line chart
    d3.select("#current-day")
        .transition()
            .ease(d3.easeLinear)
            .attr('x1', x(day))
            .attr('x2', x(day))
            .duration(100);
}

function drawNetwork(starter, day) {
    linkGroup.selectAll('line').remove();
    nodeGroup.selectAll('g').remove();  

    // Initialize the links
    const link = linkGroup.selectAll("line")
        .data(networkData[starter].links)
        .enter().append("line")
            .style("stroke", "#aaa")
            // Scale the width of the edge by the edge strength
            // sqrt to make the width grow slower (linear is too much)
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
            
    // Initialize the nodes
    const node = nodeGroup.selectAll("g")
        .data(networkData[starter].nodes)
        .enter().append("g");

    node
        .on("mouseover", function(event, d) {	
            d3.select(this).selectAll('text').style('fill', 'black')
        })					
        .on("mouseout", function(d) {
            d3.select(this).selectAll('text').style('fill', 'lightgray')
        });

    node.append("circle")
        .attr('class', 'circle')
        .attr("r", 7)
        .attr('fill', d => color[d.groups[day]]);

    var drag_handler = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

    drag_handler(node);
    
    node.append("text")
        .text(d => d.id)
        .attr('x', 6) //  These control how far the text is offset
        .attr('y', 3) // from each circle
        .style('fill', 'lightgray');

    node.append("title") // The title attribute is displayed on hover.
        .text(d => d.id);
    
    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
      
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
      
    function dragEnded(event,d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    const simulation = d3.forceSimulation(networkData[starter].nodes)
        .force("link", d3.forceLink()                       
            .id(function(d) { return d.id; })
            .links(networkData[starter].links))                                   
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }
}



function drawGraph(starter, day) {
    d3.select("#linegraph").selectAll('svg').remove();

    // append the svg object to the body of the page
    const lgSVG = d3.select("#linegraph")
        .append("svg")
        .attr('id', 'linegraph-svg')
        .attr("width", lgWidth + lgMargin.left + lgMargin.right)
        .attr("height", lgHeight + lgMargin.top + lgMargin.bottom)
        .append("g")
            .attr("transform", `translate(${lgMargin.left}, ${lgMargin.top})`);
    
    lgSVG.append("g")
        .attr("transform", "translate(0," + lgHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font", "14px times");

    lgSVG.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font", "14px times");

    let popData = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    for (let group = 1; group <= 4; group++) {
        for (let i = 0; i <= 20; i++) {
            let popSize = 0;
            for (let j = 0; j < networkData[starter]['nodes'].length; j++) {
                if (networkData[starter]['nodes'][j]['groups'][i] == group){
                    popSize += 1;
                }
            }
            popData[group].push({'day': i, 'value': popSize});
        }
    }

    for (let group = 1; group <= 4; group++) {
        lgSVG.append("path")
            .datum(popData[group])
            .attr("fill", "none")
            .attr("stroke", color[group])
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) {return x(d.day)})
            .y(function(d) {return y(d.value)})
            )
    }

    // Add line for current day
    lgSVG.append("line")
        .attr('id', 'current-day')
        .attr("x1", x(day))
        .attr("y1", y(0))
        .attr("x2", x(day))
        .attr("y2", y( networkData[starter].nodes.length))
        .style("stroke-width", 2)
        .style("stroke", "gray")
        .style("fill", "none")
        .style("stroke-dasharray", ("3, 3"));

}