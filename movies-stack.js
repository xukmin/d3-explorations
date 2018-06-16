function createChart() {
  d3.csv('movies.csv', plotChart);
}

function plotChart(data) {
  const maxStacked = d3.max(data.map(d =>
    Object.keys(d).reduce((sum, key) => {
      if (key !== 'day') {
        return sum + parseInt(d[key]);
      } else {
        return sum;
      }
    }, 0)
  ));
  console.log('maxStacked = ' + maxStacked);

  const xSize = 640;
  const ySize = 480;
  const xPadding = (1024 - 640) / 2;
  const yPadding = (768 - 480) / 2;
  const xDomainHeadroomRatio = 0.1;

  const chart = d3.select('svg')
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${xPadding}, ${yPadding})`);

  const xScale = d3.scaleLinear()
      .domain([1, data.length])
      .range([0, xSize]);
  const yScale = d3.scaleLinear()
      .domain([0, maxStacked * (1 + xDomainHeadroomRatio)])
      .range([ySize, 0]);

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

  const fillScale = d3.scaleOrdinal(d3.schemeCategory10);

  Object.keys(data[0])
      .forEach(key => {
        if (key !== 'day') {
          const movieArea = d3.area()
              .x(d => xScale(d.day))
              .y0(d => yScale(simpleStacking(d, key) - d[key]))
              .y1(d => yScale(simpleStacking(d, key)))
              .curve(d3.curveBasis);
          chart.append('path')
              .style('id', `${key}Area`)
              .attr('d', movieArea(data))
              .attr('fill', fillScale(key))
              .attr('stroke', 'black')
              .attr('stroke-width', 1)
              .style('fill-opacity', 0.5)
              .on('mouseover', highlight)
              .on('mouseout', unhighlight)
              .on('click', highlight);
        }
      });
}

function simpleStacking(lineData, lineKey) {
  let height = 0;
  Object.keys(lineData).every(key => {
    if (key !== 'day') {
      height += parseInt(lineData[key]);
      if (key === lineKey) {
        return false;
      }
    }
    return true;
  })
  return height;
}

function highlight() {
  d3.select(this)
      .attr('stroke-width', 3)
      .style('fill-opacity', 1)
}

function unhighlight() {
  d3.select(this)
      .attr('stroke-width', 1)
      .style('fill-opacity', 0.5);
}

