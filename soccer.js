function createSoccerViz() {
  d3.csv('soccer.csv', data => {overallTeamViz(data)});
}

function overallTeamViz(data) {
  data.forEach(d => d.r = 20);

  d3.select('svg')
    .append('g')
    .attr('id', 'teamsG')
    .attr('transform', 'translate(50,100)')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'overallG')
    .attr('transform', (d, i) => `translate(${i * 100}, 0)`);

  const teamG = d3.selectAll('g.overallG');
  teamG
    .append('circle').attr('r', 0)
    .attr('id', (d, i) => `circle-${i}`)
    .transition()
    .delay((d, i) => i * 50)
    .duration(500)
    .attr('r', 40)
    .transition()
    .duration(500)
    .attr('r', 20);
  teamG
    .append('clipPath')
    .attr('id', (d, i) => `clip-${i}`)
    .append('use')
    .attr('href', (d, i) => `#circle-${i}`);
  teamG
    .append('image')
    .attr('clip-path', (d, i) => `url(#clip-${i})`)
    .attr('xlink:href', d => `soccer/images/${d.team}.svg`)
    .attr('height', '40px')
    .on('load', function () {
      d3.select(this)
        .attr('x', -this.getBBox().width / 2)
        .attr('y', -this.getBBox().height / 2);
    })
    .style('opacity', 0)
    .transition()
    .delay((d, i) => i * 50)
    .duration(1000)
    .style('opacity', 1);
  teamG
    .append('text')
    .attr('y', 60)
    .text(d => d.team)
    .style('pointer-events', 'none');

  const keys = Object.keys(data[0])
    .filter(d => d !== 'team' && d !== 'region');
  d3.select('#controls').selectAll('button.teams')
    .data(keys)
    .enter()
    .append('button')
    .on('click', buttonClick)
    .html(d => d);

	function buttonClick(datapoint) {
		const max = d3.max(data, d => parseFloat(d[datapoint]));
		const radiusScale =
        d3.scaleLinear()
          .domain([0, max])
          .range([10, 40])
          .clamp(true);
    const colorQuantize =
        d3.scaleQuantize()
          .domain([0, max])
          .range(colorbrewer.Blues[3]);
		d3.selectAll('g.overallG')
			.select('circle')
      .transition()
      .duration(1000)
      .each((d) => d.r = radiusScale(d[datapoint]))
			.attr('r', d => radiusScale(d[datapoint]))
      .style('fill', d => colorQuantize(d[datapoint]));
	}

  teamG.on('mouseover', highlightRegion);
  teamG.on('mouseout', unhighlight);

  d3.text('soccer-modal.html', html => {
    d3.select('body')
      .insert('div', '#viz')
      .attr('id', 'modal')
      .html(html);
  });
}

function highlightRegion(d, i) {
  const teamColor = d3.rgb('#75739F');
  d3.select(this)
    .raise()
    .classed('active', true);
  d3.selectAll('g.overallG')
    .select('text')
    .transition()
    .style('fill', p => p.region === d.region ? 'red' : 'black')
    .style('font-size', p => p.team == d.team ? '15px' : '10px')
    .style('font-weight', p => p.team === d.team ? 'bold' : 'normal');
  d3.selectAll('g.overallG')
    .select('circle')
    .transition()
    .style('stroke-width', p => p.team === d.team ? '3px' : '1px')
    .style('stroke', p => p.region === d.region ? 'red' : 'black')
    .attr('r', p => p.region === d.region ? p.r * 1.1 : p.r);
  teamClick(d, i);
}

function unhighlight(d, i) {
  const g = d3.selectAll('g.overallG');
  g.select('circle')
    .attr('class', null)
    .transition()
    .style('stroke-width', '1px')
    .style('stroke', 'black')
    .attr('r', p => p.region === d.region ? p.r / 1.1 : p.r);
  g.select('text').classed('active', false)
    .transition()
    .style('fill', '#000000')
    .style('font-size', '10px')
    .style('font-weight', 'normal');
}

function teamClick(d) {
  d3.selectAll('td.data')
    .data(d3.values(d))
    .html(p => p);
}
