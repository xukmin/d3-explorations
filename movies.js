function createChart() {
  d3.csv('movies.csv', plotChart);
}

function plotChart(data) {
  const xSize = 640;
  const ySize = 480;
  const xPadding = 40;
  const yPadding = 20;

  const chart = d3.select('svg')
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${xPadding}, ${yPadding})`);

  const xScale = d3.scaleLinear()
      .domain([1, data.length])
      .range([0, 640]);
  const yScale = d3.scaleLinear()
      .domain([0, 40])
      .range([480, 0]);

  const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickSize(10)
      .ticks(data.length);
  chart.append('g')
      .attr('id', 'xAxisG')
      .call(xAxis)
      .attr('transform', `translate(0, ${ySize})`);

  const yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(10)
      .tickSize(10);
  chart.append('g')
      .attr('id', 'yAxisG')
      .call(yAxis);

  Object.keys(data[0])
      .forEach(key => {
        if (key !== 'day') {
          const movieArea = d3.area()
              .x(d => xScale(d.day))
              .y0(yScale(0))
              .y1(d => yScale(d[key]))
              .curve(d3.curveCardinal);
          chart.append('path')
              .style('id', `${key}Area`)
              .attr('d', movieArea(data))
              .attr('fill', '#75739F')
              .attr('stroke', '#75739F')
              .attr('stroke-width', 3)
              .style('stroke-opapcity', 0.75)
              .style('fill-opacity', 0.5);
        }
      });
}
