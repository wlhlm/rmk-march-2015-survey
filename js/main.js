var num_responses = 842;

function add_chart(element, chart_description, custom_legend) {
	var data;

	$(element).append("<div></div>");

	chart_description.bindto = element + " > div";

	var chart = c3.generate(chart_description);
	if (custom_legend) {
		data = chart_description.data.columns;

		add_custom_legend(chart, element, data);
	}

	return chart;
}

function round_percentage(num) { return Math.round(num * 10000) / 100; }
function percentage(num) { return round_percentage(num) + '%'; }

function add_custom_legend(chart, chart_container, data) {
	var sum = 0;
	for (var i = 0; i < data.length; i++) {
		data[i] = data[i].filter(function(v) { return v != undefined; });
	}
	for (var i = 0; i < data.length; i++) {
		sum += data[i][1];
	}

	for (var j = 0; j < data.length; j++) {
		data[j].push(percentage(data[j][1] / num_responses));
	}
	data.push(['Total', sum + ' out of ' + num_responses, percentage(sum / num_responses)]);

	d3.select(chart_container).append("table")
		.attr("class", "legendtbl")
		.selectAll("tr")
		.data(data)
		.enter().append("tr")
		.on('mouseover', function(id) { chart.focus(id[0]); })
		.on('mouseout', function(id) { chart.revert(); })
		.on('click', function(id) {
			chart.toggle(id[0]);
			chart.revert();
		})
		.attr("class", "c3-legend-item")
		.selectAll("td")
		.data(function(d) { return d; })
		.enter().append("td")
		.text(function(d) { return d; });
}

function uniform_colors(chart) {
	var colors = chart.data.colors();
	var keys = Object.keys(colors)
	var color = colors[keys[0]];

	for (var i = 0; i < keys.length; i++) {
		colors[keys[i]] = color;
	}

	chart.data.colors(colors);
}
