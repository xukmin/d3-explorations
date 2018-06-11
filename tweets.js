function createChart() {
  d3.json('tweets.json', (error, data) => plotCharts(data.tweets));
}

function plotCharts(data) {
  plotHistogram(data);
  plotPieChart(data);
}

function plotHistogram(data) {
  const xScale = d3.scaleLinear().domain([0, 5]).range([0, 500]);
  const yScale = d3.scaleLinear().domain([0, 10]).range([400, 0]);
  const xAxis = d3.axisBottom().scale(xScale).ticks(5);

  const histogram = d3.histogram()
      .domain([0, 5])
      .thresholds([0, 1, 2, 3, 4, 5])
      .value(d => d.favorites.length);

  function showRetweets() {
    histogram.value(d => d.retweets.length);

    d3.select('g.chart')
        .datum({source: 'retweets'})
        .selectAll('rect.histogram')
        .data(histogram(data))
//        .on('click', showFavorites)
        .transition()
        .duration(500)
        .attr('y', d => yScale(d.length))
        .attr('height', d => 400 - yScale(d.length))
        .style('fill', 'blue');
  }

  function showFavorites() {
    histogram.value(d => d.favorites.length);

    d3.select('g.chart')
        .datum({source: 'favorites'})
        .selectAll('rect.histogram')
        .data(histogram(data))
//        .on('click', showRetweets)
        .transition()
        .duration(500)
        .attr('y', d=> yScale(d.length))
        .attr('height', d => 400 - yScale(d.length))
        .style('fill', '#6CD88B');
  }

  function switchChart() {
    switch (d3.select(this).datum().source) {
      case 'favorites':
        showRetweets();
        break;
      case 'retweets':
        showFavorites();
        break;
    }
  }

  const chart = d3.select('svg')
      .append('g')
      .attr('class', 'chart')
      .datum({source: 'favorites'})
      .on('click', switchChart);

  chart.selectAll('rect.histogram')
      .data(histogram(data))
      .enter()
      .append('rect')
      .attr('class', 'histogram')
      .attr('x', d => xScale(d.x0))
      .attr('y', d => yScale(d.length))
      .attr('width', d => {
        const width = xScale(d.x1 - d.x0);
        return width - 2 > 0 ? width - 2 : 0;
      })
      .attr('height', d => 400 - yScale(d.length))
      .style('fill', '#6CD88B')
//      .on('click', showRetweets);

  chart.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0, 400)`)
      .call(xAxis)
      .attr('stroke-width', 0)
      .selectAll('text')
      .attr('dx', 50);
}

function plotPieChart(data) {
  const nestedData = d3.nest()
      .key(d => d.user)
      .entries(data);
  nestedData.forEach(d => {
    d.numTweets = d.values.length;
    d.numFavorites = d3.sum(d.values, p => p.favorites.length);
    d.numRetweets = d3.sum(d.values, p => p.retweets.length);
    console.log('d = ', d.numTweets, d.numFavorites, d.numRetweets);
  });

  const arc = d3.arc()
      .innerRadius(20)
      .outerRadius(100);

  const pie = d3.pie()
      .sort(null);

  pie.value(d => d.numTweets);
  const tweetsPieData = pie(nestedData);

  pie.value(d => d.numFavorites);
  const favoritesPieData = pie(nestedData);

  pie.value(d => d.numRetweets);
  const retweetsPieData = pie(nestedData);

  nestedData.forEach((d, i) => {
    d.tweetsSlice = tweetsPieData[i];
    d.favoritesSlice = favoritesPieData[i];
    d.retweetsSlice = retweetsPieData[i];
  });

  const fillScale = d3.scaleOrdinal(d3.schemeCategory10);
  d3.select('svg')
      .append('g')
      .attr('transform', `translate(500, 250)`)
      .selectAll('path')
      .data(nestedData)
      .enter()
      .append('path')
      .attr('class', 'pie')
      .attr('d', d => arc(d.tweetsSlice))
      .style('fill', (d, i) => fillScale(i))
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', 0.5)
      .on('mouseover', highlight)
      .on('mouseout', unhighlight)
      .on('click', highlight);

  let transitions = nestedData.length;

  // TODO(yaozhenx):
  // generalize function to do a series of transitions.
  /*
  d3.selectAll('path.pie')
      .transition()
      .duration(1000)
      .attrTween('d', arcTween(arc, 'tweetsSlice', 'favoritesSlice'))
      .on('end', () => {
        if (--transitions === 0) {
          transitions = nestedData.length;
          d3.selectAll('path.pie')
              .transition()
              .duration(1000)
              .attrTween('d', arcTween(arc, 'favoritesSlice', 'retweetsSlice'))
              .on('end', () => {
                if (--transitions === 0) {
                  console.log('transition completed.');
                }
              });
        }
      });
*/
  carousel(arc, ['tweetsSlice', 'favoritesSlice', 'retweetsSlice']);
}

function carousel(arc, keys) {
  const slices = d3.selectAll('path.pie');
  const data = slices.data();
  let transitions = data.length;

  d3.selectAll('path.pie')
      .transition()
      .duration(1000)
      .attrTween('d', arcTween(arc, keys[0], keys[1]))
      .attrTween('transform', translateTween)
      .on('end', () => {
        if (--transitions === 0) {
          keys.push(keys.shift());
          carousel(arc, keys);
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
   };
  };
}

function translateTween(d) {
	return t => {
		if (d.isHighlighted) {
			const offset = 20;
			angle = (d.startAngle + d.endAngle) / 2;
			const x = Math.sin(angle) * offset;
			const y = -Math.cos(angle) * offset;
			return `translate(${x}, ${y})`;
		} else {
			return `translate(0, 0)`;
		}
	};
}

function highlight() {
  d3.select(this)
      .style('stroke-width', '3px')
      .style('opacity', 1)
//      .transition()
      .attr('transform', d => {
        d.isHighlighted = true;
        const offset = 10;
        angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.sin(angle) * offset;
        const y = -Math.cos(angle) * offset;
        return `translate(${x}, ${y})`;
      });
}

function unhighlight() {
  d3.select(this)
      .style('stroke-width', '1px')
      .style('opacity', 0.5)
//      .transition()
      .attr('transform', d => {
        d.isHighlighted = false;
        return 'translate(0, 0)';
      });
}

