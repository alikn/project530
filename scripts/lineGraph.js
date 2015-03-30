define(["dataProcess"], function (dataProcess) {

    var materials, rawData, sectorGroup, chosenMaterial, chosenSector;

    var margin = {top: 20, right: 30, bottom: 30, left: 50};
    var w = 890;
    var width = w - margin.left - margin.right;
    var h = 550;
    var height = h - margin.top - margin.bottom;

    var startYear = 1985, endYear = 2012, startAge = 0, endAge = 455000;
    var years = d3.range(startYear, endYear+1);

    var x = d3.time.scale()
            .domain([startYear, endYear])
            .range([0, width]);

    var y = d3.scale.linear()
            .domain([startAge, endAge])
            //.clamp(true)
            .range([height, 0]);

    // create the zoom listener
    var zoomListener = d3.behavior.zoom()
            .y(y)
            // .x(x)
            .scaleExtent([1, 25])
            .on("zoom", redraw);

    //create the x axis
    var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(6)            
           // .tickPadding(10)        
          //  .tickFormat(d3.format(".0f"))
         // .tickValues([])
          .tickFormat(d3.format("0000"))         
          // .ticks(d3.time.minute, 1)
            .orient("bottom");

//create the y axis
    var yAxis = d3.svg.axis()
            .scale(y)
           // .tickPadding(2)           
           // .tickSize(-width)            
            .orient("left");

    //tooltip div
    var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    var vis, line;   

    //an object with sectors' abbreviations as the key and sector group abbreviations as value
    var sector_sectorGroup = dataProcess.getSectorToSectorGroupHashMap();

    //an object with sectors' abbreviations as the key and sector full name as value
    var sectorCodes = dataProcess.getSectorCodesHashMap();    
  
    function init() {
        setupD3();
        getData();
        drawAllPaths();
        setupAxes();

        $("body").on("materialChangeEvent", materialChanged);
        $("body").on("sectorChangeEvent", sectorChanged);
    }

    function setupD3() {
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
                .attr("y", (-margin.left) + 10)
                .attr("x", -height)
                .text('Tonnes');
        //label on the x axis
        vis.append("g")
                .attr("class", "x axis")               
                .append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "end")
                .attr("x", width + 25)
                .attr("y", height)
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
       
        xAxisLine.selectAll('line').style({ 'stroke-width': '1px'});       
    }

    function getData(){
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
                    .attr("class", sector_sectorGroup[pathsArray[i][0]])
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

        $(".substance-title").text(newMaterial.toUpperCase());
    }

    function sectorChanged(event, newSector) {
        d3.select(".selected").classed("selected", false);
        d3.select("[sector=" + newSector + "]").classed("selected", true);
        chosenSector = newSector;
        console.log("selected sector: " + chosenSector);
    }

    function setupAxes() {
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
    }

    function redraw() {        

        var tx = d3.event.translate[0];
        var ty = d3.event.translate[1];
        console.log("y domain   " + y.domain()[0]);
        if (y.domain()[0] < 0) {
           // this.dispatchEvent(new Event('mousedown'));
            //this.dispatchEvent(new Event('mouseup'));
            ty = Math.min(0, Math.max(ty, height - Math.round(y(endAge) - y(0)), height - Math.round(y(endAge) - y(0)) * d3.event.scale));
            zoomListener.translate([tx, ty]);
          //  return;
          vis.select(".y.axis").call(yAxis);
            vis.selectAll("[ty='line']").attr('d', line);
        } else {
            vis.select(".y.axis").call(yAxis);
            vis.selectAll("[ty='line']").attr('d', line);
        }  
    }    
        
    return{
        init: init
    };
});