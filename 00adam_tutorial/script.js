// demo for HTTP Request and d3.js plotting

// returns an object from the .json file
function getData() {
    const url = "./data.json";

    const req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return JSON.parse(req.response);
}

let data = getData();
console.log(data)

// converts the json data to a single array of segments
function convertDataToAllSegments(json) {
    let segments = [];
    for (let color of json.colors) {
        for (let segment of color.segments) {
            let newSeg = {};
            newSeg.color = color.color;
            newSeg.start = segment.start;
            newSeg.stop = segment.stop;
            segments.push(newSeg);
        }
    }
    return segments;
}
let segmentData = convertDataToAllSegments(data);

// Sort segment Data by start value, otherwise all the red segments will be rendered before the rest (try commenting out the next line and see how it animates)
// segmentData.sort((a,b) => a.start - b.start);
console.log(segmentData)
const rectangleHeight = 20;

// Use d3 syntax to populate graphic
function populateGraphic() {
    const graphic = d3.select("#graphic");
    graphic.selectAll('.segment').remove();             // remove all elements with that class name
    let segments = graphic.selectAll('.segment');       // grabs all elements (existing or yet to exist) with the class name "segment"

    segments.data(segmentData)                          // assigns the elements of an array to each element that will be created
        .enter()                                        // specifies you will enter a new element for each data point. There are also .exit() and .update() d3 functions that might be useful
        .append('rect')                                 // what type of element will you be applying? You can use d3 for normal divs as well, not just svg graphics
            .attr('class', 'segment')                   // set attributes with the d3 syntax ".attr()". Here we set the class to be "segment", this is important since we told the function to look for all ".segment" elements
            .attr('x', d => d.start)
            .attr('y', 0)
            .attr('width', d => d.stop - d.start)
            .attr('height', 1)                              // you can call the data element (d) from segmentData (what we passed into the .data() function) to use as you create the graphic
            .attr('fill', function(d) { return d.color; })  // This syntax also works               

        // .transition() is a way to make cool animations and change from one graphic to another. When you overwrite an attribute, d3 will make the change for you
        .transition()
            .attr('height', rectangleHeight)                 // Here I am changing the height from 1 to the set length in rectangeHeight
            .duration(2000)                                  // how long (ms) will each animation last?
            .delay(function(d, i) { return i * 300; })       // if I pass in two parameters, the second one will represent the index of d in segmentData
}
populateGraphic();

document.getElementById('button').addEventListener('click', () => populateGraphic());




