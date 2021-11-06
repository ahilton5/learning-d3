var rowConverter = function(d) {
    return {
      Book: d.Book,
      Count: parseInt(d.Count)
    };
  }

d3.csv("data.csv", rowConverter).then(function(data) {
    graphic = document.querySelector('#graphic');

    chart = BarChart(data, {
        x: d => d.Book,
        y: d => d.Count,
        yLabel: "Chapter Count",
        width: graphic.width,
        height: graphic.height,
        color: "steelblue"
    });

    graphic.appendChild(chart);
});