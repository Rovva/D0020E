//var csv = require("./data.csv")


/*
It should return a color depending of case, used by the charts functions in this file.
*/

function getColor (type) {
    switch (type) {
        case 0: return "#A5F2F3";
        case 1: return "#40a4df";
        case 2: return "#A5F2F3";
        case 3: return "3F672C";
        case 4: return "#a18e7e";
        case 5: return "#b3ab93";
        default: return "#40a4df";
    }
    
}

/*
Returns what type of parameter depending on the case. Used in drawChart which is also used by main.js (?)
*/

function getLabel (key) {
    switch (key) {
        case -999: return "Undefined";
        case 1: return "Dry";
        case 2: return "Moist";
        case 3: return "Wet";
        case 4: return "Slush";
        case 5: return "Ice";
        case 6: return "Snow";
        default: return "Unknown";
    }
}



/*
Decides what type of chart to draw, (used in main.js). A case for linear graph will have to be implemented when working with graph implementation.
*/

function drawChart(type,data) {
    switch (type) {
        case "pie": {
            drawPie(data);
            break;
        }

        case "histogram": {
            drawHistogram(data);
            break;
        }
        case "linearGraph": {
            drawLinearGraph(data);
            break;
        }

    }
}

function drawTest(data){
	
}


function drawLinearGraph(data){
	var margin = {
	    top: 20,
	    right: 20,
	    bottom: 30,
	    left: 40
	},
	width = 450 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

	var x = d3.scaleTime().range([0, width]);

	var y = d3.scaleLinear().range([height, 0]);

	var color = d3.scaleOrdinal(d3.schemeCategory10);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	var line = d3.line()
	    
	    .x(function (d) {
	    return x(d.date);
	})
	    .y(function (d) {
	    return y(d.key);
	});

	var svg = d3.select("#graphs_container").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	color.domain(data.map(function (d) { return d.name; }));

	data.forEach(function (kv) {
	    kv.Data.forEach(function (d) {
		d.date = parseDate(d.date);
	    });
	});



	var minX = d3.min(data, function (v) { return d3.min(v.Data, function (d) { return d.date; }) });
	var maxX = d3.max(data, function (v) { return d3.max(v.Data, function (d) { return d.date; }) });
	var minY = d3.min(data, function (v) { return d3.min(v.Data, function (d) { return d.key; }) });
	var maxY = d3.max(data, function (v) { return d3.max(v.Data, function (d) { return d.key; }) });

	x.domain([minX, maxX]);
	y.domain([minY, maxY]);

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)


	var dat = svg.selectAll(".asd")
	    .data(data)
	    .enter().append("g")
	    .attr("class", "asd");

	dat.append("path")
	    .attr("class", "line")
	    .attr("d", function (d) {
	    return line(d.Data);
	})
	    .style("stroke", function (d) {
	    return color(d.name);
	});

	dat.append("text")
	    .datum(function (d) {
	    return {
		name: d.name,
		date: d.Data[d.Data.length - 1].date,
		key: d.Data[d.Data.length - 1].key
	    };
	})
	    .attr("transform", function (d) {
	    return "translate(" + x(d.date) + "," + y(d.key) + ")";
	})
	    .attr("x", 3)
	    .attr("dy", ".35em")
	    .text(function (d) {
		return d.name;
	});

	var btn = document.getElementById("graphsButton");
	$(btn).toggleClass("graphs-button-open",true);
	$("#graphs_div").toggleClass("graphs-div-open",true);
	//document.getElementById('graphs_container').appendChild(svg);
	window.scrollTo(0, document.getElementById("graphs_container").getBoundingClientRect().bottom);
}



/*
Uses D3JS to create a chart instead of Plotly.js.
*/

function drawHistogram(data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);



// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin

    var svg = d3.select("#graphs_container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");




    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return getLabel(d.key); }));
    y.domain([0, d3.max(data, function(d) { return d.doc_count; })]);


    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(getLabel(d.key)); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.doc_count); })
        .attr("height", function(d) { return height - y(d.doc_count); });



    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    var btn = document.getElementById("graphsButton");
    $(btn).toggleClass("graphs-button-open",true);
    $("#graphs_div").toggleClass("graphs-div-open",true);
    //document.getElementById('graphs_container').appendChild(svg);
    window.scrollTo(0, document.getElementById("graphs_container").getBoundingClientRect().bottom);
}

/*
ADD A FUNCTION drawLinear(data), should be called from drawChart when a case for linear graphs has been made.
*/


/*
Uses D3JS to create a chart instead of Plotly.js.
*/

function drawPie(data){

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 600 - margin.right - margin.left,
        height = 600    - margin.top - margin.bottom,
        radius = width/2;

    // color range
    var color = d3.scaleOrdinal()
        .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

    // pie chart arc. Need to create arcs before generating pie
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);


    // arc for the labels position
    var labelArc = d3.arc()
        .outerRadius(radius - 80)
        .innerRadius(radius - 80);

    // generate pie chart and donut chart
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.doc_count; });

    // define the svg for pie chart
    var svg = d3.select("#graphs_container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    // parse data
    data.forEach(function(d) {
        d.doc_count = +d.doc_count;
        d.key = getLabel(d.key);
    });

    // "g element is a container used to group other SVG elements"
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    // append path
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.key); })

    // append text
    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.key; });


/*
Belongs to the drawPie function but, not entirely sure what it actually does but without it the graphs does not work.
*/
    function tweenPie(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
    }

    var btn = document.getElementById("graphsButton");
    $(btn).toggleClass("graphs-button-open",true);
    $("#graphs_div").toggleClass("graphs-div-open",true);
    window.scrollTo(0, document.getElementById("graphs_container").getBoundingClientRect().bottom);
}
