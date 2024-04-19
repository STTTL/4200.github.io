// Define map dimensions and projection
var width = 960, height = 600;
var projection = d3.geoMercator().center([-74.0060, 40.7128]).scale(50000).translate([width / 2, height / 2]);
var path = d3.geoPath().projection(projection);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
var tooltip = d3.select("#tooltip");

// Load and render the borough boundaries as the base map
d3.json("Borough Boundaries.geojson").then(function(boroughData) {
    // Draw boroughs first
    svg.selectAll(".borough")
        .data(boroughData.features)
        .enter().append("path")
        .attr("class", "borough")
        .attr("d", path)
        .style("fill", "#ccc")
        .style("stroke", "#333");

    // Then load and render the bike routes
    d3.json("New York City Bike Routes.geojson").then(function(bikeRoutesData) {
        svg.selectAll(".bike-route")
            .data(bikeRoutesData.features)
            .enter().append("path")
            .attr("class", "bike-route")
            .attr("d", path)
            .style("stroke", "red") // Adjust the color as needed
            .style("fill", "none")
            .style("stroke-width", "1.5")
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html("Route: " + d.properties.name + "<br>Type: " + d.properties.route_type) // Adjust based on your GeoJSON
                       .style("left", (event.pageX) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    });
});

// Add zoom and pan functionality
var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", function(event) {
        svg.selectAll('path').attr('transform', event.transform);
    });

svg.call(zoom);
