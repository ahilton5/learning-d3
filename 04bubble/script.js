var rowConverter = function(d) {
    return {
      letter: d.letter,
      count: parseInt(d.count)
    };
  }

d3.csv("letters.csv", rowConverter).then(function(data) {
    graphic = document.querySelector('#graphic');

    chart = BubbleChart(data, {
      label: d => d.letter,
      value: d => d.count,
      title: d => d.count
    });

    graphic.appendChild(chart);
});