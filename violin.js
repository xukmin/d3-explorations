function createChart() {
  const ySize = 400;
  const xPadding = 20;
  const yPadding = 20;

  const fillScale = d3.scaleOrdinal(d3.schemeCategory10);

  const normal = d3.randomNormal();
  const sampleData = [...Array(3)].map(d => d3.range(100).map(e => normal()));

  const numThresholds = 13;
  const maxDomain = 3;
  const thresholds =
      [...Array(numThresholds).keys()]
          .map(i => 2 * maxDomain * i / (numThresholds - 1) - maxDomain);
  const histogram = d3.histogram()
      .domain([-3, 3])
      .thresholds(thresholds)
      .value(d => d);

  const yScale = d3.scaleLinear()
      .domain([-maxDomain, maxDomain])
      .range([ySize, 0]);
  const yAxis = d3.axisRight()
      .scale(yScale);
  d3.select('svg').append('g').call(yAxis);

  const area = d3.area()
      .x0(d => -d.length)
      .x1(d => d.length)
      .y(d => yScale(d.x0))
      .curve(d3.curveCatmullRom);

  d3.select('svg')
      .selectAll('g.violin')
      .data(sampleData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${50 + i * 100}, 0)`)
      .append('path')
      .style('stroke', 'black')
      .style('fill', (d, i) => fillScale(i))
      .attr('d', d => area(histogram(d)));
}
