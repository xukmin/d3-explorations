function createViz() {
  d3.csv('boxplot.csv', plot);
}

function plot(data) {
  const xLength = 640;
  const yLength = 480;
  const xPadding = 40;
  const yPadding = 20;
  const xScale = d3.scaleLinear()
      .domain([0, 8])
      .range([xPadding, xLength + xPadding])
  const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([yLength + yPadding, yPadding]);
  const yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(8)
      .tickSize(10);
  d3.select('svg')
      .append('g')
      .attr('transform', `translate(${xPadding}, 0)`)
      .attr('id', 'yAxisG')
      .call(yAxis);
  const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickSize(10)
      .tickValues([1, 2, 3, 4, 5, 6, 7]);
  d3.select('svg')
      .append('g')
      .attr('transform', `translate(0, ${yLength + yPadding})`)
      .attr('id', 'xAxisG')
      .call(xAxis);
/*
  d3.select('svg')
      .selectAll('circle.median')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'tweets')
      .attr('r', 5)
      .attr('cx', d => xScale(d.day))
      .attr('cy', d => yScale(d.median))
      .style('fill', 'darkgray');
*/
/*
  d3.select('svg')
      .selectAll('g.box')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'box')
      .attr('transform', d =>
        `translate(${xScale(d.day)}, ${yScale(d.median)})`
      ).append('rect')
      .style('opacity', 0.5)
      .attr('x', -10)
      .attr('y', d => yScale(d.q3) - yScale(d.median))
      .attr('width', 20)
      .attr('height', d => yScale(d.q1) - yScale(d.q3));
*/
  const boxes = d3.select('svg')
      .selectAll('g.box')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'box')
      .attr('transform', d => `translate(${xScale(d.day)}, ${yScale(d.median)})`);
  boxes.append('line')
      .attr('class', 'range')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', d => yScale(d.max) - yScale(d.median))
      .attr('y2', d => yScale(d.min) - yScale(d.median))
      .style('stroke', 'black')
      .style('stroke-width', '4px');
  boxes.append('line')
      .attr('class', 'min')
      .attr('x1', -10)
      .attr('x2', 10)
      .attr('y1', d => yScale(d.min) - yScale(d.median))
      .attr('y2', d => yScale(d.min) - yScale(d.median))
      .style('stroke', 'black');
  boxes.append('line')
      .attr('class', 'max')
      .attr('x1', -10)
      .attr('x2', 10)
      .attr('y1', d => yScale(d.max) - yScale(d.median))
      .attr('y2', d => yScale(d.max) - yScale(d.median))
      .style('stroke', 'black');
  boxes.append('rect')
      .attr('class', 'range')
      .attr('x', -10)
      .attr('y', d => yScale(d.q3) - yScale(d.median))
      .attr('width', 20)
      .attr('height', d => yScale(d.q1) - yScale(d.q3))
      .style('stroke', 'black')
      .style('fill', 'white');
  boxes.append('line')
      .attr('x1', -10)
      .attr('x2', 10)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', 'darkgray')
      .style('stroke-width', '4px');
}
