function createViz() {
  const scatterData = [
    {friends: 5, salary: 22000},
    {friends: 3, salary: 18000},
    {friends: 10, salary: 88000},
    {friends: 0, salary: 180000},
    {friends: 27, salary: 56000},
    {friends: 8, salary: 74000}
  ];

  const xPadding = 20;
  const yPadding = 10;
  const xLength = 500;
  const yLength = 500;
  const xTicks = 10;
  const yTicks = 4;

  const xExtent = d3.extent(scatterData, d =>d.salary);
  const yExtent = d3.extent(scatterData, d =>d.friends);
  const xScale =
      d3.scaleLinear().domain(xExtent).range([xPadding, xLength + xPadding]);
  const yScale =
      d3.scaleLinear().domain(yExtent).range([yPadding + yLength, yPadding]);
  d3.select("svg")
    .selectAll("circle")
    .data(scatterData)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", d => xScale(d.salary))
    .attr("cy", d => yScale(d.friends));

  const yAxis = d3.axisLeft().scale(yScale).ticks(yTicks);
  d3.select("svg")
    .append("g")
    .call(yAxis)
    .attr("id", "yAxisG")
    .attr('transform', `translate(${xPadding}, 0)`);
  const xAxis = d3.axisBottom().scale(xScale).ticks(xTicks);
  d3.select("svg")
    .append("g")
    .call(xAxis)
    .attr("id", "xAxisG")
    .attr('transform', `translate(0, ${yPadding + yLength})`);
}
