// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graphic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json('network.json').then( function( data) {
    // Tool tip
    let div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // Initialize the links
    const link = svg
        .selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#aaa")

    // fades out lines that aren't connected to node d
    var is_connected = function(d, opacity) {
        link.transition().style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
        });
    }
    
    // Initialize the nodes
    const node = svg
        .attr('class', 'circle')
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", d => d.name.length*2)
        .on("mouseover", function(event, d) {	
            is_connected(d, 0.1);	
            div.transition()		
                .duration(200)		
                .style("opacity", .9);
            div.html(d.name)	
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {
            is_connected(d, 1);		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    const drag_handler = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

    drag_handler(node);

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

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink()                       
            .id(function(d) { return d.id; })
            .links(data.links)                                    
            .strength(0))
        .force("radial", d3.forceRadial(width/2, x=width/2, y=height/2))
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
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

});