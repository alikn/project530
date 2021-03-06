define(["dataProcess"], function (dataProcess) {

    var materials, rawData, sectorGroup, chosenMaterial, chosenSector;

    var margin = {top: 20, right: 17, bottom: 30, left: 67};
    var w = 840;
    var width = w - margin.left - margin.right;
    var h = 410;
    var height = h - margin.top - margin.bottom;
    var transitionSpeed = 500;

    var startYear = 1985, endYear = 2012, minLevel = 0, maxLevel = 455000;
    var panExtent = {x: [startYear, endYear], y: [minLevel, maxLevel]};
    var years = d3.range(startYear, endYear + 1);

    var vis, line, x, y, zoomListener, xAxis, yAxis, div;

    //an object with sectors' abbreviations as the key and sector group abbreviations as value
    var sector_sectorGroup = dataProcess.getSectorToSectorGroupHashMap();

    //an object with sectors' abbreviations as the key and sector full name as value
    var sectorCodes = dataProcess.getSectorCodesHashMap();

    var materialNames = dataProcess.getMaterialNames();

    function init() {
        setupD3();
        getData();
        drawAllPaths();
        setupAxes();

        //setting the correct titile for lineGraph
        $(".substance-title").text(materialNames[chosenMaterial]);
        //highlighting the preselected sector
        d3.select("[sector=" + chosenSector + "]").classed("selected", true);

        $("body").on("materialChangeEvent", materialChanged);
        $("body").on("sectorChangeEvent", sectorChanged);

        $("body").on("selectedSectorGroupsChange", selectedSectorGroupsChange);
        $("body").on("selectedSectorGroupsReset", selectedSectorGroupsReset);
    }

    function setupD3() {
        console.log("Max values:");
        console.log(dataProcess.getMaxValueForChosenMaterial());
        maxLevel = dataProcess.getMaxValueForChosenMaterial() + 5000;
        //update the pan extent variable
        panExtent.y[1] = maxLevel;

        x = d3.time.scale()
                .domain([startYear, endYear])
                .range([0, width]);

        y = d3.scale.linear()
                .domain([minLevel, maxLevel])
                .range([height, 0]);

        // create the zoom listener
        zoomListener = d3.behavior.zoom()
                .y(y)
                // .x(x)
                .scaleExtent([1, Infinity])
                .on("zoom", redraw);

        //create the x axis
        xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(6)
                .tickFormat(d3.format("0000"))
                .orient("bottom");

        //create the y axis
        yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(6)
                .tickPadding(1)
                .orient("left");

        //tooltip div
        div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


        vis = d3.select("#vis")
                .append("svg")
                .call(zoomListener)
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xAxisLine = vis.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        vis.append("g")
                .attr("class", "y axis")
                .call(yAxis);

        //label on the y axis
        vis.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("class", "axis-label")
                .attr("transform", "rotate(-90)")
                .attr("y", (-margin.left) + 9)
                .attr("x", -height / 2)
                .text('Tonnes/Year');
        //label on the x axis
        vis.append("g")
                .attr("class", "x axis")
                .append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + 12)
                .attr("y", height + 30)
                .text("Year");

        vis.append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

        line = d3.svg.line()
                .interpolate("basis") //change basis to linear to get back the straight line graph
                .x(function (d) {
                    return x(d.x);
                })
                .y(function (d) {
                    return y(d.y);
                });

        xAxisLine.selectAll('line').style({'stroke-width': '1px'});
    }

    function getData() {
        materials = dataProcess.getMaterials(),
                rawData = dataProcess.getRawData(),
                sectorGroup = dataProcess.getSectorGroup(),
                chosenMaterial = dataProcess.getChosenMaterial(),
                chosenSector = dataProcess.getChosenSector();
    }

    function drawAllPaths() {
        drawPath(rawData[chosenMaterial]);
    }

    //draws all paths of the graph
    function drawPath(pathsArray) {
        for (i = 1; i < pathsArray.length; i++) {
            var values = pathsArray[i].slice(1);


            var currData = [];

            for (j = 0; j < values.length; j++) {
                if (values[j] != '') {
                    currData.push({x: years[j], y: values[j]});
                }
            }

            vis.selectAll('.line')
                    .data([currData])
                    .enter()
                    .append("path")
                    .attr("clip-path", "url(#clip)")
                    .attr("sector", pathsArray[i][0])
                    .attr("class", sector_sectorGroup[pathsArray[i][0]] + " highlight linegraphPath")
                    .attr("ty", "line")
                    .attr("d", line)
                    .on("mouseover", onmouseover)
                    .on("mouseout", onmouseout)
                    .on("click", pathClicked);
        }
    }

    function materialChanged(event, newMaterial) {
        console.log("selected material: " + newMaterial);
        chosenMaterial = newMaterial;

        d3.select("svg").remove();

        setupD3();
        drawAllPaths();
        setupAxes();
        console.log(chosenSector);
        d3.select("[sector=" + chosenSector + "]").classed("selected", true);

        $(".substance-title").text(materialNames[newMaterial]);
    }

    function sectorChanged(event, newSector) {
        d3.select(".selected").classed("selected", false);
        d3.select("[sector=" + newSector + "]").classed("selected", true);
        chosenSector = newSector;
        console.log("selected sector: " + chosenSector);
    }

    function setupAxes() {
    }

    function selectedSectorGroupsChange(event, changedSectorCode) {
        changeDisplayingSectorGroups(changedSectorCode);
        rescaleLineGraph();
    }

    function selectedSectorGroupsReset() {
        var sectors = d3.selectAll("path");
        sectors.classed('highlight', true);
        rescaleLineGraph();
    }

    function changeDisplayingSectorGroups(sectorCode) {
        var sectors = d3.selectAll("path." + sectorCode);
        if (sectors.classed('highlight')) {
            sectors.classed("highlight", false);
        }
        else {
            sectors.classed('highlight', true);
        }
    }

    function rescaleLineGraph() {
        var maxVal = dataProcess.getMaxValueForDisplayingSectorsOfChosenMaterial();
        console.log("rescaling graph max " + maxVal);
        rescale(maxVal);
    }

    function pathClicked(d, i) {
        //d3.select(".selected").classed("selected", false);
        chosenSector = d3.select(this).attr("sector");
        //d3.select(this).classed("selected", true);
        //console.log("selected sector: " + chosenSector);
        $("body").trigger("sectorChangeEvent", chosenSector);
    }

    function onmouseover(d, i) {
        var currClass = d3.select(this).attr("class");
        d3.select(this).classed("current", true);
        var sectorCode = $(this).attr("sector");

        //This should be shown in a tooltip
        var blurb = '<h2>' + "Sector Group: " + sectorGroup[sector_sectorGroup[sectorCode]]
                + ", Sector: " + sectorCodes[sectorCode] + '</h2>';

        $("#default-blurb").hide();
        $("#blurb-content").html(blurb);

        //add tooltip
        div.style("display", "block");
        div.transition()
                .duration(200)
                .style("opacity", .9);
        div.html(sectorCodes[sectorCode])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        $("body").trigger("pathHoverIn", sector_sectorGroup[sectorCode]);

    }

    function onmouseout(d, i) {
        var currClass = d3.select(this).attr("class");
        var prevClass = currClass.substring(0, currClass.length - 8);
        //d3.select(this).attr("class", prevClass);
        d3.select(this).classed("current", false);
        $("#default-blurb").show();
        $("#blurb-content").html('');

        //hide tooltip
        div.style("display", "none");

        //filter highlight removal
        var sectorCode = $(this).attr("sector");
        $("body").trigger("pathHoverOut", sector_sectorGroup[sectorCode]);
    }

    function redraw() {
        /* call the zoom.translate vector with the array returned from panLimit() */
        //console.log("On rescale the limit is min:" + y.domain()[0] + " max:" + y.domain()[1]);
        //console.log("On rescale the panExtent is min:" + panExtent.y[0] + " max:" + panExtent.y[1]);
        zoomListener.translate(panLimit());
        vis.select(".y.axis")
                .transition().duration(transitionSpeed)
                .ease("sin-in-out").call(yAxis);
        vis.selectAll("[ty='line']")
                .transition().duration(transitionSpeed).ease("sin-in-out")
                .attr('d', line);
    }

    function rescale(max) {
        panExtent.y[1] = max;
        panExtent.y[0] = y.domain()[0];
        maxLevel = max;
        // zoomListener.translate(panLimit());

        if (y.domain()[0] >= 0) {
            y.domain([y.domain()[0], max]);
        } else {
            y.domain()[0] = 0;
            y.domain([y.domain()[0], max]);
        }



        vis.select(".y.axis")
                .transition().duration(transitionSpeed).ease("sin-in-out")
                .call(yAxis);
        vis.selectAll("[ty='line']")
                .transition().duration(transitionSpeed).ease("sin-in-out")
                .attr('d', line);

        y = d3.scale.linear()
                .domain([minLevel, maxLevel])
                .range([height, 0]);

        // recreate the zoom listener
        zoomListener = d3.behavior.zoom()
                .y(y)
                .scaleExtent([1, Infinity])
                .on("zoom", redraw);

        yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(6)
                .tickPadding(1)
                .orient("left");

        vis = d3.select("#vis")
                // .append("svg")
                .call(zoomListener);



    }

    function panLimit() {

        var divisor = {h: height / ((y.domain()[1] - y.domain()[0]) * zoomListener.scale()), w: width / ((x.domain()[1] - x.domain()[0]) * zoomListener.scale())},
        minX = -(((x.domain()[0] - x.domain()[1]) * zoomListener.scale()) + (panExtent.x[1] - (panExtent.x[1] - (width / divisor.w)))),
                minY = -(((y.domain()[0] - y.domain()[1]) * zoomListener.scale()) + (panExtent.y[1] - (panExtent.y[1] - (height * (zoomListener.scale()) / divisor.h)))) * divisor.h,
                maxX = -(((x.domain()[0] - x.domain()[1])) + (panExtent.x[1] - panExtent.x[0])) * divisor.w * zoomListener.scale(),
                maxY = (((y.domain()[0] - y.domain()[1]) * zoomListener.scale()) + (panExtent.y[1] - panExtent.y[0])) * divisor.h * zoomListener.scale(),
                tx = x.domain()[0] < panExtent.x[0] ?
                minX :
                x.domain()[1] > panExtent.x[1] ?
                maxX :
                zoomListener.translate()[0],
                ty = y.domain()[0] < panExtent.y[0] ?
                minY :
                y.domain()[1] > panExtent.y[1] ?
                maxY :
                zoomListener.translate()[1];
        return [1, ty];
    }

    return{
        init: init
    };
});