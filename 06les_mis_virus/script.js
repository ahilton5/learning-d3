const color = {
    1: 'blue', // susceptible
    2: 'yellow', // exposed
    3: 'red', // infected
    4: 'green' // recovered
}

const slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

// Request the json data then draw graphs
var network;
var linegraph;
d3.json('sim.json').then( function(data) {
    network = new Network(600, 600, '#graphic', data);
    linegraph = new Linegraph(parseInt(d3.select('#linegraph').style('width')), 200, '#linegraph', data);

    let starter = document.getElementById('starter').value;
    let day = slider.value;

    network.drawNetwork(starter, day); 
    linegraph.drawGraph(starter, day); 
});

// Listener for the slider
slider.oninput = function() {
    output.innerHTML = this.value;
    let starter = document.getElementById('starter').value;
    network.recolor(starter, this.value);
    linegraph.changeDay(this.value);
}

// Listener for the dropdown selector
document.addEventListener('input', function (event) {
	// Only run on our select menu
	if (event.target.id !== 'starter') return;

	network.drawNetwork(document.getElementById('starter').value, slider.value);
    linegraph.drawGraph(document.getElementById('starter').value, slider.value); 
}, false);