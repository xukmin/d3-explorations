function createMatrix() {
  const matrix = [
		[11975,  5871, 8916, 2868],
		[ 1951, 10048, 2060, 6171],
		[ 8010, 16145, 8090, 8045],
		[ 1013,   990,  940, 6907],
	];

	const tr = d3.select("body")
		.append("table")
		.selectAll("tr")
		.data(matrix)
		.enter().append("tr");

	const td = tr.selectAll("td")
		.data(d => d)
		.enter()
    .append("td")
		.text(d => d);
}
