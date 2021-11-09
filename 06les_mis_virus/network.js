class Network {
    constructor(width, height, svgID, data) {
        this.margin = {top: 10, right: 30, bottom: 30, left: 40};
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
        this.svg = d3.select(svgID).append("svg")
            .attr("width", width + this.margin.left + this.margin.right)
            .attr("height", height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        this.linkGroup = this.svg.append("g")
            .attr("class", "links");
        this.nodeGroup = this.svg.append("g")
            .attr("class", "nodes");
        this.networkData = data;
    }
    
    drawNetwork(starter, day) {
        this.linkGroup.selectAll('line').remove();
        this.nodeGroup.selectAll('g').remove();  
    
        // Initialize the links
        const link = this.linkGroup.selectAll("line")
            .data(this.networkData[starter].links)
            .enter().append("line")
                .style("stroke", "#aaa")
                // Scale the width of the edge by the edge strength
                // sqrt to make the width grow slower (linear is too much)
                .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
                
        // Initialize the nodes
        const node = this.nodeGroup.selectAll("g")
            .data(this.networkData[starter].nodes)
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
    
        const simulation = d3.forceSimulation(this.networkData[starter].nodes)
            .force("link", d3.forceLink()                       
                .id(function(d) { return d.id; })
                .links(this.networkData[starter].links))                                   
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
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

    recolor(starter, day) {
        const node = this.nodeGroup.selectAll("g")
            .data(this.networkData[starter].nodes);
        node.selectAll("circle")
            .attr('class', 'circle')
            .attr("r", 7)
            .attr('fill', d => color[d.groups[day]]); 
    }
}