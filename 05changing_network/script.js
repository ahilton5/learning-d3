// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
const width = 600 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

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
  recolor(document.getElementById('starter').value, this.value);
}

// Request the json data, save as global, then draw network.
var networkData;
d3.json('sim.json').then( function(data) {
    networkData = data;
    drawNetwork(document.getElementById('starter').value, slider.value); 
});

// Listener for the dropdown selector
document.addEventListener('input', function (event) {
	// Only run on our select menu
	if (event.target.id !== 'starter') return;

	drawNetwork(document.getElementById('starter').value, slider.value); 
}, false);

// Function for recoloring nodes.
// Does not redraw the entire network.
function recolor(starter, day) {
    console.log(starter, day);
    const node = nodeGroup.selectAll("g")
        .data(networkData[starter].nodes);
    node.selectAll("circle")
            .attr('class', 'circle')
            .attr("r", 7)
            .attr('fill', d => color[d.groups[day]]); 
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