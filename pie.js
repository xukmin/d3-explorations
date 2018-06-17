function createChart() {
  const pie = d3.pie().sort(null);
  const data1 = [1, 3, 2, 5, 10, 6].sort((a, b) => b - a);
  const data2 = [10, 4, 6, 2, 3, 8];
  const data3 = [4, 2, 1, 12, 20, 6];

  const pieData0 = pie(data1)
      .map(d => {
        d.endAngle = d.startAngle;
        return d;
      });
  const pieData1 = pie(data1);
  const pieData2 = pie(data2);
  const pieData3 = pie(data3);

  const augmentedData = data1.map((d, i) => ({
    slice0: pieData0[i],
    slice1: pieData1[i],
    slice2: pieData2[i],
    slice3: pieData3[i],
  }));

  const arc = d3.arc()
      .innerRadius(20)
      .outerRadius(100);

  const fillScale = d3.scaleOrdinal(d3.schemeCategory10);
  d3.select('svg')
      .append('g')
      .attr('transform', `translate(250, 250)`)
      .selectAll('path')
      .data(augmentedData)
      .enter()
      .append('path')
      .attr('class', 'pie')
      .attr('d', d => arc(d.slice0))
      .style('fill', (d, i) => fillScale(i))
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', 0.5)
      .on('mouseover', highlight)
      .on('mouseout', unhighlight)
      .on('click', highlight)
      .transition()
      .duration(1000)
      .attrTween('d', arcTween(arc, 'slice0', 'slice1'));

  let transitions = data1.length;

  return;

  d3.selectAll('path.pie')
      .data(augmentedData)
      .transition()
      .duration(1000)
      .attrTween('d', arcTween(arc, 'slice1', 'slice2'))
      .on('end', () => {
        if (--transitions === 0) {
          d3.selectAll('path.pie')
              .transition()
              .duration(1000)
              .attrTween('d', arcTween(arc, 'slice2', 'slice3'));
        }
      });
}

function arcTween(arc, srcSlice, dstSlice) {
  return d => {
    return t => {
      const interpolateStartAngle =
          d3.interpolate(d[srcSlice].startAngle, d[dstSlice].startAngle);
      const interpolateEndngle =
          d3.interpolate(d[srcSlice].endAngle, d[dstSlice].endAngle);
      d.startAngle = interpolateStartAngle(t);
      d.endAngle = interpolateEndngle(t);
      return arc(d);
    }
  }
}

function highlight() {
  d3.select(this)
      .style('stroke-width', '3px')
      .style('opacity', 1);
}

function unhighlight() {
  d3.select(this)
      .style('stroke-width', '1px')
      .style('opacity', 0.5);
}
