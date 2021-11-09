class Linegraph {
    constructor(width, height, svgID, data) {
        this.margin = {top: 10, right: 30, bottom: 30, left: 40};
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
        this.svg = d3.select(svgID).append("svg")
            .attr('id', 'linegraph-svg')
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        this.networkData = data;
        this.svgID = svgID;
        this.x;
        this.y;
    }

    drawGraph(starter, day) {
        let xMax = this.networkData[starter]['nodes'][0]['groups'].length - 1;

        this.x = d3.scaleLinear()
            .range([ 0, this.width ])
            .domain([0, xMax]);
        this.y = d3.scaleLinear()
            .domain([0, this.networkData[starter].nodes.length])
            .range([ this.height, 0]);

        let x = this.x;
        let y = this.y;

        this.svg.selectAll('*').remove()
    
        this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x))
            .selectAll("text")
                .style("text-anchor", "end")
                .style("font", "14px times");
    
        this.svg.append("g")
            .call(d3.axisLeft(this.y))
            .selectAll("text")
            .style("font", "14px times");
    
        let popData = {
            1: [],
            2: [],
            3: [],
            4: []
        };
    
        for (let group = 1; group <= 4; group++) {
            for (let i = 0; i <= xMax; i++) {
                let popSize = 0;
                for (let j = 0; j < this.networkData[starter]['nodes'].length; j++) {
                    if (this.networkData[starter]['nodes'][j]['groups'][i] == group){
                        popSize += 1;
                    }
                }
                popData[group].push({'day': i, 'value': popSize});
            }
        }
    
        for (let group = 1; group <= 4; group++) {
            this.svg.append("path")
                .datum(popData[group])
                .attr("fill", "none")
                .attr("stroke", color[group])
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(function(d)
                    {return x(d.day)})
                .y(function(d) {return y(d.value)})
                )
        }
    
        // Add line for current day
        this.svg.append("line")
            .attr('id', 'current-day')
            .attr("x1", this.x(day))
            .attr("y1", this.y(0))
            .attr("x2", this.x(day))
            .attr("y2", this.y(this.networkData[starter].nodes.length))
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", ("3, 3"));
    }

    changeDay(day) {
        d3.select("#current-day")
            .transition()
                .ease(d3.easeLinear)
                .attr('x1', this.x(day))
                .attr('x2', this.x(day))
                .duration(100);
    }

}

