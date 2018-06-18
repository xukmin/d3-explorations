function createChart() {
  const roleScale = d3.scaleOrdinal()
      .range(['#75739F', '#41A368', '#FE9922']);

  const sampleData = d3.range(500)
      .map((d, i) => ({
        r: 5,  // Math.abs(d3.randomNormal()()) * 10 + 2,
        value: 512 + (d3.randomNormal(512, 0.5)() - 512) * 200, x: 512, y: i}));

  const manyBody = d3.forceManyBody().strength(10);
  const center = d3.forceCenter().x(512).y(384);

  const force = d3.forceSimulation()
      .force('collision', d3.forceCollide(d => d.r))
      .force('y', d3.forceY(384))
      .force('x', d3.forceX(d => d.value).strength(3))
      .nodes(sampleData)
      .on('tick', updateNetwork);
  //force.on('end', force.restart);

  d3.select('svg')
      .selectAll('circle')
      .data(sampleData)
      .enter()
      .append('circle')
      .style('fill', (d, i) => roleScale(i))
      .attr('r', d => d.r)
      .on('mouseover', disturb)
      .on('mouseout', restore)

  function updateNetwork() {
    d3.selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
  }

  function disturb(d) {
    d.r = 40;
    d3.select(this)
        .transition()
        .attr('r', d => d.r);
    //d.x = d3.mouse(this)[0] + d3.randomUniform(-50, 50)();
    //d.y = d3.mouse(this)[1] + d3.randomUniform(-50, 50)();
    force.force('collision', d3.forceCollide(d => d.r))
        .nodes(sampleData)
        .alpha(Math.max(0.1, force.alpha()))
        .restart();
  }

  function restore(d) {
    d.r = 5;
    d3.select(this)
        .transition()
        .attr('r', d => d.r);
    force.force('collision', d3.forceCollide(d => d.r))
        .nodes(sampleData)
        .alpha(Math.max(0.1, force.alpha()))
        .restart();
    //force.alphaTarget(0);
  }
}

