// @TODO: YOUR CODE HERE!
// set up the chart
var svg_width = 800;
var svg_height = 425;
var margin = { top: 30, right: 40, bottom: 50, left: 120 };
var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;

// create an SVG holder and append so that it will hold the chart
var svg = d3.select(".chart")
    .append("svg")
    .attr("height", svg_height)
    .attr("width", svg_width)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// append svg chart
var chart = svg.append("g");
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);
path = "assets/data/data.csv";
d3.csv(path, function (err, data) {
    if (err) throw err;

    // copy data
    dataset = data

    // setup tooltip
    var tool_tip = d3.tip()
        .attr("class", "tooltip")
        .offset([20, -30])
        .html(function (data) {
            var state = data.state;return state;
        });

    // create tooltip
    chart.call(tool_tip);

    // define scale and axis functions
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    // these variables store the min and max values in a column in data.csv
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // create a function to grab min, max values of a column in data.csv
    function findMinAndMaxX(dataColumnX) {
        xMin = d3.min(dataset, function (d) { return d[dataColumnX] * 0.75 });
        xMax = d3.max(dataset, function (d) { return d[dataColumnX] * 1.25 });
    };
    function findMinAndMaxY(dataColumnY) {
        yMin = d3.min(dataset, function (d) { return d[dataColumnY] * 0.75 });
        yMax = d3.max(dataset, function (d) { return d[dataColumnY] * 1.25 });
    };

    // set the default x-axis
    var axis_x = "smokes"

    // set the default y-axis
    var axis_y = "obesity"

    // call the findMinAndMax() on the X Axis
    findMinAndMaxX(axis_x)
    findMinAndMaxY(axis_y)

    // set the domain of the axises
    xScale.domain([xMin, xMax]);
    yScale.domain([yMin, yMax]);

     // create the chart
    chart.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr('id', 'marker')
        .attr("cx", function (d) {return xScale(d[axis_x]);
        })
        .attr("cy", function (d) {return yScale(d[axis_y]);
        })
        .attr("r", 12)
        
    // create state labels
    chart.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {return d.abbr;
        })
        .attr("x", function (d) {return xScale(d[axis_x]);
        })
        .attr("y", function (d) {return yScale(d[axis_y]);
        })
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .attr("text-anchor", "middle")
        .attr("class","stateText")

        // display tooltip on mouseover
        .on("mouseover", function (d) {
            tool_tip.show(d);
        })
        // hide tooltip on mouseout
        .on("mouseout", function (d, i) {
            tool_tip.hide(d);
        })

    // create x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .attr("stroke-width", "thick")
        .call(xAxis);

    // create y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .attr("stroke-width", "thick")
        .call(yAxis)

    // // append x-axis titles
    chart.append("text")
        .attr("transform", `translate(${width / 2},${height + 40})`)
        .attr("class", "axis-text-x active")
        .attr("data-axis-name", "smokingLevel")
        .text("Median Smoking Level %");

    // append y-axis titles 
    chart.append("text")
        .attr("transform", `translate(-40,${height / 2})rotate(270)`)
        .attr("class", "axis-text-y active")
        .attr("data-axis-name", "ObesityLevel")
        .text("Median Obesity Level %");

    // set up the x-axis
    d3.selectAll(".axis-text-x"), function () {

            // create x-axis
            d3.selectAll("circle")
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("r", 18);
                })
                .attr("cx", function (d) {return xScale(d[axis_label_x]);
                })

            d3.selectAll(".stateText")
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .attr("x", function (d) {return xScale(d[axis_label_x]);
                    })
            
            labelChangeX(clickedSelection);
        };
    
    // do the same thing above for the y axis below
    // set up the y-axis
    d3.selectAll(".axis-text-y"), function () {

            // create y-axis
            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("r", 18);
                })

                .attr("cy", function (data) {return yScale(data[axis_label_y]);
                })

            d3.selectAll(".stateText")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("y", function (d) {return yScale(d[axis_label_y]);
                })

            labelChangeY(clickedSelection);
        };
});